import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import RightSidebar from './components/RightSidebar';
import IdeaFeed from './components/IdeaFeed';
import IdeaDetailView from './components/IdeaDetailView';
import SubmitIdeaForm from './components/SubmitIdeaForm';
import ProfilePage from './components/ProfilePage';
import AuthPage from './components/AuthPage';
import VerificationRequiredPage from './components/VerificationRequiredPage';
import ToastNotification from './components/ToastNotification';
import ShareModal from './components/ShareModal';
import Dashboard from './components/Dashboard';
import { Idea, User, Comment } from './types';

const USERS_STORAGE_KEY = 'ideon_users_storage';
const IDEAS_STORAGE_KEY = 'ideon_ideas_storage';

// --- Security Utils (Simulation) ---
// In a real app, this would be handled by a secure backend and a library like bcrypt.
const hashPassword = (password: string): string => {
  // Simulate a salt and hash process
  const salt = Math.random().toString(36).substring(2, 12);
  const combined = password + salt;
  // A simple, non-secure hash for demonstration
  const simpleHash = combined.split('').reverse().join('');
  return `${salt}:${simpleHash}`;
};

const comparePassword = (password: string, storedHash: string): boolean => {
  try {
    const [salt, hash] = storedHash.split(':');
    if (!salt || !hash) { // Handle old, non-salted format for backward compatibility
        return `hashed_${password.split('').reverse().join('')}` === storedHash;
    }
    const combined = password + salt;
    const simpleHashToCompare = combined.split('').reverse().join('');
    return hash === simpleHashToCompare;
  } catch (e) {
    return false;
  }
};


const MOCK_USERS: User[] = [
    { id: 'u1', name: 'Alex Johnson', avatarUrl: 'https://picsum.photos/seed/u1/100/100', title: 'Innovator', email: 'alex.j@ideon.com', phone: '111-222-3333', bio: 'Serial entrepreneur with a passion for AI and HealthTech. Looking to build products that make a meaningful impact on people\'s lives.', password: hashPassword('password123'), emailVerified: true, verificationCode: null, verificationCodeExpires: null },
    { id: 'u2', name: 'Samantha Bee', avatarUrl: 'https://picsum.photos/seed/u2/100/100', title: 'Founder & CEO', email: 'samantha.b@ideon.com', phone: '222-333-4444', bio: 'Visionary leader focused on decentralized technologies and building the future of the internet. Believer in Web3 and user data ownership.', password: hashPassword('password123'), emailVerified: true, verificationCode: null, verificationCodeExpires: null },
    { id: 'u3', name: 'Ken Watanabe', avatarUrl: 'https://picsum.photos/seed/u3/100/100', title: 'Product Manager', email: 'ken.w@ideon.com', phone: '333-444-5555', bio: 'Experienced Product Manager with a knack for turning complex problems into simple, elegant solutions. Drone enthusiast.', password: hashPassword('password123'), emailVerified: true, verificationCode: null, verificationCodeExpires: null },
    { id: 'u4', name: 'Priya Sharma', avatarUrl: 'https://picsum.photos/seed/u4/100/100', title: 'Lead Engineer', email: 'priya.s@ideon.com', phone: '444-555-6666', bio: 'Full-stack engineer specializing in scalable systems and machine learning infrastructure. Loves tackling hard technical challenges.', password: hashPassword('password123'), emailVerified: true, verificationCode: null, verificationCodeExpires: null }
];

const MOCK_IDEAS: Idea[] = [
  {
    id: 'idea1',
    title: 'AI-Powered Personal Nutritionist',
    summary: 'A mobile app that uses AI to create personalized meal plans based on your health goals, dietary restrictions, and local grocery availability.',
    description: 'Our app, "NutriMind," leverages machine learning to analyze user health data from wearables, and provides real-time, adaptive meal suggestions. It also generates a smart shopping list that optimizes for budget and reduces food waste. We aim to make healthy eating effortless and accessible for everyone.',
    market: 'Health-conscious individuals, fitness enthusiasts, and people with specific dietary restrictions who want a convenient and intelligent way to manage their nutrition.',
    author: MOCK_USERS[0],
    tags: ['AI', 'HealthTech', 'Mobile App', 'SaaS'],
    likes: 3,
    likedBy: ['u2', 'u3', 'u4'],
    comments: [
        { id: 'c1', user: MOCK_USERS[2], text: 'This is a fantastic concept! The grocery integration is a game-changer.', createdAt: Date.now() - 2 * 60 * 60 * 1000, likes: 15, likedBy: [], parentId: null},
        { id: 'c2', user: MOCK_USERS[3], text: 'What tech stack are you considering for the AI model?', createdAt: Date.now() - 1 * 60 * 60 * 1000, likes: 8, likedBy: [], parentId: null},
        { id: 'c1-reply1', user: MOCK_USERS[0], text: 'Thanks, Ken! We\'re thinking of using TensorFlow for the model and React Native for the app itself to ensure cross-platform compatibility.', createdAt: Date.now() - 1 * 55 * 60 * 1000, likes: 5, likedBy: [], parentId: 'c2'},
        { id: 'c1-reply2', user: MOCK_USERS[3], text: 'Solid choice. Let me know if you need help with the backend architecture.', createdAt: Date.now() - 1 * 50 * 60 * 1000, likes: 3, likedBy: [], parentId: 'c2'}
    ],
    isForSale: false,
    team: [MOCK_USERS[0], MOCK_USERS[3]],
    lookingFor: ['Marketing Lead', 'UX/UI Designer', 'Data Scientist'],
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
    isSeekingCoFounder: true,
    views: 152,
    shares: 28,
  },
  {
    id: 'idea2',
    title: 'Decentralized Social Media Platform',
    summary: 'A next-gen social network built on blockchain technology that gives users full control over their data and content monetization.',
    description: '"ConnectSphere" is a decentralized social media platform where users own their data. By using blockchain, we ensure transparency, security, and censorship resistance. Creators can monetize their content directly through crypto tokens without intermediaries. Our vision is to build a more equitable and user-centric digital social space.',
    market: 'Users concerned with data privacy, content creators seeking fair monetization, and individuals disillusioned with traditional, centralized social media platforms.',
    author: MOCK_USERS[1],
    tags: ['Blockchain', 'Web3', 'Social Media', 'Decentralization'],
    likes: 2,
    likedBy: ['u1', 'u3'],
    comments: [],
    isForSale: true,
    price: 50000,
    team: [MOCK_USERS[1]],
    lookingFor: ['Blockchain Developer', 'Community Manager'],
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
    isSeekingCoFounder: false,
    views: 89,
    shares: 12,
  },
  {
    id: 'idea3',
    title: 'Hyper-Local Drone Delivery Service',
    summary: 'An on-demand delivery service using a fleet of autonomous drones for small packages in urban environments, focusing on speed and efficiency.',
    description: '"SwiftWing Delivery" offers under-15-minute delivery for items like pharmaceuticals, documents, and small electronics within a 5-mile radius. Our autonomous drones navigate using advanced AI-powered routing systems to ensure safety and speed. We partner with local businesses to provide a premium, eco-friendly delivery option.',
    market: 'Urban businesses and consumers who require rapid delivery for small, high-value items, such as pharmacies, labs, and e-commerce companies offering premium shipping.',
    author: MOCK_USERS[2],
    tags: ['Drones', 'Logistics', 'AI', 'Sustainability'],
    likes: 2,
    likedBy: ['u1', 'u4'],
    comments: [
      { id: 'c3', user: MOCK_USERS[0], text: 'Regulatory hurdles could be a challenge, but the potential is huge.', createdAt: Date.now() - 5 * 60 * 60 * 1000, likes: 22, likedBy: [], parentId: null }
    ],
    isForSale: false,
    team: [MOCK_USERS[2], MOCK_USERS[1]],
    lookingFor: ['Robotics Engineer', 'Operations Manager', 'Legal Counsel'],
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago
    isSeekingCoFounder: true,
    views: 230,
    shares: 45,
  }
];

type FilterType = 'all' | 'new' | 'trending' | 'most-liked' | 'most-shared';
type ViewType = 'explore' | 'my-dashboard' | 'cofounder' | 'my-ideas' | 'liked-ideas' | 'messages' | 'settings';
type SignUpData = Omit<User, 'id' | 'title' | 'bio' | 'emailVerified' | 'verificationCode' | 'verificationCodeExpires'>;


const App: React.FC = () => {
    const [users, setUsers] = useState<User[]>(() => {
    try {
        const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
        return storedUsers ? JSON.parse(storedUsers) : MOCK_USERS;
    } catch (error) {
        console.error("Failed to load users from localStorage", error);
        return MOCK_USERS;
    }
  });

  const [ideas, setIdeas] = useState<Idea[]>(() => {
    try {
        const storedIdeas = localStorage.getItem(IDEAS_STORAGE_KEY);
        // Quick migration for old data structure
        const loadedIdeas = storedIdeas ? JSON.parse(storedIdeas) : MOCK_IDEAS;
        return loadedIdeas.map((idea: Idea) => ({
            ...idea,
            market: idea.market || 'Not specified',
            likedBy: idea.likedBy || [],
            views: idea.views || 0,
            shares: idea.shares || 0,
        }));
    } catch (error) {
        console.error("Failed to load ideas from localStorage", error);
        return MOCK_IDEAS;
    }
  });
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [isSubmitFormOpen, setIsSubmitFormOpen] = useState(false);
  const [viewingProfileUser, setViewingProfileUser] = useState<User | null>(null);
  const [userAwaitingVerification, setUserAwaitingVerification] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sharingContent, setSharingContent] = useState<{ url: string; title: string; } | null>(null);


  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [activeView, setActiveView] = useState<ViewType>('explore');

  // Persist users to localStorage
  useEffect(() => {
    try {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
        console.error("Failed to save users to localStorage", error);
    }
  }, [users]);

  // Persist ideas to localStorage
  useEffect(() => {
    try {
        localStorage.setItem(IDEAS_STORAGE_KEY, JSON.stringify(ideas));
    } catch (error) {
        console.error("Failed to save ideas to localStorage", error);
    }
  }, [ideas]);
  
  // Check for logged-in user on initial app load
  useEffect(() => {
    try {
      const storedUserId = localStorage.getItem('loggedInUserId');
      if (storedUserId) {
        const user = users.find(u => u.id === storedUserId);
        if (user) {
          if (!user.emailVerified) {
            setUserAwaitingVerification(user.email);
            setCurrentUser(null);
            localStorage.removeItem('loggedInUserId');
          } else {
            setCurrentUser(user);
          }
        } else {
          localStorage.removeItem('loggedInUserId');
        }
      }
    } catch (error) {
      console.error("Could not access localStorage:", error);
    }
  }, [users]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchQuery]);


  const handleSelectIdea = (idea: Idea) => {
    setSelectedIdea(idea);
    // Increment view count
    setIdeas(prevIdeas => prevIdeas.map(i => 
        i.id === idea.id ? { ...i, views: (i.views || 0) + 1 } : i
    ));
  };

  const handleCloseDetail = () => {
    setSelectedIdea(null);
  };
  
  const handleOpenSubmitForm = () => {
    setIsSubmitFormOpen(true);
  };

  const handleCloseSubmitForm = () => {
    setIsSubmitFormOpen(false);
  };

  const handleViewProfile = (user: User) => {
    setViewingProfileUser(user);
  };

  const handleCloseProfile = () => {
    setViewingProfileUser(null);
  };

  const handleShare = (type: 'idea' | 'profile', id: string, title: string) => {
    const baseUrl = window.location.origin;
    const url = `${baseUrl}/${type}/${id}`;
    setSharingContent({ url, title });

    // If sharing an idea, increment its share count
    if (type === 'idea') {
        setIdeas(prevIdeas => prevIdeas.map(idea =>
            idea.id === id ? { ...idea, shares: (idea.shares || 0) + 1 } : idea
        ));
    }
  };
  
  const handleCloseShareModal = () => {
      setSharingContent(null);
  };
  
  const handleCopyLink = () => {
      setToast({ message: 'Link copied to clipboard!', type: 'success' });
  };

  
  const handleLogin = (emailOrUsername: string, password: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const user = users.find(u => 
                u.email.toLowerCase() === emailOrUsername.toLowerCase() || u.name.toLowerCase() === emailOrUsername.toLowerCase()
            );
            
            if (!user) {
                return reject(new Error("User not found."));
            }

            if (!user.password || !comparePassword(password, user.password)) {
                 return reject(new Error("Password is incorrect."));
            }

            if (!user.emailVerified) {
                setUserAwaitingVerification(user.email);
                return reject(new Error("Email verification required."));
            }

            setCurrentUser(user);
            try {
                localStorage.setItem('loggedInUserId', user.id);
            } catch (error) {
                console.error("Failed to save session to localStorage:", error);
            }
            resolve();

        }, 1000); // Simulate network delay
    });
  };

  const handleSignUp = (newUserData: SignUpData): Promise<void> => {
      return new Promise((resolve, reject) => {
          setTimeout(() => {
              const emailExists = users.some(u => u.email.toLowerCase() === newUserData.email.toLowerCase());
              if (emailExists) {
                  return reject(new Error("Email already in use."));
              }
              const nameExists = users.some(u => u.name.toLowerCase() === newUserData.name.toLowerCase());
              if (nameExists) {
                  return reject(new Error("Username already taken."));
              }

              const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
              const verificationCodeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

              const newUser: User = {
                  ...newUserData,
                  id: `u${Date.now()}`,
                  title: 'New Member',
                  bio: 'Welcome to Ideon! Edit your profile to add a bio.',
                  password: hashPassword(newUserData.password || ''),
                  emailVerified: false,
                  verificationCode,
                  verificationCodeExpires,
              };
              setUsers(prev => [...prev, newUser]);
              setUserAwaitingVerification(newUser.email);
              resolve();
          }, 1000); // Simulate network delay
      });
  };

  const handleVerifyCode = (email: string, code: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userIndex = users.findIndex(u => u.email === email);
        if (userIndex === -1) {
            return reject(new Error("User not found."));
        }

        const userToVerify = users[userIndex];

        if (userToVerify.verificationCode !== code || (userToVerify.verificationCodeExpires && Date.now() > userToVerify.verificationCodeExpires)) {
             return reject(new Error("Invalid or expired code. Please try again."));
        }
        
        const verifiedUser = {
            ...userToVerify,
            emailVerified: true,
            verificationCode: null,
            verificationCodeExpires: null,
        };

        const newUsers = [...users];
        newUsers[userIndex] = verifiedUser;
        setUsers(newUsers);

        setCurrentUser(verifiedUser);
        setUserAwaitingVerification(null);
        try {
            localStorage.setItem('loggedInUserId', verifiedUser.id);
        } catch (error) {
            console.error("Failed to save session to localStorage:", error);
        }
        setToast({ message: "Email successfully verified! You are now logged in.", type: 'success' });
        resolve();
      }, 500);
    });
  };
  
  const handleResendVerification = (email: string): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(() => { // Simulate network delay
            setUsers(prevUsers => {
                const newUsers = [...prevUsers];
                const userIndex = newUsers.findIndex(u => u.email === email);
                if (userIndex > -1) {
                    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
                    const verificationCodeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
                    newUsers[userIndex] = {
                        ...newUsers[userIndex],
                        verificationCode,
                        verificationCodeExpires,
                    };
                }
                return newUsers;
            });
            setToast({ message: "A new verification code has been sent.", type: 'success' });
            resolve();
        }, 1000);
    });
  };

  const handleLogout = () => {
      setCurrentUser(null);
      try {
        localStorage.removeItem('loggedInUserId');
      } catch (error) {
        console.error("Failed to clear session from localStorage:", error);
      }
  };

  const handleUpdateUser = (updatedUser: User) => {
    if (currentUser?.id === updatedUser.id) {
        setCurrentUser(updatedUser);
    }

    const newUsers = users.map(u => (u.id === updatedUser.id ? updatedUser : u));
    setUsers(newUsers);

    const newIdeas = ideas.map(idea => {
      const updatedIdea = { ...idea };
      if (updatedIdea.author.id === updatedUser.id) {
        updatedIdea.author = updatedUser;
      }
      updatedIdea.team = idea.team.map(member =>
        member.id === updatedUser.id ? updatedUser : member
      );
      updatedIdea.comments = idea.comments.map(comment =>
        comment.user.id === updatedUser.id
          ? { ...comment, user: updatedUser }
          : comment
      );
      return updatedIdea;
    });
    setIdeas(newIdeas);

    if (viewingProfileUser && viewingProfileUser.id === updatedUser.id) {
      setViewingProfileUser(updatedUser);
    }
  };

  const handleIdeaSubmit = (newIdeaData: Omit<Idea, 'id' | 'author' | 'likes' | 'comments' | 'team' | 'createdAt' | 'likedBy' | 'views' | 'shares'>) => {
    if (!currentUser) return;
    const newIdea: Idea = {
      ...newIdeaData,
      id: `idea-${Date.now()}`,
      author: currentUser,
      likes: 0,
      likedBy: [],
      comments: [],
      team: [currentUser],
      createdAt: Date.now(),
      views: 0,
      shares: 0,
    };
    setIdeas([newIdea, ...ideas]);
  };

  const handleLikeIdea = (ideaId: string) => {
    if (!currentUser) return;

    const ideaUpdater = (idea: Idea): Idea => {
        if (idea.id === ideaId) {
            const liked = idea.likedBy.includes(currentUser.id);
            const newLikedBy = liked
                ? idea.likedBy.filter(uid => uid !== currentUser.id)
                : [...idea.likedBy, currentUser.id];
            return { ...idea, likedBy: newLikedBy, likes: newLikedBy.length };
        }
        return idea;
    };

    setIdeas(prevIdeas => prevIdeas.map(ideaUpdater));

    if (selectedIdea && selectedIdea.id === ideaId) {
        setSelectedIdea(prevIdea => prevIdea ? ideaUpdater(prevIdea) : null);
    }
  };

  const handleAddComment = (ideaId: string, text: string, parentId: string | null) => {
    if (!currentUser) return;
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      user: currentUser,
      text,
      createdAt: Date.now(),
      likes: 0,
      likedBy: [],
      parentId,
    };
    const updateIdeas = (prevIdeas: Idea[]) => prevIdeas.map(idea => {
      if (idea.id === ideaId) {
        return { ...idea, comments: [...idea.comments, newComment] };
      }
      return idea;
    });
    setIdeas(updateIdeas);
    if (selectedIdea && selectedIdea.id === ideaId) {
        setSelectedIdea(prev => prev ? {...prev, comments: [...prev.comments, newComment]} : null);
    }
  };

  const handleEditComment = (ideaId: string, commentId: string, text: string) => {
    const updateIdeas = (prevIdeas: Idea[]) => prevIdeas.map(idea => {
        if (idea.id === ideaId) {
            const updatedComments = idea.comments.map(c => c.id === commentId ? { ...c, text } : c);
            return { ...idea, comments: updatedComments };
        }
        return idea;
    });
    setIdeas(updateIdeas);
    if (selectedIdea && selectedIdea.id === ideaId) {
        const updatedComments = selectedIdea.comments.map(c => c.id === commentId ? { ...c, text } : c);
        setSelectedIdea(prev => prev ? {...prev, comments: updatedComments} : null);
    }
  };

  const handleDeleteComment = (ideaId: string, commentId: string) => {
    const updateIdeas = (prevIdeas: Idea[]) => prevIdeas.map(idea => {
        if (idea.id === ideaId) {
            const commentsToDelete = new Set<string>([commentId]);
            let changed = true;
            while(changed){
                changed = false;
                const sizeBefore = commentsToDelete.size;
                idea.comments.forEach(c => {
                    if(c.parentId && commentsToDelete.has(c.parentId)){
                        commentsToDelete.add(c.id);
                    }
                });
                if(commentsToDelete.size > sizeBefore) changed = true;
            }
            const updatedComments = idea.comments.filter(c => !commentsToDelete.has(c.id));
            return { ...idea, comments: updatedComments };
        }
        return idea;
    });
    setIdeas(updateIdeas);
     if (selectedIdea && selectedIdea.id === ideaId) {
        const commentsToDelete = new Set<string>([commentId]);
        let changed = true;
        while(changed){
            changed = false;
            const sizeBefore = commentsToDelete.size;
            selectedIdea.comments.forEach(c => {
                if(c.parentId && commentsToDelete.has(c.parentId)){
                    commentsToDelete.add(c.id);
                }
            });
            if(commentsToDelete.size > sizeBefore) changed = true;
        }
        const updatedComments = selectedIdea.comments.filter(c => !commentsToDelete.has(c.id));
        setSelectedIdea(prev => prev ? {...prev, comments: updatedComments} : null);
    }
  };
  
  const handleLikeComment = (ideaId: string, commentId: string) => {
    if (!currentUser) return;
    const updateIdeas = (prevIdeas: Idea[]) => prevIdeas.map(idea => {
        if (idea.id === ideaId) {
            const updatedComments = idea.comments.map(c => {
                if (c.id === commentId) {
                    const liked = c.likedBy.includes(currentUser.id);
                    const newLikedBy = liked ? c.likedBy.filter(uid => uid !== currentUser.id) : [...c.likedBy, currentUser.id];
                    const newLikes = newLikedBy.length;
                    return { ...c, likes: newLikes, likedBy: newLikedBy };
                }
                return c;
            });
            return { ...idea, comments: updatedComments };
        }
        return idea;
    });
    setIdeas(updateIdeas);
    if (selectedIdea && selectedIdea.id === ideaId) {
        const updatedComments = selectedIdea.comments.map(c => {
             if (c.id === commentId) {
                const liked = c.likedBy.includes(currentUser.id);
                const newLikedBy = liked ? c.likedBy.filter(uid => uid !== currentUser.id) : [...c.likedBy, currentUser.id];
                const newLikes = newLikedBy.length;
                return { ...c, likes: newLikes, likedBy: newLikedBy };
            }
            return c;
        });
        setSelectedIdea(prev => prev ? {...prev, comments: updatedComments} : null);
    }
  };


  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
  };

  const handleNavigate = (view: ViewType) => {
    setActiveView(view);
    setIsSidebarOpen(false); // Close sidebar on navigation
  };
  
  const sortedAndFilteredIdeas = useMemo(() => {
    if (!currentUser) return [];

    let baseIdeas = ideas;

    switch (activeView) {
        case 'cofounder':
            baseIdeas = ideas.filter(idea => idea.isSeekingCoFounder);
            break;
        case 'my-ideas':
            baseIdeas = ideas.filter(idea => idea.author.id === currentUser.id);
            break;
        case 'liked-ideas':
            baseIdeas = ideas.filter(idea => idea.likedBy.includes(currentUser.id));
            break;
        case 'explore':
        default:
            baseIdeas = ideas;
            break;
    }

    const filtered = baseIdeas.filter(idea => {
      const query = debouncedSearchQuery.toLowerCase().trim();
      if (!query) return true;
      
      const titleMatch = idea.title.toLowerCase().includes(query);
      const summaryMatch = idea.summary.toLowerCase().includes(query);
      const authorMatch = idea.author.name.toLowerCase().includes(query);
      const tagMatch = idea.tags.some(tag => tag.toLowerCase().includes(query));

      return titleMatch || summaryMatch || authorMatch || tagMatch;
    });

    const sorted = [...filtered];
    switch(activeFilter) {
      case 'new':
        sorted.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case 'trending':
        const calculateScore = (idea: Idea) => idea.likes + (idea.comments.length * 2) + (idea.shares * 3) + (idea.views / 10);
        sorted.sort((a, b) => calculateScore(b) - calculateScore(a));
        break;
      case 'most-liked':
        sorted.sort((a, b) => b.likes - a.likes);
        break;
      case 'most-shared':
        sorted.sort((a, b) => (b.shares || 0) - (a.shares || 0));
        break;
      case 'all':
      default:
        // sort by creation date by default
        sorted.sort((a, b) => b.createdAt - a.createdAt);
        break;
    }

    return sorted;
  }, [ideas, currentUser, activeView, debouncedSearchQuery, activeFilter]);
  
  if (userAwaitingVerification) {
    return <VerificationRequiredPage 
        email={userAwaitingVerification} 
        users={users} 
        onResend={handleResendVerification} 
        onVerify={handleVerifyCode}
    />;
  }

  if (!currentUser) {
      return <AuthPage onLogin={handleLogin} onSignUp={handleSignUp} />;
  }
  
  const VIEW_CONTENT: Record<ViewType, { title: string; subtitle: string }> = {
    'explore': { title: 'Explore Revolutionary Ideas', subtitle: 'Browse, collaborate, and invest in the next generation of startups. Your next big opportunity is just a click away.' },
    'my-dashboard': { title: 'My Dashboard', subtitle: 'Track the performance and engagement of your ideas.' },
    'cofounder': { title: 'Find Your Next Co-founder', subtitle: 'Connect with innovators and join the team that will build the future. These projects are actively looking for partners.' },
    'my-ideas': { title: 'My Ideas', subtitle: 'Here are all the innovative concepts you have shared with the community.' },
    'liked-ideas': { title: 'Liked Ideas', subtitle: 'A collection of ideas that have sparked your interest.' },
    'messages': { title: 'Messages', subtitle: 'Stay connected with other innovators. (Coming Soon)' },
    'settings': { title: 'Settings', subtitle: 'Manage your account and preferences. (Coming Soon)' }
  };
  
  const currentContent = VIEW_CONTENT[activeView];

  const renderMainContent = () => {
    switch (activeView) {
      case 'explore':
      case 'cofounder':
      case 'my-ideas':
      case 'liked-ideas':
        return (
          <IdeaFeed
            ideas={sortedAndFilteredIdeas}
            onSelectIdea={handleSelectIdea}
            onLikeIdea={handleLikeIdea}
            onViewProfile={handleViewProfile}
            onShareIdea={(id, title) => handleShare('idea', id, title)}
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
            title={currentContent.title}
            subtitle={currentContent.subtitle}
            currentUser={currentUser}
          />
        );
      case 'my-dashboard':
        return <Dashboard ideas={ideas} currentUser={currentUser} onSelectIdea={handleSelectIdea} />;
      case 'messages':
      case 'settings':
         return (
             <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
                 <h1 className="text-4xl font-extrabold text-center mb-4 tracking-tight">{currentContent.title}</h1>
                 <p className="text-center text-slate-400 mb-8 max-w-2xl mx-auto">{currentContent.subtitle}</p>
             </div>
         );
      default:
        return null;
    }
  };

  return (
    <>
    <div className="min-h-screen flex bg-slate-900 text-white">
       {toast && (
        <ToastNotification
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      <Sidebar 
        activeView={activeView} 
        onNavigate={handleNavigate} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onSubmitIdeaClick={handleOpenSubmitForm}
      />
      
      {/* Backdrop for mobile */}
      {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/60 z-30 lg:hidden"></div>}

      <div className="flex-1 flex flex-col min-w-0">
          <Header 
            currentUser={currentUser}
            onSubmitIdeaClick={handleOpenSubmitForm} 
            onProfileClick={() => handleViewProfile(currentUser)}
            onLogout={handleLogout}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onToggleSidebar={() => setIsSidebarOpen(true)}
          />
          <main className="flex-1 flex overflow-hidden">
            <div className="flex-1 overflow-y-auto" key={activeView}>
                <div className="animate-fade-in">
                  {renderMainContent()}
                </div>
            </div>
             <RightSidebar 
                ideas={ideas}
                users={users}
                currentUser={currentUser}
                onSelectIdea={handleSelectIdea}
                onViewProfile={handleViewProfile}
            />
          </main>
      </div>

      {selectedIdea && (
        <IdeaDetailView 
            idea={selectedIdea} 
            currentUser={currentUser}
            onClose={handleCloseDetail} 
            onViewProfile={handleViewProfile}
            onAddComment={handleAddComment}
            onEditComment={handleEditComment}
            onDeleteComment={handleDeleteComment}
            onLikeComment={handleLikeComment}
            onLikeIdea={handleLikeIdea}
            onShare={(id, title) => handleShare('idea', id, title)}
        />
      )}
      {isSubmitFormOpen && <SubmitIdeaForm currentUser={currentUser} onClose={handleCloseSubmitForm} onSubmit={handleIdeaSubmit} />}
      {viewingProfileUser && <ProfilePage user={viewingProfileUser} currentUser={currentUser} ideas={ideas} onClose={handleCloseProfile} onUpdateUser={handleUpdateUser} onShare={(id, title) => handleShare('profile', id, title)} />}
      {sharingContent && (
        <ShareModal
          content={sharingContent}
          onClose={handleCloseShareModal}
          onLinkCopy={handleCopyLink}
        />
      )}
    </div>
    <style>{`
      @keyframes fade-in {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in {
        animation: fade-in 0.4s ease-out forwards;
      }
    `}</style>
    </>
  );
};

export default App;
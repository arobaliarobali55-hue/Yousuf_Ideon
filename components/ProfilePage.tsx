import React, { useState, useRef, useEffect } from 'react';
import { User, Idea } from '../types';
import { XIcon, Edit2Icon, UserIcon, LightbulbIcon, CameraIcon, Share2Icon } from './icons';

interface ProfilePageProps {
  user: User;
  currentUser: User;
  ideas: Idea[];
  onClose: () => void;
  onUpdateUser: (user: User) => void;
  onShare: (userId: string, name: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, currentUser, ideas, onClose, onUpdateUser, onShare }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<User>(user);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isOwnProfile = user.id === currentUser.id;
  const userIdeas = ideas.filter(idea => idea.author.id === user.id);

  useEffect(() => {
    setFormData(user);
    setIsEditing(false);
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
    }

    const imageToDataUrl = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const img = new Image();
                img.src = reader.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 256;
                    const MAX_HEIGHT = 256;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        return reject(new Error('Could not get canvas context'));
                    }
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', 0.9));
                };
                img.onerror = (err) => reject(err);
            };
            reader.onerror = (err) => reject(err);
        });
    };

    imageToDataUrl(file)
        .then(compressedDataUrl => {
            setFormData(prev => ({ ...prev, avatarUrl: compressedDataUrl }));
        })
        .catch(error => {
            console.error("Error processing image:", error);
            alert("There was an error processing your image. Please try a different one.");
        });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser(formData);
  };

  const handleCancel = () => {
    setFormData(user);
    setIsEditing(false);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-40 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-fade-in-up">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center space-x-2">
            <UserIcon className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold text-white">{isOwnProfile ? "My Profile" : `${user.name}'s Profile`}</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="relative flex-shrink-0">
              <img src={formData.avatarUrl} alt={formData.name} className="w-24 h-24 rounded-full border-4 border-slate-600 object-cover" />
              {isOwnProfile && isEditing && (
                <>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button 
                    type="button" 
                    onClick={handlePhotoUploadClick}
                    className="absolute bottom-0 right-0 bg-slate-700 hover:bg-slate-600 rounded-full p-2 border-2 border-slate-800 transition-colors"
                    aria-label="Change profile photo"
                  >
                    <CameraIcon className="w-5 h-5 text-white" />
                  </button>
                </>
              )}
            </div>
            <div className="flex-grow text-center sm:text-left">
              {!isEditing ? (
                <>
                  <h3 className="text-2xl font-bold text-white">{user.name}</h3>
                  <p className="text-cyan-400">{user.title}</p>
                  <p className="text-slate-400 text-sm mt-1">{user.email}</p>
                  <p className="text-slate-300 mt-3 text-sm">{user.bio}</p>
                  <div className="mt-4 flex items-center justify-center sm:justify-start space-x-2">
                    {isOwnProfile && (
                        <button onClick={() => setIsEditing(true)} className="flex items-center space-x-2 text-sm font-semibold px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors">
                            <Edit2Icon className="w-4 h-4"/>
                            <span>Edit Profile</span>
                        </button>
                    )}
                    <button onClick={() => onShare(user.id, user.name)} className="flex items-center space-x-2 text-sm font-semibold px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors">
                        <Share2Icon className="w-4 h-4"/>
                        <span>Share</span>
                    </button>
                  </div>
                </>
              ) : (
                <form onSubmit={handleSave} className="space-y-3">
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full bg-slate-700 border-slate-600 rounded-md text-xl font-bold focus:ring-cyan-500 focus:border-cyan-500" />
                  <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="w-full bg-slate-700 border-slate-600 rounded-md text-cyan-400 focus:ring-cyan-500 focus:border-cyan-500" />
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full bg-slate-700 border-slate-600 rounded-md text-sm focus:ring-cyan-500 focus:border-cyan-500" />
                  <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows={3} required className="w-full bg-slate-700 border-slate-600 rounded-md text-sm focus:ring-cyan-500 focus:border-cyan-500"></textarea>
                  <div className="flex justify-end space-x-3 pt-2">
                    <button type="button" onClick={handleCancel} className="px-4 py-2 text-sm font-semibold bg-slate-600 hover:bg-slate-500 rounded-md transition-colors">Cancel</button>
                    <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 hover:bg-cyan-600 rounded-md transition-colors">Save Changes</button>
                  </div>
                </form>
              )}
            </div>
          </div>

          <div className="mt-8 border-t border-slate-700 pt-6">
            <h4 className="font-semibold text-slate-200 mb-4 flex items-center"><LightbulbIcon className="w-5 h-5 mr-2 text-cyan-400"/> {isOwnProfile ? "My" : ""} Ideas ({userIdeas.length})</h4>
            <div className="space-y-3">
              {userIdeas.length > 0 ? userIdeas.map(idea => (
                <div key={idea.id} className="bg-slate-700/50 p-3 rounded-lg">
                  <p className="font-bold text-slate-100">{idea.title}</p>
                  <p className="text-xs text-slate-400 mt-1">{idea.summary}</p>
                </div>
              )) : (
                <p className="text-slate-400 text-sm text-center py-4">{isOwnProfile ? "You haven't" : `${user.name} hasn't`} submitted any ideas yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
       <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
        input, textarea {
            color-scheme: dark;
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
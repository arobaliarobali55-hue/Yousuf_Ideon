import React from 'react';
import { XIcon, LinkIcon, MailIcon, FacebookIcon, TwitterIcon, LinkedInIcon, WhatsAppIcon } from './icons';

interface ShareModalProps {
  content: {
    url: string;
    title: string;
  };
  onClose: () => void;
  onLinkCopy: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ content, onClose, onLinkCopy }) => {
  const { url, title } = content;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const socialLinks = [
    { name: 'Facebook', icon: FacebookIcon, href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, color: 'bg-blue-600' },
    { name: 'X (Twitter)', icon: TwitterIcon, href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, color: 'bg-black' },
    { name: 'LinkedIn', icon: LinkedInIcon, href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`, color: 'bg-blue-700' },
    { name: 'WhatsApp', icon: WhatsAppIcon, href: `https://api.whatsapp.com/send?text=${encodedTitle} ${encodedUrl}`, color: 'bg-green-500' },
    { name: 'Email', icon: MailIcon, href: `mailto:?subject=${encodedTitle}&body=Check out this on Ideon: ${encodedUrl}`, color: 'bg-slate-600' },
  ];
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
        onLinkCopy();
        onClose();
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md flex flex-col animate-fade-in-up">
        <div className="p-5 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">Share this</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-6">
            <p className="text-sm text-slate-300">Share this link via</p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 text-center">
                {socialLinks.map(link => (
                    <a 
                        key={link.name} 
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center space-y-2 group"
                    >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform transform group-hover:scale-110 ${link.color}`}>
                            <link.icon className="w-6 h-6 text-white"/>
                        </div>
                        <span className="text-xs text-slate-400 group-hover:text-white">{link.name}</span>
                    </a>
                ))}
            </div>
             <div>
                <p className="text-sm text-slate-300 mb-2">Or copy link</p>
                <div className="flex items-center space-x-2">
                    <div className="flex-grow bg-slate-700 rounded-md px-3 py-2 text-sm text-cyan-300 overflow-hidden text-ellipsis whitespace-nowrap">
                        {url}
                    </div>
                    <button onClick={handleCopyLink} className="flex-shrink-0 flex items-center space-x-2 px-3 py-2 bg-slate-600 hover:bg-slate-500 rounded-md transition-colors text-sm font-semibold">
                        <LinkIcon className="w-4 h-4"/>
                        <span>Copy</span>
                    </button>
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
      `}</style>
    </div>
  );
};

export default ShareModal;

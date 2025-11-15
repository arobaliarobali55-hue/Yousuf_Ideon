import React, { useState } from 'react';
import { Idea, User } from '../types';
import { XIcon, SparklesIcon } from './icons';
import { enhanceIdeaWithAI } from '../services/geminiService';

interface SubmitIdeaFormProps {
  currentUser: User;
  onClose: () => void;
  onSubmit: (idea: Omit<Idea, 'id' | 'author' | 'likes' | 'likedBy' | 'comments' | 'team' | 'createdAt'>) => void;
}

const SubmitIdeaForm: React.FC<SubmitIdeaFormProps> = ({ currentUser, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [market, setMarket] = useState('');
  const [tags, setTags] = useState('');
  const [isForSale, setIsForSale] = useState(false);
  const [price, setPrice] = useState('');
  const [lookingFor, setLookingFor] = useState('');
  const [isSeekingCoFounder, setIsSeekingCoFounder] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      summary,
      description,
      market,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      isForSale,
      price: isForSale ? Number(price) : undefined,
      lookingFor: lookingFor.split(',').map(skill => skill.trim()).filter(Boolean),
      isSeekingCoFounder,
    });
    onClose();
  };
  
  const handleEnhance = async () => {
    if (!description) return;
    setIsEnhancing(true);
    try {
        const enhancedDescription = await enhanceIdeaWithAI(title, description);
        setDescription(enhancedDescription);
    } catch (error) {
        console.error("Failed to enhance idea:", error);
    } finally {
        setIsEnhancing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-fade-in-up">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center flex-shrink-0">
          <h2 className="text-xl font-bold text-white">Submit Your Idea</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <form id="submit-idea-form" onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-300">Idea Title</label>
            <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required placeholder="Enter the title of your idea" className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 text-white"/>
          </div>
          <div>
            <label htmlFor="summary" className="block text-sm font-medium text-slate-300">Summary (1-2 sentences)</label>
            <textarea id="summary" value={summary} onChange={e => setSummary(e.target.value)} rows={2} required placeholder="Briefly describe your idea" className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 text-white"></textarea>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-300">Description</label>
            <div className="relative">
                <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={5} required placeholder="Describe your idea in detail" className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 text-white pr-28"></textarea>
                 <button type="button" onClick={handleEnhance} disabled={isEnhancing || !description} className="absolute top-2 right-2 flex items-center space-x-1.5 px-2 py-1.5 text-xs font-semibold rounded-md bg-purple-600 text-white hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors">
                    {isEnhancing ? 'Enhancing...' : 'Enhance with AI'}
                    {!isEnhancing && <SparklesIcon className="w-4 h-4" />}
                </button>
            </div>
          </div>
           <div>
            <label htmlFor="market" className="block text-sm font-medium text-slate-300">Market / Audience</label>
            <textarea id="market" value={market} onChange={e => setMarket(e.target.value)} rows={2} required placeholder="Who is this idea for?" className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 text-white"></textarea>
          </div>
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-slate-300">Tags (comma-separated)</label>
            <input type="text" id="tags" value={tags} onChange={e => setTags(e.target.value)} placeholder="e.g., AI, HealthTech, SaaS" className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 text-white"/>
          </div>
          <div>
            <label htmlFor="lookingFor" className="block text-sm font-medium text-slate-300">Looking for (skills, comma-separated)</label>
            <input type="text" id="lookingFor" value={lookingFor} onChange={e => setLookingFor(e.target.value)} placeholder="e.g., Marketing, Engineering" className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 text-white"/>
          </div>
          <div className="space-y-3 pt-2">
              <div className="flex items-center">
                  <input id="isSeekingCoFounder" type="checkbox" checked={isSeekingCoFounder} onChange={e => setIsSeekingCoFounder(e.target.checked)} className="h-4 w-4 text-cyan-600 bg-slate-700 border-slate-500 rounded focus:ring-cyan-500"/>
                  <label htmlFor="isSeekingCoFounder" className="ml-2 block text-sm text-slate-300">Looking for Co-Founder</label>
              </div>
              <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                      <input id="isForSale" type="checkbox" checked={isForSale} onChange={e => setIsForSale(e.target.checked)} className="h-4 w-4 text-cyan-600 bg-slate-700 border-slate-500 rounded focus:ring-cyan-500"/>
                      <label htmlFor="isForSale" className="ml-2 block text-sm text-slate-300">This idea is for sale</label>
                  </div>
                  {isForSale && (
                      <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="Price ($)" className="block w-32 bg-slate-700 border-slate-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 text-white"/>
                  )}
              </div>
          </div>
        </form>
        <div className="p-6 border-t border-slate-700 flex-shrink-0 flex justify-end">
          <button type="submit" form="submit-idea-form" className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded-lg transition-all transform hover:scale-105">
            Publish Idea
          </button>
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

export default SubmitIdeaForm;
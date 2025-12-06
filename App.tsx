import React, { useState } from 'react';
import { ImageHoster } from './components/ImageHoster';
import { AffiliateGenerator } from './components/AffiliateGenerator';
import { Layout, Image as ImageIcon, Wand2, Terminal } from 'lucide-react';
import { Tab } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('generator');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-brand-700">
            <div className="bg-brand-600 text-white p-2 rounded-lg">
              <Terminal size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight">AffiliateForge</span>
          </div>
          
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('generator')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${activeTab === 'generator' 
                  ? 'bg-white text-brand-700 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'}`}
            >
              <Wand2 size={16} />
              Prompt Generator
            </button>
            <button
              onClick={() => setActiveTab('host')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${activeTab === 'host' 
                  ? 'bg-white text-brand-700 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'}`}
            >
              <ImageIcon size={16} />
              Image Tools
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 py-8 px-4">
        {activeTab === 'generator' ? <AffiliateGenerator /> : <ImageHoster />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-slate-500 text-sm">
        <p>© 2025 AffiliateForge & ImageHost. Built for creators.</p>
        <p className="mt-2">Compatible with Gemini 2.5, ChatGPT 4o, and Claude 3.5 Sonnet.</p>
      </footer>
    </div>
  );
}
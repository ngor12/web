import React, { useState } from 'react';
import { Wand2, Image as ImageIcon, Link as LinkIcon, AlertCircle, CheckCircle2, Copy, Sparkles, Bot, Search } from 'lucide-react';
import { Card } from './ui/Card';
import { ImageSourceMode, GeneratorState, PromptResult } from '../types';

export const AffiliateGenerator: React.FC = () => {
  const [state, setState] = useState<GeneratorState>({
    topic: '',
    affiliateLink: '',
    imageSourceMode: ImageSourceMode.MANUAL,
    aiImageCount: 5,
    manualImages: [], // For file uploads (not implemented fully for text prompt, used for visual preview)
    manualImageUrls: []
  });

  const [urlInput, setUrlInput] = useState('');
  const [generatedResult, setGeneratedResult] = useState<PromptResult | null>(null);

  // Helper to update state
  const updateState = (key: keyof GeneratorState, value: any) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    if (state.manualImageUrls.length >= 5) {
      alert("Max 5 URLs");
      return;
    }
    updateState('manualImageUrls', [...state.manualImageUrls, urlInput]);
    setUrlInput('');
  };

  const handleRemoveUrl = (index: number) => {
    updateState('manualImageUrls', state.manualImageUrls.filter((_, i) => i !== index));
  };

  const generatePrompt = () => {
    const { topic, affiliateLink, imageSourceMode, aiImageCount, manualImageUrls } = state;

    if (!topic.trim()) {
      alert("Please enter a topic description.");
      return;
    }

    let imageInstructions = '';
    
    if (imageSourceMode === ImageSourceMode.MANUAL) {
      if (manualImageUrls.length > 0) {
        imageInstructions = `
Image Assets Provided:
${manualImageUrls.map((url, i) => `- Image ${i + 1}: ${url}`).join('\n')}

Instructions for Images:
- Place Image 1 as the Hero Banner.
- Use remaining images to illustrate key features or comparisons.
- Ensure alt tags are SEO optimized based on the topic.
`;
      } else {
        imageInstructions = `
Image Strategy:
- No specific images provided. Please suggest placeholders for: Hero Image, Product Close-up, Comparison Chart, and Testimonial Avatar.
`;
      }
    } else {
      // AI AUTO MODE logic
      imageInstructions = `
Image Acquisition Strategy (AI Search):
- **ACTION REQUIRED**: Please search the web to find ${aiImageCount} high-quality, relevant images for this topic.
- Source valid URLs that can be embedded.
- Select images that represent: 1. Main Product/Concept, 2. Usage context, 3. Features/Details, 4. Social Proof/People.
- Embed these found images into the final website design.
`;
    }

    const promptText = `
Create a high-converting affiliate marketing website based on the following brief.

TOPIC / CONTENT BRIEF:
"${topic}"

AFFILIATE LINK STRATEGY:
Target URL: ${affiliateLink || "[Insert Affiliate Link Here]"}
- Use this link for all primary Call-to-Actions (CTAs).
- Ensure links open in a new tab (target="_blank").
- Add "rel=noopener noreferrer" for security.
- Add specific affiliate disclaimer in the footer.

${imageInstructions}

WEBSITE REQUIREMENTS:
1. **Structure**: Hero Section (Headline + CTA), Problem/Agitation, Solution (The Product), Benefits List, Social Proof, FAQ, Final CTA.
2. **Design System**: Use Tailwind CSS for styling. Modern, clean, trustworthy aesthetic.
3. **Copywriting**: Focus on benefits over features. Use persuasive language.
4. **Tech Stack**: Single HTML file with embedded CSS/JS or React Component structure.

Please generate the complete code for this landing page.
    `.trim();

    // Logic for the "Honest Review" - simplified for client-side demo
    // In a real app, this could call Gemini. Here we simulate a "Review" based on heuristics.
    const wordCount = topic.split(' ').length;
    const hasLink = !!affiliateLink;
    const reviewText = `
**Affiliate Potential Review:**

1. **Content Depth**: ${wordCount > 50 ? "✅ Excellent detail provided." : "⚠️ Description is a bit brief. Consider adding more pain points."}
2. **Monetization**: ${hasLink ? "✅ Link included." : "⚠️ No affiliate link provided. Don't forget to add one!"}
3. **Visual Strategy**: ${imageSourceMode === ImageSourceMode.AI_AUTO ? `🤖 AI Auto-Search enabled (${aiImageCount} images). Good for speed.` : `📸 Manual images: ${manualImageUrls.length}.`}
    
**Overall Rating**: ${wordCount > 30 && hasLink ? "High Potential 🚀" : "Needs Optimization 🔧"}
    `.trim();

    setGeneratedResult({
      prompt: promptText,
      review: reviewText
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const loadExample = () => {
    updateState('topic', 'Review of the best noise-cancelling headphones for travel in 2025. Focus on comfort, battery life, and price value.');
    updateState('affiliateLink', 'https://amazon.com/example-affiliate-id');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Affiliate Prompt Generator</h2>
        <p className="text-slate-600 mt-2">Generate professional prompts for AI builders. Now with AI Image Auto-Search.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Main Input */}
          <Card title="Content & Details" icon={<Wand2 size={20} />}>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-slate-700">Topic & Description</label>
                  <button onClick={loadExample} className="text-xs text-brand-600 hover:text-brand-700 font-medium">Load Example</button>
                </div>
                <textarea
                  className="w-full h-40 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none text-slate-700"
                  placeholder="Describe your affiliate product, blog post topic, or landing page concept..."
                  value={state.topic}
                  onChange={(e) => updateState('topic', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Affiliate Link</label>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-transparent">
                  <LinkIcon size={18} className="text-slate-400" />
                  <input
                    type="url"
                    className="bg-transparent border-none outline-none w-full text-slate-700"
                    placeholder="https://your-link.com?ref=you"
                    value={state.affiliateLink}
                    onChange={(e) => updateState('affiliateLink', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Image Settings */}
          <Card title="Image Strategy" icon={<ImageIcon size={20} />}>
            <div className="space-y-6">
              {/* Source Selector */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => updateState('imageSourceMode', ImageSourceMode.MANUAL)}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all
                    ${state.imageSourceMode === ImageSourceMode.MANUAL 
                      ? 'border-brand-500 bg-brand-50 text-brand-700' 
                      : 'border-slate-200 hover:border-brand-200 text-slate-600'}`}
                >
                  <LinkIcon size={24} className="mb-2" />
                  <span className="font-semibold text-sm">Manual URLs</span>
                </button>
                
                <button
                  onClick={() => updateState('imageSourceMode', ImageSourceMode.AI_AUTO)}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all relative
                    ${state.imageSourceMode === ImageSourceMode.AI_AUTO 
                      ? 'border-purple-500 bg-purple-50 text-purple-700' 
                      : 'border-slate-200 hover:border-purple-200 text-slate-600'}`}
                >
                  <div className="absolute top-2 right-2">
                    <Sparkles size={16} className={state.imageSourceMode === ImageSourceMode.AI_AUTO ? "text-purple-500" : "text-slate-300"} />
                  </div>
                  <Bot size={24} className="mb-2" />
                  <span className="font-semibold text-sm">AI Auto-Search</span>
                </button>
              </div>

              {/* Conditional Controls */}
              {state.imageSourceMode === ImageSourceMode.MANUAL ? (
                <div className="space-y-3 animate-fade-in">
                  <div className="flex gap-2">
                    <input 
                      type="url"
                      className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-500"
                      placeholder="https://example.com/image.jpg"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddUrl()}
                    />
                    <button onClick={handleAddUrl} className="bg-slate-800 text-white px-4 rounded-lg text-sm font-medium hover:bg-slate-700">Add</button>
                  </div>
                  
                  {state.manualImageUrls.length > 0 && (
                    <div className="space-y-2">
                      {state.manualImageUrls.map((url, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-slate-50 p-2 rounded border border-slate-200">
                          <span className="text-xs text-slate-600 truncate max-w-[200px]">{url}</span>
                          <button onClick={() => handleRemoveUrl(idx)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                            <AlertCircle size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 flex items-start gap-3">
                    <Search className="text-purple-600 mt-1" size={20} />
                    <div>
                      <h4 className="font-semibold text-purple-900 text-sm">AI Web Search Enabled</h4>
                      <p className="text-xs text-purple-700 mt-1">
                        The generated prompt will instruct the AI (Gemini/ChatGPT) to actively search the web for high-quality images related to your topic.
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Number of Images to Find
                    </label>
                    <div className="flex items-center gap-4">
                      <input 
                        type="range" 
                        min="1" 
                        max="10" 
                        value={state.aiImageCount}
                        onChange={(e) => updateState('aiImageCount', parseInt(e.target.value))}
                        className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                      />
                      <span className="font-mono bg-slate-100 px-3 py-1 rounded text-slate-700 font-bold border border-slate-200">
                        {state.aiImageCount}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <button
            onClick={generatePrompt}
            className="w-full py-4 bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-brand-500/30 hover:shadow-brand-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="animate-pulse" />
            Generate Optimized Prompt
          </button>
        </div>

        {/* Sidebar / Review */}
        <div className="md:col-span-1">
           {generatedResult ? (
             <div className="space-y-6 sticky top-6 animate-fade-in-up">
               <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl">
                 <h4 className="font-bold text-yellow-800 flex items-center gap-2 mb-2">
                   <AlertCircle size={18} /> Honest Review
                 </h4>
                 <div className="text-sm text-yellow-900 whitespace-pre-line">
                   {generatedResult.review}
                 </div>
               </div>

               <Card className="bg-slate-900 border-slate-800 text-white">
                  <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-3">
                    <h3 className="font-bold text-slate-100">Result Prompt</h3>
                    <button 
                      onClick={() => copyToClipboard(generatedResult.prompt)}
                      className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-brand-400"
                    >
                      <Copy size={18} />
                    </button>
                  </div>
                  <div className="h-[400px] overflow-y-auto custom-scrollbar text-xs font-mono text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800 leading-relaxed whitespace-pre-wrap">
                    {generatedResult.prompt}
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-xs text-slate-500">Copy this and paste it into ChatGPT, Claude, or Gemini.</p>
                  </div>
               </Card>
             </div>
           ) : (
             <div className="bg-slate-100 rounded-2xl p-8 text-center text-slate-500 h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-200">
               <Bot size={48} className="mb-4 text-slate-300" />
               <p>Fill out the form to generate your AI prompt and review.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
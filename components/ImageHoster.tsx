import React, { useState, useCallback } from 'react';
import { Upload, Copy, Check, ExternalLink, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Card } from './ui/Card';
import { uploadToImgBB, shortenUrl } from '../services/imageService';

export const ImageHoster: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ hosted: string; short: string } | null>(null);
  const [copied, setCopied] = useState<'hosted' | 'short' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.size > 5 * 1024 * 1024) {
        setError("File size exceeds 5MB limit.");
        return;
      }
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResult(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    
    try {
      const imgData = await uploadToImgBB(file);
      if (!imgData.success) throw new Error(imgData.error?.message || 'Upload failed');
      
      const shortLink = await shortenUrl(imgData.data.url);
      
      setResult({
        hosted: imgData.data.url,
        short: shortLink
      });
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: 'hosted' | 'short') => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Image Host & Shortener</h2>
        <p className="text-slate-600 mt-2">Upload images, get permanent links, and shorten them instantly.</p>
      </div>

      <Card>
        <div 
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer
            ${file ? 'border-brand-500 bg-brand-50' : 'border-slate-300 hover:border-brand-400 hover:bg-slate-50'}`}
          onClick={() => document.getElementById('host-upload')?.click()}
        >
          <input 
            id="host-upload" 
            type="file" 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange}
          />
          
          {preview ? (
            <div className="relative inline-block">
              <img src={preview} alt="Preview" className="max-h-64 rounded-lg shadow-sm" />
              <div className="mt-4 text-brand-700 font-medium flex items-center justify-center gap-2">
                <ImageIcon size={18} />
                {file?.name}
              </div>
            </div>
          ) : (
            <div className="py-8">
              <div className="bg-brand-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-600">
                <Upload size={32} />
              </div>
              <h3 className="text-lg font-semibold text-slate-800">Click to upload image</h3>
              <p className="text-slate-500 mt-1 text-sm">SVG, PNG, JPG or GIF (Max 5MB)</p>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm">
            ❌ {error}
          </div>
        )}

        {file && !result && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleUpload}
              disabled={loading}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white transition-all
                ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-500/30'}`}
            >
              {loading ? <Loader2 className="animate-spin" /> : <Upload size={20} />}
              {loading ? 'Processing...' : 'Upload & Shorten'}
            </button>
          </div>
        )}
      </Card>

      {result && (
        <Card title="Your Links" icon={<ExternalLink size={20} />} className="animate-fade-in-up">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Hosted Direct Link</label>
              <div className="flex gap-2">
                <input 
                  readOnly 
                  value={result.hosted} 
                  className="flex-1 bg-slate-50 border border-slate-300 text-slate-700 text-sm rounded-lg p-3 outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button
                  onClick={() => copyToClipboard(result.hosted, 'hosted')}
                  className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 rounded-lg flex items-center justify-center transition-colors min-w-[100px]"
                >
                  {copied === 'hosted' ? <Check size={18} className="text-green-600" /> : <span className="flex items-center gap-2"><Copy size={16} /> Copy</span>}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Shortened Link</label>
              <div className="flex gap-2">
                <input 
                  readOnly 
                  value={result.short} 
                  className="flex-1 bg-slate-50 border border-slate-300 text-slate-700 text-sm rounded-lg p-3 outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button
                  onClick={() => copyToClipboard(result.short, 'short')}
                  className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 rounded-lg flex items-center justify-center transition-colors min-w-[100px]"
                >
                  {copied === 'short' ? <Check size={18} className="text-green-600" /> : <span className="flex items-center gap-2"><Copy size={16} /> Copy</span>}
                </button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
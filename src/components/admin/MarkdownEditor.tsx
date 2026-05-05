import React, { useState, useCallback } from 'react';
import MDEditor, { ICommand } from '@uiw/react-markdown-editor';
import { supabase } from '../../lib/supabase';
import { CUSTOM_COMPONENTS } from '../ComponentRenderer';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Copy, X, ChevronRight } from 'lucide-react';

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    height?: string | number;
    placeholder?: string;
}

export default function MarkdownEditor({ value, onChange, height = 400, placeholder }: MarkdownEditorProps) {
    const [uploading, setUploading] = useState(false);
    const [guideOpen, setGuideOpen] = useState(false);
    const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

    // Insert snippet at the end of current content
    const insertSnippet = useCallback((snippet: string) => {
        const newValue = value ? `${value}\n${snippet}` : snippet;
        onChange(newValue);
        setCopiedIdx(null);
    }, [value, onChange]);

    // Copy snippet to clipboard
    const copySnippet = useCallback((snippet: string, idx: number) => {
        navigator.clipboard.writeText(snippet);
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(null), 2000);
    }, []);

    // Custom Image Upload Command
    const imageUploadCommand: ICommand = {
        name: 'image-upload',
        keyCommand: 'image-upload',
        buttonProps: { 'aria-label': 'Insert Image' },
        icon: (
            <span className="flex items-center justify-center">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
            </span>
        ),
        execute: (state: any, api: any) => {
            // Create a hidden file input
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = async (e: any) => {
                const file = e.target.files?.[0];
                if (!file) return;

                try {
                    setUploading(true);
                    const loadingText = `![Uploading ${file.name}...]()`;
                    api.replaceSelection(loadingText);

                    const fileExt = file.name.split('.').pop();
                    const fileName = `${Math.random()}.${fileExt}`;
                    const filePath = `markdown/${fileName}`;

                    const { error: uploadError } = await supabase.storage
                        .from('assets')
                        .upload(filePath, file);

                    if (uploadError) throw uploadError;

                    const { data: { publicUrl } } = supabase.storage
                        .from('assets')
                        .getPublicUrl(filePath);

                    const imageMarkdown = `![${file.name}](${publicUrl})`;
                    const newValue = api.textArea.value.replace(loadingText, imageMarkdown);
                    onChange(newValue);

                } catch (error) {
                    console.error('Error uploading image:', error);
                    alert('Failed to upload image');
                    const newValue = api.textArea.value.replace(`![Uploading ${file.name}...]()`, '');
                    onChange(newValue);
                } finally {
                    setUploading(false);
                }
            };
            input.click();
        },
    };

    const [previewMode, setPreviewMode] = useState<'edit' | 'live'>('edit');

    return (
        <div className="relative rounded-2xl overflow-hidden border border-white/5 bg-dark-950 shadow-2xl" data-color-mode="dark">
            {uploading && (
                <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-md pointer-events-none">
                    <div className="bg-dark-900 px-6 py-3 rounded-2xl border border-white/10 shadow-2xl flex items-center gap-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-500 border-t-transparent"></div>
                        <span className="text-sm font-bold text-white uppercase tracking-widest">Uploading...</span>
                    </div>
                </div>
            )}

            {/* Toolbar Area */}
            <div className="flex flex-wrap items-center justify-between bg-dark-900/50 border-b border-white/5 px-4 py-2 gap-2">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setGuideOpen(!guideOpen)}
                        className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all ${guideOpen ? 'bg-primary-500 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                    >
                        <BookOpen className="h-3.5 w-3.5" />
                        Guide
                    </button>
                </div>

                {/* Mobile Preview Toggle */}
                <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                    <button
                        type="button"
                        onClick={() => setPreviewMode('edit')}
                        className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${previewMode === 'edit' ? 'bg-white/10 text-white' : 'text-gray-500'}`}
                    >
                        Edit
                    </button>
                    <button
                        type="button"
                        onClick={() => setPreviewMode('live')}
                        className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${previewMode === 'live' ? 'bg-white/10 text-white' : 'text-gray-500'}`}
                    >
                        Preview
                    </button>
                </div>
            </div>

            {/* Guide Panel */}
            <AnimatePresence>
                {guideOpen && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-dark-900 border-b border-white/5 overflow-hidden"
                    >
                        <div className="p-4 space-y-4 max-h-80 overflow-y-auto scrollbar-hide">
                            <div className="flex items-center justify-between">
                                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Design Snippets</h4>
                                <button type="button" onClick={() => setGuideOpen(false)} className="text-gray-600 hover:text-white"><X className="h-4 w-4" /></button>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {CUSTOM_COMPONENTS.map((comp, idx) => (
                                    <div key={comp.name} className="bg-white/[0.02] border border-white/5 rounded-xl p-3 hover:border-primary-500/30 transition-all group">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-bold text-primary-400">&lt;{comp.name} /&gt;</span>
                                            <button 
                                                type="button"
                                                onClick={() => insertSnippet(comp.snippet)}
                                                className="text-[9px] font-bold uppercase bg-white/5 hover:bg-primary-500 px-2 py-1 rounded transition-all"
                                            >
                                                Insert
                                            </button>
                                        </div>
                                        <p className="text-[9px] text-gray-500 line-clamp-1">{comp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <MDEditor
                value={value}
                onChange={(val) => onChange(val || '')}
                height={String(height)}
                preview={previewMode}
                extraCommands={[imageUploadCommand]}
                textareaProps={{
                    placeholder: placeholder || 'Write your content with Markdown...'
                }}
                className="bg-transparent text-white w-full"
                style={{ backgroundColor: 'transparent' }}
            />
        </div>
    );
}

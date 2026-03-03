import React, { useState, useCallback } from 'react';
import MDEditor, { ICommand } from '@uiw/react-markdown-editor';
import { supabase } from '../../lib/supabase';
import { CUSTOM_COMPONENTS } from '../ComponentRenderer';
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

    return (
        <div className="relative rounded-lg overflow-hidden border border-white/10" data-color-mode="dark">
            {uploading && (
                <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm pointer-events-none">
                    <div className="bg-dark-900 px-4 py-2 rounded-lg border border-white/10 shadow-xl flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-500 border-t-transparent"></div>
                        <span className="text-xs font-bold text-white">Uploading Image...</span>
                    </div>
                </div>
            )}

            {/* Component Guide Toggle */}
            <div className="flex items-center justify-between bg-dark-900/80 border-b border-white/5 px-3 py-1.5">
                <button
                    type="button"
                    onClick={() => setGuideOpen(!guideOpen)}
                    className="flex items-center gap-1.5 text-xs font-medium text-white/60 hover:text-white transition-colors"
                >
                    <BookOpen className="h-3.5 w-3.5" />
                    Component Guide
                    <ChevronRight className={`h-3 w-3 transition-transform duration-200 ${guideOpen ? 'rotate-90' : ''}`} />
                </button>
            </div>

            {/* Component Guide Panel */}
            {guideOpen && (
                <div className="bg-dark-950/90 border-b border-white/5 max-h-96 overflow-y-auto">
                    <div className="p-3">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-white/70">
                                Components — <span className="text-primary-400">{CUSTOM_COMPONENTS.length} available</span>
                            </h4>
                            <button
                                type="button"
                                onClick={() => setGuideOpen(false)}
                                className="text-white/40 hover:text-white transition-colors"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </div>
                        {/* Group by category */}
                        {Array.from(new Set(CUSTOM_COMPONENTS.map(c => c.category))).map(cat => (
                            <div key={cat} className="mb-3">
                                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/25 mb-1.5 px-1">{cat}</div>
                                <div className="space-y-1.5">
                                    {CUSTOM_COMPONENTS.filter(c => c.category === cat).map((comp, idx) => {
                                        const globalIdx = CUSTOM_COMPONENTS.indexOf(comp);
                                        return (
                                            <div
                                                key={comp.name}
                                                className="group bg-white/[0.03] hover:bg-white/[0.06] rounded-lg p-2.5 border border-white/5 hover:border-white/10 transition-all"
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-xs font-bold text-primary-400">
                                                        &lt;{comp.name} /&gt;
                                                    </span>
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => copySnippet(comp.snippet, globalIdx)}
                                                            className="text-white/30 hover:text-white text-[10px] flex items-center gap-1 transition-colors"
                                                            title="Copy snippet"
                                                        >
                                                            <Copy className="h-3 w-3" />
                                                            {copiedIdx === globalIdx ? 'Copied!' : 'Copy'}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => insertSnippet(comp.snippet)}
                                                            className="text-[10px] px-2 py-0.5 bg-primary-500/20 hover:bg-primary-500/40 text-primary-300 rounded font-bold transition-colors"
                                                        >
                                                            Insert
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-[10px] text-white/40 leading-relaxed">
                                                    {comp.description}
                                                </p>
                                                <code className="block mt-1.5 text-[10px] text-white/25 bg-black/30 rounded px-2 py-1 font-mono overflow-x-auto whitespace-pre">
                                                    {comp.snippet}
                                                </code>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <MDEditor
                value={value}
                onChange={(val) => onChange(val || '')}
                height={String(height)}
                preview="live"
                extraCommands={[
                    imageUploadCommand
                ]}
                textareaProps={{
                    placeholder: placeholder || 'Write your content with Markdown...'
                }}
                className="bg-dark-950 text-white"
                style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
            />
        </div>
    );
}

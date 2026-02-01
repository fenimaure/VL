import React, { useState } from 'react';
import MDEditor, { ICommand } from '@uiw/react-markdown-editor';
import { supabase } from '../../lib/supabase';

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    height?: string | number;
    placeholder?: string;
}

export default function MarkdownEditor({ value, onChange, height = 400, placeholder }: MarkdownEditorProps) {
    const [uploading, setUploading] = useState(false);

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

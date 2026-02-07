import { useState } from 'react';
import { Share2, Facebook, Linkedin, Check, Link as LinkIcon } from 'lucide-react';
import { FaXTwitter } from 'react-icons/fa6';

interface SocialShareProps {
    url?: string;
    title: string;
    description?: string;
    hashtags?: string[];
    className?: string;
}

export default function SocialShare({
    url,
    title,
    description = '',
    hashtags = [],
    className = ''
}: SocialShareProps) {
    const [copied, setCopied] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const fullUrl = url || window.location.href;
    const encodedUrl = encodeURIComponent(fullUrl);
    const encodedTitle = encodeURIComponent(title);
    const encodedDescription = encodeURIComponent(description);
    const hashtagString = hashtags.length > 0 ? encodeURIComponent(hashtags.join(',')) : '';

    const shareLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}${hashtagString ? `&hashtags=${hashtagString}` : ''}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(fullUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy link:', err);
        }
    };

    const handleShare = (platform: 'facebook' | 'twitter' | 'linkedin') => {
        window.open(shareLinks[platform], '_blank', 'width=600,height=400');
    };

    return (
        <div className={`relative ${className}`}>
            {/* Share Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="group inline-flex items-center gap-2 px-4 py-2 bg-black/5 dark:bg-white/5 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-dark-950 border border-black/10 dark:border-white/10 rounded-full text-sm font-bold transition-all duration-300"
                aria-label="Share"
            >
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">Share</span>
            </button>

            {/* Share Options Dropdown */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Share Menu */}
                    <div className="absolute top-full right-0 mt-2 z-50 bg-white dark:bg-dark-900 border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl p-4 min-w-[280px] animate-fade-in-up">
                        <div className="space-y-2">
                            {/* Facebook */}
                            <button
                                onClick={() => handleShare('facebook')}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-black dark:text-white transition-all duration-300 group"
                            >
                                <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center group-hover:bg-black dark:group-hover:bg-white transition-colors">
                                    <Facebook className="h-5 w-5 text-black dark:text-white group-hover:text-white dark:group-hover:text-black" />
                                </div>
                                <span className="font-medium">Share on Facebook</span>
                            </button>

                            {/* Twitter/X */}
                            <button
                                onClick={() => handleShare('twitter')}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-black/10 dark:hover:bg-white/20 text-black dark:text-white transition-all duration-300 group"
                            >
                                <div className="w-10 h-10 rounded-full bg-black/10 dark:bg-white/20 flex items-center justify-center group-hover:bg-black dark:group-hover:bg-white transition-colors">
                                    <FaXTwitter className="h-5 w-5 text-black dark:text-white group-hover:text-white dark:group-hover:text-black" />
                                </div>
                                <span className="font-medium">Share on X</span>
                            </button>

                            {/* LinkedIn */}
                            <button
                                onClick={() => handleShare('linkedin')}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-black dark:text-white transition-all duration-300 group"
                            >
                                <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center group-hover:bg-black dark:group-hover:bg-white transition-colors">
                                    <Linkedin className="h-5 w-5 text-black dark:text-white group-hover:text-white dark:group-hover:text-black" />
                                </div>
                                <span className="font-medium">Share on LinkedIn</span>
                            </button>

                            {/* Copy Link */}
                            <button
                                onClick={handleCopyLink}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-black dark:text-white transition-all duration-300 group border-t border-black/5 dark:border-white/5 mt-2 pt-4"
                            >
                                <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center group-hover:bg-black dark:group-hover:bg-white transition-colors">
                                    {copied ? (
                                        <Check className="h-5 w-5 text-black dark:text-white group-hover:text-white dark:group-hover:text-black" />
                                    ) : (
                                        <LinkIcon className="h-5 w-5 text-black dark:text-white group-hover:text-white dark:group-hover:text-black" />
                                    )}
                                </div>
                                <span className="font-medium">{copied ? 'Link Copied!' : 'Copy Link'}</span>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

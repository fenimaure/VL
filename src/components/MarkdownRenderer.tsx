import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

export default function MarkdownRenderer({ content, className = "" }: { content: string; className?: string }) {
    if (!content) return null;

    return (
        <article className={`prose prose-lg max-w-none 
            prose-headings:font-display prose-headings:font-bold 
            prose-headings:text-black dark:prose-headings:text-white
            prose-p:text-black/80 dark:prose-p:text-gray-300 prose-p:leading-relaxed
            prose-a:text-primary-500 prose-a:no-underline hover:prose-a:text-primary-600 dark:prose-a:text-primary-400 dark:hover:prose-a:text-primary-300 hover:prose-a:underline
            prose-strong:text-black dark:prose-strong:text-white prose-strong:font-bold
            prose-code:text-primary-600 dark:prose-code:text-primary-300 prose-code:bg-black/5 dark:prose-code:bg-white/5 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-[''] prose-code:after:content-['']
            prose-pre:bg-gray-100 dark:prose-pre:bg-dark-900 prose-pre:border prose-pre:border-black/10 dark:prose-pre:border-white/10
            prose-img:rounded-xl prose-img:border prose-img:border-black/10 dark:prose-img:border-white/10 prose-img:shadow-lg
            prose-li:text-black/80 dark:prose-li:text-gray-300
            prose-ul:text-black/80 dark:prose-ul:text-gray-300
            prose-ol:text-black/80 dark:prose-ol:text-gray-300
            transition-colors duration-300
            ${className}`}
        >
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {content}
            </ReactMarkdown>
        </article>
    );
}

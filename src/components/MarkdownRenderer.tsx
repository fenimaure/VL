import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

export default function MarkdownRenderer({ content, className = "" }: { content: string; className?: string }) {
    if (!content) return null;

    return (
        <article className={`prose prose-invert prose-lg max-w-none 
            prose-headings:font-display prose-headings:font-bold prose-headings:text-white
            prose-p:text-gray-300 prose-p:leading-relaxed
            prose-a:text-primary-400 prose-a:no-underline hover:prose-a:text-primary-300 hover:prose-a:underline
            prose-strong:text-white prose-strong:font-bold
            prose-code:text-primary-300 prose-code:bg-white/5 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-[''] prose-code:after:content-['']
            prose-pre:bg-dark-900 prose-pre:border prose-pre:border-white/10
            prose-img:rounded-xl prose-img:border prose-img:border-white/10 prose-img:shadow-lg
            prose-li:text-gray-300
            ${className}`}
        >
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {content}
            </ReactMarkdown>
        </article>
    );
}

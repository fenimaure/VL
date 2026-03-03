import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const sanitizeSchema = {
    ...defaultSchema,
    tagNames: [...(defaultSchema?.tagNames || []), 'section', 'gradienttext', 'marquee'],
    attributes: {
        ...defaultSchema?.attributes,
        section: ['bg'],
        gradienttext: ['from', 'to']
    }
};

const md = `About Us

<Section bg="muted">At <GradientText from="#6366f1" to="#ec4899">Lovelli</GradientText>, we believe...</Section>`;

const el = React.createElement(ReactMarkdown, {
    rehypePlugins: [
        rehypeRaw,
        [rehypeSanitize, sanitizeSchema]
    ]
}, md);

console.log(renderToStaticMarkup(el));

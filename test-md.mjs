import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const md = `About Us

<Section bg="muted"> At <GradientText from="#6366f1" to="#ec4899">Lovelli</GradientText>...

<Marquee>Elegant solutions...</Marquee>

</Section>`;

const el = React.createElement(ReactMarkdown, {
    rehypePlugins: [rehypeRaw]
}, md);

console.log(renderToStaticMarkup(el));

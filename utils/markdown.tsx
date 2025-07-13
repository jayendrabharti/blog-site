import ReactMarkdown from "react-markdown";

const Markdown = ({ content }: { content: string }) => (
  <ReactMarkdown components={markdownComponents}>{content}</ReactMarkdown>
);

export default Markdown;

export const markdownComponents = {
  h1: ({ children }: any) => (
    <h1 className="text-4xl font-bold mt-6 mb-4">{children}</h1>
  ),
  h2: ({ children }: any) => (
    <h2 className="text-3xl font-semibold mt-6 mb-3">{children}</h2>
  ),
  h3: ({ children }: any) => (
    <h3 className="text-2xl font-semibold mt-5 mb-2">{children}</h3>
  ),
  h4: ({ children }: any) => (
    <h4 className="text-xl font-medium mt-4 mb-2">{children}</h4>
  ),
  p: ({ children }: any) => (
    <p className="text-base leading-7 my-3">{children}</p>
  ),
  a: ({ href, children }: any) => (
    <a href={href} className="text-blue-600 hover:underline">
      {children}
    </a>
  ),
  ul: ({ children }: any) => (
    <ul className="list-disc list-inside my-4">{children}</ul>
  ),
  ol: ({ children }: any) => (
    <ol className="list-decimal list-inside my-4">{children}</ol>
  ),
  li: ({ children }: any) => <li className="ml-4">{children}</li>,
  blockquote: ({ children }: any) => (
    <blockquote className="border-l-4 border-gray-400 pl-4 italic text-gray-600 my-4">
      {children}
    </blockquote>
  ),
  code: ({ children }: any) => (
    <code className="bg-gray-100 text-sm px-1 py-0.5 rounded">{children}</code>
  ),
  pre: ({ children }: any) => (
    <pre className="bg-gray-800 text-white text-sm p-4 rounded overflow-x-auto my-4">
      {children}
    </pre>
  ),
  img: ({ src, alt }: any) => (
    <img src={src} alt={alt} className="max-w-full rounded my-4" />
  ),
  hr: () => <hr className="my-6 border-gray-300" />,
};

    import Markdown from 'react-markdown';
    import remarkGfm from 'remark-gfm';

    interface MarkdownRendererProps {
    content: string;
    className?: string;
    theme?: 'light' | 'dark';
    }

    const MarkdownRenderer = ({ content, className = '', theme = 'light' }: MarkdownRendererProps) => {
    const isDark = theme === 'dark';
    
    return (
        <div className={`markdown-content break-words ${className}`}>
        <Markdown 
            remarkPlugins={[remarkGfm]}
            components={{
            // Código inline e em bloco
            code: ({node, inline, className, children, ...props}:any) => {
                return inline ? (
                <code 
                    className={`px-1 py-0.5 rounded text-sm font-mono ${
                    isDark 
                        ? 'bg-gray-700 text-gray-200' 
                        : 'bg-gray-200 text-gray-800'
                    }`} 
                    {...props}
                >
                    {children}
                </code>
                ) : (
                <pre 
                    className={`p-3 rounded-lg my-2 overflow-x-auto ${
                    isDark 
                        ? 'bg-gray-800 text-gray-200' 
                        : 'bg-gray-100 text-gray-800'
                    }`}
                >
                    <code className="text-sm font-mono" {...props}>
                    {children}
                    </code>
                </pre>
                );
            },

            // Citações
            blockquote: ({children}) => (
                <blockquote 
                className={`border-l-4 pl-4 italic my-2 ${
                    isDark 
                    ? 'border-gray-500 text-gray-300' 
                    : 'border-gray-400 text-gray-600'
                }`}
                >
                {children}
                </blockquote>
            ),

            // Títulos
            h1: ({children}) => (
                <h1 className={`text-xl font-bold my-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {children}
                </h1>
            ),
            h2: ({children}) => (
                <h2 className={`text-lg font-bold my-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {children}
                </h2>
            ),
            h3: ({children}) => (
                <h3 className={`text-base font-bold my-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {children}
                </h3>
            ),
            h4: ({children}) => (
                <h4 className={`text-sm font-bold my-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {children}
                </h4>
            ),

            // Listas
            ul: ({children}) => (
                <ul className="list-disc ml-4 my-2">{children}</ul>
            ),
            ol: ({children}) => (
                <ol className="list-decimal ml-4 my-2">{children}</ol>
            ),
            li: ({children}) => (
                <li className={`my-1 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                {children}
                </li>
            ),

            // Parágrafos
            p: ({children}) => (
                <p className={`my-1 leading-relaxed ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                {children}
                </p>
            ),

            // Formatação de texto
            strong: ({children}) => (
                <strong className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {children}
                </strong>
            ),
            em: ({children}) => (
                <em className={`italic ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {children}
                </em>
            ),

            // Texto riscado
            del: ({children}) => (
                <del className={`line-through ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {children}
                </del>
            ),

            // Tabelas
            table: ({children}) => (
                <div className="overflow-x-auto my-3">
                <table className={`border-collapse border min-w-full ${
                    isDark 
                    ? 'border-gray-600' 
                    : 'border-gray-300'
                }`}>
                    {children}
                </table>
                </div>
            ),
            thead: ({children}) => (
                <thead className={isDark ? 'bg-gray-700' : 'bg-gray-100'}>
                {children}
                </thead>
            ),
            tbody: ({children}) => (
                <tbody>{children}</tbody>
            ),
            tr: ({children}) => (
                <tr className={`border ${isDark ? 'border-gray-600' : 'border-gray-300'}`}>
                {children}
                </tr>
            ),
            th: ({children}) => (
                <th className={`border px-3 py-2 font-bold text-left ${
                isDark 
                    ? 'border-gray-600 text-gray-200' 
                    : 'border-gray-300 text-gray-900'
                }`}>
                {children}
                </th>
            ),
            td: ({children}) => (
                <td className={`border px-3 py-2 ${
                isDark 
                    ? 'border-gray-600 text-gray-200' 
                    : 'border-gray-300 text-gray-800'
                }`}>
                {children}
                </td>
            ),

            // Linha horizontal
            hr: () => (
                <hr className={`border-t my-4 ${
                isDark ? 'border-gray-600' : 'border-gray-300'
                }`} />
            ),

            // Links
            a: ({href, children}) => (
                <a 
                href={href} 
                className={`underline hover:no-underline transition-colors ${
                    isDark 
                    ? 'text-blue-400 hover:text-blue-300' 
                    : 'text-blue-600 hover:text-blue-800'
                }`}
                target="_blank" 
                rel="noopener noreferrer"
                >
                {children}
                </a>
            ),

            // Imagens
            img: ({src, alt}) => (
                <img 
                src={src} 
                alt={alt} 
                className="max-w-full h-auto rounded-lg my-2"
                />
            )
            }}
        >
            {content}
        </Markdown>
        </div>
    );
    };

    export default MarkdownRenderer;
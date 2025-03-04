import Markdown from 'react-markdown';
import Blockquote from './Blockquote';
import remarkGfm from 'remark-gfm';
import { cn } from '@/components/utils';
import Mermaid from '@/components/mermaid/Mermaid';

interface MarkdownCompleteProps {
  text: string;
  className?: string;
}

export default function MarkdownComplete({
  text,
  className = '',
}: MarkdownCompleteProps) {
  const components = componentsToRender(text);

  return (
    <>
      {components.map((component, index) => {
        return (
          <RenderComponent key={index} component={component} index={index} />
        );
      })}
    </>
  );
}

const RenderComponent = ({
  component,
  index,
  className,
}: {
  component: Component;
  index: number;
  className?: string;
}) => {
  if (component.type === 'mermaid') {
    return <Mermaid key={index} chart={component.content} />;
  }

  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      components={{
        blockquote(props) {
          return <Blockquote>{props.children}</Blockquote>;
        },
      }}
      className={cn(className, 'prose dark:prose-invert')}
    >
      {component.content}
    </Markdown>
  );
};

type Component = {
  type: 'Markdown' | 'mermaid';
  content: string;
};

const componentsToRender = (text: string): Component[] => {
  const components: Component[] = [];

  const regex = /```mermaid\s*([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const mermaidContent = match[1].trim();
    const markdownPart = text.slice(lastIndex, match.index).trim();

    if (markdownPart) {
      components.push({
        type: 'Markdown',
        content: markdownPart,
      });
    }

    components.push({
      type: 'mermaid',
      content: mermaidContent,
    });

    lastIndex = regex.lastIndex;
  }

  // Añadir cualquier contenido Markdown restante
  const remainingMarkdown = text.slice(lastIndex).trim();
  if (remainingMarkdown) {
    components.push({
      type: 'Markdown',
      content: remainingMarkdown,
    });
  }

  return components;
};

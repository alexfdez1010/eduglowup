import { useEffect, useState } from 'react';
import { Spinner } from '@nextui-org/react';
import { UUID } from '@/lib/uuid';

export default function Mermaid({ chart }) {
  const [svg, setSvg] = useState(null);

  useEffect(() => {
    const renderMermaid = async () => {
      try {
        const randomUuid = UUID.generate();
        const result = await window.mermaid.render(
          `mermaid-diagram-${randomUuid}`,
          chart,
        );
        setSvg(result.svg || '');
      } catch (error) {
        setSvg('');
      }
    };

    if (window.mermaid) {
      renderMermaid();
    }
  }, [chart]);

  if (svg === null) {
    return <Spinner />;
  }

  if (svg === '') {
    return null;
  }

  return (
    <div dangerouslySetInnerHTML={{ __html: svg }} className="w-full h-full" />
  );
}

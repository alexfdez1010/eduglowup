'use client';

import { useEffect } from 'react';
import mermaid, { MermaidConfig, RenderResult } from 'mermaid';

declare global {
  interface Window {
    mermaid: {
      initialize: (config?: MermaidConfig) => void;
      contentLoaded: () => void;
      render: (
        id: string,
        text: string,
        svgContainingElement?: Element,
      ) => Promise<RenderResult>;
      run: () => void;
    };
  }
}

export function MermaidProvider() {
  useEffect(() => {
    if (!window.mermaid) {
      window.mermaid = mermaid;
      window.mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        suppressErrorRendering: true,
      });
    }
  }, []);

  return null;
}

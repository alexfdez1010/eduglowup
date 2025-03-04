'use client';

import { ForwardRefEditor } from '@/components/editor/ForwardRefEditor';
import { useSummaryEditor } from '@/components/editor/use-summary-editor';
import { useDictionary } from '@/components/hooks';
import { Button, Tooltip } from '@nextui-org/react';
import { Save } from 'lucide-react';

interface EditorProps {
  initialMarkdown: string;
  contentId: string;
  order: number;
}

export default function Editor({
  initialMarkdown,
  contentId,
  order,
}: EditorProps) {
  const dictionary = useDictionary('content');

  const { markdown, setMarkdown, save } = useSummaryEditor(
    initialMarkdown,
    contentId,
    order,
    dictionary['summary-updated'],
    dictionary['summary-error'],
  );

  return (
    <div className="flex flex-col justify-center items-center h-full w-11/12 max-w-3xl overflow-y-auto relative gap-6">
      <Tooltip content={dictionary['save-summary']} color="primary" showArrow>
        <Button
          onPress={save}
          variant="ghost"
          color="primary"
          isIconOnly
          size="lg"
          className="self-end"
          aria-label={dictionary['save-summary']}
        >
          <Save className="size-6" />
        </Button>
      </Tooltip>
      <ForwardRefEditor
        markdown={markdown}
        onChange={setMarkdown}
        className="prose dark:prose-invert"
      />
    </div>
  );
}

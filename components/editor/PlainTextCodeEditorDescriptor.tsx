import {
  CodeBlockEditorDescriptor,
  useCodeBlockEditorContext,
} from '@mdxeditor/editor';
import { Textarea } from '@nextui-org/react';
import Mermaid from '../mermaid/Mermaid';

export const PlainTextCodeEditorDescriptor: CodeBlockEditorDescriptor = {
  match: () => true,
  priority: 0,
  Editor: (props) => {
    const cb = useCodeBlockEditorContext();
    return (
      <>
        <div
          onKeyDown={(e) => {
            e.nativeEvent.stopImmediatePropagation();
          }}
        >
          <Textarea
            minRows={10}
            maxRows={50}
            color="primary"
            variant="bordered"
            className="w-full"
            defaultValue={props.code}
            onChange={(e) => {
              cb.setCode(e.target.value);
            }}
          />
        </div>
        <Mermaid chart={props.code} />
      </>
    );
  },
};

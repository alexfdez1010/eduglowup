import { Divider } from '@nextui-org/divider';

interface DividerSignProps {
  or: string;
}

export function DividerSign({ or }: DividerSignProps) {
  return (
    <div className="w-full flex flex-row justify-center items-center gap-1">
      <Divider className="w-1/2 h-0.5" />
      <p className="text-sm">{or}</p>
      <Divider className="w-1/2 h-0.5" />
    </div>
  );
}

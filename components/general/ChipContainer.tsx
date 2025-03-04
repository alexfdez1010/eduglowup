import { Chip } from '@nextui-org/chip';

interface ChipContainerProps {
  items: string[];
  color?:
    | 'primary'
    | 'success'
    | 'warning'
    | 'default'
    | 'danger'
    | 'secondary';
  variant?:
    | 'dot'
    | 'solid'
    | 'bordered'
    | 'light'
    | 'flat'
    | 'faded'
    | 'shadow';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  removeFunction?: (key: string) => void;
}

export default function ChipContainer({
  items,
  color = 'default',
  variant = 'solid',
  className = '',
  removeFunction,
  size = 'md',
}: ChipContainerProps) {
  return (
    <div
      className={`flex flex-row gap-2 justify-center items-center flex-wrap ${className}`}
    >
      {items.map((item, index) => (
        <Chip
          variant={variant}
          color={color}
          key={index}
          size={size}
          className={size === 'sm' && 'text-xs'}
          {...(removeFunction && { onClose: () => removeFunction(item) })}
        >
          {item}
        </Chip>
      ))}
    </div>
  );
}

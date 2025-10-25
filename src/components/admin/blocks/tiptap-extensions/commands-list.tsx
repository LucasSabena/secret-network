import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { cn } from '@/lib/utils';

interface CommandsListProps {
  items: Array<{
    title: string;
    description: string;
    command: (props: any) => void;
  }>;
  command: (item: any) => void;
}

export const CommandsList = forwardRef((props: CommandsListProps, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];
    if (item) {
      props.command(item);
    }
  };

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        upHandler();
        return true;
      }

      if (event.key === 'ArrowDown') {
        downHandler();
        return true;
      }

      if (event.key === 'Enter') {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  return (
    <div className="bg-background border rounded-lg shadow-lg overflow-hidden max-h-[300px] overflow-y-auto">
      {props.items.length > 0 ? (
        props.items.map((item, index) => (
          <button
            key={index}
            type="button"
            className={cn(
              'w-full text-left px-4 py-2 hover:bg-accent transition-colors',
              index === selectedIndex && 'bg-accent'
            )}
            onClick={() => selectItem(index)}
          >
            <div className="font-medium text-sm">{item.title}</div>
            <div className="text-xs text-muted-foreground">{item.description}</div>
          </button>
        ))
      ) : (
        <div className="px-4 py-2 text-sm text-muted-foreground">
          No se encontraron comandos
        </div>
      )}
    </div>
  );
});

CommandsList.displayName = 'CommandsList';

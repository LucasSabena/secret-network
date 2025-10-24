'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { GripVertical } from 'lucide-react';

interface ResizablePanelsProps {
  leftPanel: ReactNode;
  centerPanel: ReactNode;
  rightPanel: ReactNode;
  defaultLeftWidth?: number;
  defaultRightWidth?: number;
  minWidth?: number;
  maxWidth?: number;
}

export function ResizablePanels({
  leftPanel,
  centerPanel,
  rightPanel,
  defaultLeftWidth = 256, // 64 * 4 = w-64
  defaultRightWidth = 320, // 80 * 4 = w-80
  minWidth = 200,
  maxWidth = 600,
}: ResizablePanelsProps) {
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
  const [rightWidth, setRightWidth] = useState(defaultRightWidth);
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      if (isResizingLeft) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const newWidth = e.clientX - containerRect.left;
        if (newWidth >= minWidth && newWidth <= maxWidth) {
          setLeftWidth(newWidth);
        }
      }

      if (isResizingRight) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const newWidth = containerRect.right - e.clientX;
        if (newWidth >= minWidth && newWidth <= maxWidth) {
          setRightWidth(newWidth);
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizingLeft(false);
      setIsResizingRight(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    if (isResizingLeft || isResizingRight) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingLeft, isResizingRight, minWidth, maxWidth]);

  return (
    <div ref={containerRef} className="flex h-full relative">
      {/* Panel Izquierdo */}
      <div
        style={{ width: `${leftWidth}px` }}
        className="shrink-0 border-r bg-muted/30 hidden md:flex flex-col overflow-hidden"
      >
        {leftPanel}
      </div>

      {/* Resize Handle Izquierdo */}
      <div
        className="hidden md:flex w-1 hover:w-2 bg-transparent hover:bg-pink-500/20 cursor-col-resize items-center justify-center group transition-all relative"
        onMouseDown={() => setIsResizingLeft(true)}
      >
        <div className="absolute inset-y-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="h-4 w-4 text-pink-500" />
        </div>
      </div>

      {/* Panel Central */}
      <div className="flex-1 bg-background overflow-hidden">
        {centerPanel}
      </div>

      {/* Resize Handle Derecho */}
      <div
        className="hidden md:flex w-1 hover:w-2 bg-transparent hover:bg-pink-500/20 cursor-col-resize items-center justify-center group transition-all relative"
        onMouseDown={() => setIsResizingRight(true)}
      >
        <div className="absolute inset-y-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="h-4 w-4 text-pink-500" />
        </div>
      </div>

      {/* Panel Derecho */}
      <div
        style={{ width: `${rightWidth}px`, maxWidth: '100%' }}
        className="shrink-0 border-l bg-muted/30 hidden md:flex flex-col overflow-hidden"
      >
        {rightPanel}
      </div>
    </div>
  );
}

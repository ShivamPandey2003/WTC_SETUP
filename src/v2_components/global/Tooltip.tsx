import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  position?: TooltipPosition;
  delay?: number;
  className?: string;
}

interface Coords {
  top: number;
  left: number;
  transformOrigin: string;
}

const OFFSET = 8;

function getCoords(
  trigger: DOMRect,
  tooltip: DOMRect,
  position: TooltipPosition
): Coords {
  switch (position) {
    case 'top':
      return {
        top: trigger.top - tooltip.height - OFFSET + window.scrollY,
        left: trigger.left + trigger.width / 2 - tooltip.width / 2 + window.scrollX,
        transformOrigin: 'bottom center',
      };
    case 'bottom':
      return {
        top: trigger.bottom + OFFSET + window.scrollY,
        left: trigger.left + trigger.width / 2 - tooltip.width / 2 + window.scrollX,
        transformOrigin: 'top center',
      };
    case 'left':
      return {
        top: trigger.top + trigger.height / 2 - tooltip.height / 2 + window.scrollY,
        left: trigger.left - tooltip.width - OFFSET + window.scrollX,
        transformOrigin: 'right center',
      };
    case 'right':
      return {
        top: trigger.top + trigger.height / 2 - tooltip.height / 2 + window.scrollY,
        left: trigger.right + OFFSET + window.scrollX,
        transformOrigin: 'left center',
      };
  }
}

export function Tooltip({
  content,
  children,
  position = 'top',
  delay = 120,
  className = '',
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState<Coords | null>(null);
  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reposition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    setCoords(getCoords(triggerRect, tooltipRect, position));
  }, [position]);

  useEffect(() => {
    if (visible) {
      requestAnimationFrame(reposition);
    }
  }, [visible, reposition]);

  const show = () => {
    timerRef.current = setTimeout(() => setVisible(true), delay);
  };

  const hide = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
    setCoords(null);
  };

  const child = children as React.ReactElement<
  React.HTMLAttributes<HTMLElement>
>;

  const trigger = (
    <child.type
      {...child.props}
      ref={triggerRef}
      onMouseEnter={(e: any) => {
        child.props.onMouseEnter?.(e);
        show();
      }}
      onMouseLeave={(e: any) => {
        child.props.onMouseLeave?.(e);
        hide();
      }}
      onFocus={(e: any) => {
        child.props.onFocus?.(e);
        show();
      }}
      onBlur={(e: any) => {
        child.props.onBlur?.(e);
        hide();
      }}
    />
  );

  const arrowClasses: Record<TooltipPosition, { outer: string; inner: string }> = {
    top: {
      outer: 'bottom-[-6px] left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-900',
      inner: 'bottom-[-8px] left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-900',
    },
    bottom: {
      outer: 'top-[-6px] left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-900',
      inner: 'top-[-5px] left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-900',
    },
    left: {
      outer: 'right-[-6px] top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-900',
      inner: 'right-[-15px] top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-900',
    },
    right: {
      outer: 'left-[-6px] top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-900',
      inner: 'left-[-5px] top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-900',
    },
  };

  return (
    <>
      {trigger}
      {createPortal(
        <div
          ref={tooltipRef}
          role="tooltip"
          style={{
            position: 'absolute',
            zIndex: 2147483647,
            top: coords ? coords.top : 0,
            left: coords ? coords.left : 0,
            transformOrigin: coords?.transformOrigin ?? 'center',
            pointerEvents: 'none',
            visibility: coords ? 'visible' : 'hidden',
          }}
        >
          <div
            className={[
              'relative max-w-3xs rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg break-words',
              className,
            ].join(' ')}
          >
            {content}
            <span
              className={[
                'absolute border-4',
                arrowClasses[position].outer,
              ].join(' ')}
            />
            <span
              className={[
                'absolute border-8',
                arrowClasses[position].inner,
              ].join(' ')}
            />
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

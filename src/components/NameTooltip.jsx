/**
 * NameTooltip – Portal-based tooltip that renders at <body> level.
 * It positions itself ABOVE the trigger element using getBoundingClientRect,
 * so it is never clipped by any parent overflow:hidden container.
 *
 * Usage:
 *   const [tipAnchor, setTipAnchor] = useState(null); // {rect, text}
 *
 *   <span onClick={e => setTipAnchor({ rect: e.currentTarget.getBoundingClientRect(), text: product.name })}>
 *     {product.name}
 *   </span>
 *   <NameTooltip anchor={tipAnchor} onClose={() => setTipAnchor(null)} />
 */
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function NameTooltip({ anchor, onClose, autoDismissMs = 3000 }) {
  const timerRef = useRef(null);

  useEffect(() => {
    if (!anchor) return;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onClose(), autoDismissMs);
    return () => clearTimeout(timerRef.current);
  }, [anchor]);

  if (!anchor) return null;

  const { rect, text } = anchor;

  // Position bubble: centered above the trigger element.
  // We use fixed positioning so scroll doesn't affect it.
  const TOOLTIP_W = 220;
  const GAP = 8;

  let left = rect.left + rect.width / 2 - TOOLTIP_W / 2;
  // Clamp to viewport
  left = Math.max(8, Math.min(left, window.innerWidth - TOOLTIP_W - 8));
  const top = rect.top + window.scrollY - GAP; // we'll translate up from bottom via transform

  return createPortal(
    <>
      {/* Backdrop – tapping anywhere dismisses the tooltip */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99998,
          background: 'transparent',
        }}
      />

      {/* Tooltip bubble */}
      <div
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        style={{
          position: 'absolute',
          top: `${top}px`,
          left: `${left}px`,
          transform: 'translateY(-100%)',
          width: `${TOOLTIP_W}px`,
          zIndex: 99999,
          background: 'rgba(15,23,42,0.95)',
          color: '#fff',
          fontSize: '0.8rem',
          fontWeight: '600',
          fontFamily: 'inherit',
          padding: '9px 13px',
          borderRadius: '10px',
          boxShadow: '0 6px 24px rgba(0,0,0,0.35)',
          lineHeight: '1.45',
          wordBreak: 'break-word',
          whiteSpace: 'normal',
          pointerEvents: 'auto',
          // Tail (triangle) pointing DOWN towards the element
          '--tail-left': `${Math.min(Math.max(rect.left + rect.width / 2 - left, 16), TOOLTIP_W - 16)}px`,
        }}
      >
        {text}
        {/* Downward pointing tail */}
        <div style={{
          position: 'absolute',
          bottom: '-7px',
          left: 'var(--tail-left)',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '7px solid transparent',
          borderRight: '7px solid transparent',
          borderTop: '7px solid rgba(15,23,42,0.95)',
        }} />
      </div>
    </>,
    document.body
  );
}

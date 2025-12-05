// --- BECOME PRISM v1.0: The Final Covenant (Sandbox Universe) ---
// ALL processing happens inside this isolated popup environment
// CSS-in-JS for pixel-perfect styling - NO external CSS files

import React, { useEffect, useRef, useState, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import TurndownService from 'turndown';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// DNA COLORS
// ============================================

const DNA_COLORS = {
  red: '#ff4d4d',
  yellow: '#ffcc00',
  blue: '#3399ff',
  cyan: '#00ffff',
};

const INVESTMENT_URL = 'https://iambecoming.gumroad.com/l/prism';

// ============================================
// CSS-IN-JS: Style Objects (Pixel-Perfect)
// ============================================

const STYLES = {
  body: (isLiteMode: boolean) => ({
    width: '340px',
    height: isLiteMode ? '260px' : '480px',
    // The Incense Temple: Spiritual palette with smoke animation
    background: `
      radial-gradient(ellipse at 50% 20%, rgba(255, 193, 7, 0.12) 0%, transparent 40%),
      radial-gradient(ellipse at 80% 60%, rgba(138, 43, 226, 0.15) 0%, transparent 50%),
      radial-gradient(ellipse at 20% 70%, rgba(75, 0, 130, 0.18) 0%, transparent 50%),
      radial-gradient(ellipse at center, rgba(25, 25, 50, 0.95) 0%, rgba(15, 10, 30, 0.98) 100%)
    `,
    backdropFilter: 'blur(12px)',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    color: 'white',
    margin: 0,
    padding: 0,
    position: 'relative' as const,
    overflow: 'hidden' as const,
    transition: 'height 0.3s ease-in-out',
    // Smoke flow animation
    animation: 'smokeFlow 20s ease-in-out infinite',
  }),
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  popupContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    position: 'relative' as const,
    padding: '0 20px',
    gap: '16px',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    transform: 'translateZ(0)',
    willChange: 'transform',
  },
  popupHeader: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginBottom: '8px',
  },
  buttonsLayout: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
    width: '100%',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  primaryRow: {
    display: 'flex',
    flexDirection: 'row' as const,
    gap: '16px',
    flexShrink: 0,
    width: '100%',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  secondaryRow: {
    display: 'flex',
    flexDirection: 'row' as const,
    gap: '16px',
    flexShrink: 0,
    width: '100%',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  glassButton: (color: string) => ({
    width: '120px',
    height: '40px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: `1px solid rgba(255, 255, 255, 0.4)`,
    borderRadius: '30px',
    padding: '8px 16px',
    display: 'flex',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    cursor: 'pointer',
    transition: 'all 0.1s ease-out',
    backdropFilter: 'blur(10px)',
    position: 'relative' as const,
    boxShadow: `inset 0 0 15px rgba(255, 255, 255, 0.1), 0 0 15px ${color}40`,
    color: 'white',
    fontSize: '14px',
    fontWeight: 700,
    letterSpacing: '1px',
    textTransform: 'uppercase' as const,
    textShadow: `0 0 10px ${color}, 0 0 20px ${color}, 0 2px 4px rgba(0, 0, 0, 0.5)`,
    opacity: 0.9,
    willChange: 'transform, opacity',
  }),
  glassButtonPrimary: (color: string) => ({
    width: '260px',
    height: '48px',
    background: 'rgba(255, 255, 255, 0.08)',
    border: `1px solid rgba(255, 255, 255, 0.4)`,
    borderRadius: '30px',
    padding: '12px 24px',
    display: 'flex',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    cursor: 'pointer',
    transition: 'all 0.1s ease-out',
    backdropFilter: 'blur(10px)',
    position: 'relative' as const,
    boxShadow: `inset 0 0 15px rgba(255, 255, 255, 0.1), 0 0 10px ${color}40`,
    color: 'white',
    fontSize: '16px',
    fontWeight: 700,
    letterSpacing: '2px',
    textTransform: 'uppercase' as const,
    willChange: 'transform, opacity',
    textShadow: `0 0 10px ${color}, 0 0 20px ${color}, 0 0 30px ${color}, 0 2px 4px rgba(0, 0, 0, 0.5)`,
  }),
  helpCardContainer: {
    position: 'fixed' as const,
    bottom: '10px',
    right: '15px',
    width: '50px',
    height: '50px',
    perspective: '1000px',
    zIndex: 100,
  },
  helpCard: {
    width: '100%',
    height: '100%',
    position: 'relative' as const,
    transformStyle: 'preserve-3d' as const,
    transition: 'transform 0.6s',
    cursor: 'pointer',
  },
  helpCardFlipped: {
    transform: 'rotateY(180deg)',
  },
  helpCardFront: {
    width: '100%',
    height: '100%',
    position: 'absolute' as const,
    backfaceVisibility: 'hidden' as const,
    display: 'flex',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    background: 'rgba(255, 255, 255, 0.1)',
    border: '2px solid rgba(0, 255, 255, 0.3)',
    borderRadius: '50%',
    backdropFilter: 'blur(12px)',
    boxShadow: `0 0 10px ${DNA_COLORS.cyan}40`,
  },
  helpCardBack: {
    width: '100%',
    height: '100%',
    position: 'absolute' as const,
    backfaceVisibility: 'hidden' as const,
    transform: 'rotateY(180deg)',
    background: 'rgba(20, 30, 45, 0.95)',
    border: '2px solid rgba(0, 255, 255, 0.5)',
    borderRadius: '12px',
    backdropFilter: 'blur(12px)',
    padding: '16px',
    boxShadow: `0 0 30px ${DNA_COLORS.cyan}60`,
    overflow: 'auto' as const,
  },
  helpContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    fontSize: '11px',
    lineHeight: '1.6',
    width: '100%',
  },
  helpDataRow: {
    display: 'flex',
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    padding: '8px 0',
    borderBottom: '1px dotted rgba(255, 255, 255, 0.2)',
    width: '100%',
  },
  helpDataLabel: {
    fontWeight: 700,
    color: 'white',
    fontSize: '11px',
    letterSpacing: '1px',
    textTransform: 'uppercase' as const,
  },
  helpDataDesc: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '10px',
    textAlign: 'right' as const,
  },
  helpTitle: {
    fontSize: '16px',
    fontWeight: 800,
    marginBottom: '20px',
    color: DNA_COLORS.cyan,
    textShadow: `0 0 10px ${DNA_COLORS.cyan}, 0 0 20px ${DNA_COLORS.cyan}, 0 0 30px ${DNA_COLORS.cyan}`,
    letterSpacing: '2px',
    textTransform: 'uppercase' as const,
  },
  helpInputLabel: {
    fontSize: '10px',
    marginBottom: '8px',
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: "'Courier New', monospace",
    letterSpacing: '1px',
  },
  helpBackButton: {
    marginTop: '24px',
    padding: '8px 20px',
    background: 'transparent',
    border: '1px solid rgba(255, 77, 77, 0.6)',
    borderRadius: '4px',
    color: 'rgba(255, 77, 77, 0.9)',
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '2px',
    cursor: 'pointer',
    textTransform: 'uppercase' as const,
    textShadow: '0 0 8px rgba(255, 77, 77, 0.5)',
    transition: 'all 0.2s ease',
    alignSelf: 'center' as const,
  },
  helpInput: {
    width: '100%',
    padding: '6px 0',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(0, 255, 255, 0.5)',
    borderRadius: '0',
    color: DNA_COLORS.cyan,
    fontSize: '11px',
    fontFamily: "'Courier New', monospace",
    outline: 'none',
    transition: 'border-bottom-color 0.3s ease',
    opacity: 0.7,
  },
  helpInputFocused: {
    borderBottom: `1px solid ${DNA_COLORS.cyan}`,
    boxShadow: `0 1px 0 0 ${DNA_COLORS.cyan}40`,
  },
  nexusContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    gap: '30px',
  },
  nexusMessage: {
    textAlign: 'center' as const,
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '14px',
  },
  // Global Flip Styles
  scene: (isLiteMode: boolean) => ({
    width: '100%',
    height: isLiteMode ? '260px' : '480px',
    perspective: '1000px',
    position: 'relative' as const,
    overflow: 'hidden' as const,
    transition: 'height 0.3s ease-in-out',
  }),
  card: (isFlipped: boolean) => ({
    width: '100%',
    height: '100%',
    position: 'relative' as const,
    transition: 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    transformStyle: 'preserve-3d' as const,
    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
  }),
  face: {
    position: 'absolute' as const,
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  backFace: {
    transform: 'rotateY(180deg)',
    background: 'rgba(10, 15, 25, 0.95)',
    padding: '20px',
    borderRadius: '20px',
  },
  helpButton: {
    position: 'absolute' as const,
    bottom: '10px',
    right: '10px',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(0, 255, 255, 0.3)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    zIndex: 100,
    backdropFilter: 'blur(20px)',
    boxShadow: `0 0 10px ${DNA_COLORS.cyan}30`,
    transition: 'all 0.2s ease',
  },
  modeToggle: {
    position: 'absolute' as const,
    top: '10px',
    left: '10px',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: 'transparent',
    border: '1px solid rgba(255, 193, 7, 0.2)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    zIndex: 100,
    backdropFilter: 'blur(10px)',
    boxShadow: 'none',
    transition: 'all 0.3s ease',
    opacity: 0.6,
  },
  thirdEye: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255, 193, 7, 0.9) 0%, rgba(255, 193, 7, 0.3) 70%, transparent 100%)',
    boxShadow: '0 0 10px rgba(255, 193, 7, 0.8), 0 0 20px rgba(255, 193, 7, 0.4)',
    animation: 'pulse 2s ease-in-out infinite',
  },
  liteLayout: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    alignItems: 'center' as const,
    justifyContent: 'center',
    padding: '8px 20px',
    width: '100%',
    height: '100%',
  },
  liteGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    width: '100%',
    maxWidth: '280px',
  },
  liteButton: (color: string) => ({
    width: '100%',
    height: '44px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: `1px solid rgba(255, 255, 255, 0.4)`,
    borderRadius: '30px',
    padding: '8px 12px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    cursor: 'pointer',
    transition: 'all 0.1s ease-out',
    backdropFilter: 'blur(10px)',
    boxShadow: `inset 0 0 15px rgba(255, 255, 255, 0.1), 0 0 15px ${color}40`,
    color: 'white',
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '1px',
    textTransform: 'uppercase' as const,
    textShadow: `0 0 10px ${color}, 0 0 20px ${color}, 0 2px 4px rgba(0, 0, 0, 0.5)`,
  }),
};

// Eye Styles (CSS-in-JS) - The Perfect Orb (2.5D Illusion)
const EYE_STYLES = {
  container: (glowColor?: string) => ({
    width: '100%',
    height: '100%',
    position: 'relative' as const,
    // Round the eye: Force perfect circle and clip glint inside
    borderRadius: '50%',
    overflow: 'visible' as const, // Changed to visible to show tech ring
    // Liberated: No background, no border, pure transparency
    background: 'transparent',
    border: 'none',
    outline: 'none',
    cursor: 'pointer' as const,
    // Cinematic Glow: Stronger, more glossy
    boxShadow: glowColor
      ? `0 0 60px 15px ${glowColor}, 0 0 100px 20px ${glowColor}, 0 0 150px 30px ${glowColor}, 0 0 200px 40px ${glowColor}80`
      : `0 0 40px 10px rgba(255, 255, 255, 0.2), 0 0 80px 20px rgba(255, 255, 255, 0.1)`,
    transition: 'box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    // The Breath of Life: Subtle pulsing animation
    animation: 'breathe 6s ease-in-out infinite',
    willChange: 'transform, opacity',
  }),
  techRing: {
    position: 'absolute' as const,
    top: '-5px',
    left: '-5px',
    right: '-5px',
    bottom: '-5px',
    borderRadius: '50%',
    border: '2px dashed rgba(0, 255, 255, 0.6)',
    animation: 'techRingSpin 8s linear infinite',
    pointerEvents: 'none' as const,
    zIndex: 0,
  },
  body: {
    width: '100%',
    height: '100%',
    position: 'absolute' as const,
    top: 0,
    left: 0,
    backgroundImage: `url('${chrome.runtime.getURL('assets/perfect_orb.png')}')`,
    backgroundSize: '130%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    zIndex: 1,
    // Round the eye: Force perfect circle
    borderRadius: '50%',
    // Cinematic Zoom: Aggressive scale to remove ALL black borders
    // Hardware acceleration: Force GPU layer
    transform: 'translateZ(0) scale(1.4)',
    willChange: 'transform' as const,
    // The Iris Pulse: Breathing animation
    animation: 'eyePulse 4s ease-in-out infinite',
    // Liberate from black box: Remove any background, ensure transparency
    backgroundColor: 'transparent',
    // If the image has black background, use mix-blend-mode to make it transparent
    // mixBlendMode: 'screen' will make black transparent while preserving colors
    mixBlendMode: 'screen' as const,
  },
  glint: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    width: '30%',
    height: '30%',
    // The Living Glint: Soft white reflection
    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.3) 40%, transparent 70%)',
    borderRadius: '50%',
    pointerEvents: 'none' as const,
    zIndex: 2,
    // Base transform for centering, will be modified by JS
    transform: 'translateZ(0) translate(-50%, -50%)',
    // Hardware acceleration: Force GPU layer
    willChange: 'transform',
  },
};

// ============================================
// Sentient Eye Component: The Perfect Orb (2.5D Illusion)
// ============================================

interface SentientEyeProps {
  resonanceClass?: 'preserve' | 'transplant' | 'dna' | 'soul' | null;
  onClick?: () => void;
}

function SentientEye({ resonanceClass, onClick }: SentientEyeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const glintRef = useRef<HTMLDivElement>(null);

  // Aura of Power: Color resonance glow
  const glowColor = resonanceClass === 'preserve' ? DNA_COLORS.red :
                    resonanceClass === 'transplant' ? DNA_COLORS.yellow :
                    resonanceClass === 'dna' ? DNA_COLORS.blue :
                    resonanceClass === 'soul' ? DNA_COLORS.cyan : undefined;

  // High-Performance Direct DOM Manipulation: Zero React Re-renders
  useEffect(() => {
    let rafId: number | null = null;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate relative position (-1 to 1)
      const relX = (e.clientX - centerX) / (rect.width / 2);
      const relY = (e.clientY - centerY) / (rect.height / 2);
      
      // Set target for lerp animation (eye moves slightly, glint moves opposite)
      targetX = relX;
      targetY = relY;
    };

    const animate = () => {
      // Lerp: Move 10% towards target per frame (buttery smooth)
      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;
      
      // Direct DOM manipulation: No React state, zero re-renders
      if (bodyRef.current) {
        // Eye body moves slightly towards mouse (subtle tracking)
        // Preserve translateZ(0) for hardware acceleration
        bodyRef.current.style.transform = `translateZ(0) translate(${currentX * 2}px, ${currentY * 2}px) scale(1.4)`;
      }
      
      if (glintRef.current) {
        // Glint moves OPPOSITE direction (parallax effect)
        glintRef.current.style.transform = `translate(calc(-50% + ${-currentX * 15}px), calc(-50% + ${-currentY * 15}px))`;
      }
      
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={EYE_STYLES.container(glowColor)}
      onClick={onClick}
    >
      <div ref={bodyRef} style={EYE_STYLES.body} />
      <div ref={glintRef} style={EYE_STYLES.glint} />
      {/* Tech Ring: Spinning dashed ring */}
      <div style={EYE_STYLES.techRing} />
    </div>
  );
}

// ============================================
// Glass Button Component
// ============================================

interface GlassButtonProps {
  label: string;
  dnaColor: 'preserve' | 'transplant' | 'dna' | 'soul';
  onClick: () => void;
  onHover: (_resonance: 'preserve' | 'transplant' | 'dna' | 'soul' | null) => void;
  isPrimary?: boolean;
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ label, dnaColor, onClick, onHover, isPrimary = false }, ref) => {
    const color = dnaColor === 'preserve' ? DNA_COLORS.red :
                  dnaColor === 'transplant' ? DNA_COLORS.yellow :
                  dnaColor === 'dna' ? DNA_COLORS.blue : DNA_COLORS.cyan;

    const baseStyle = isPrimary 
      ? STYLES.glassButtonPrimary(color)
      : STYLES.glassButton(color);

    return (
      <button
        ref={ref}
        style={baseStyle}
        onClick={onClick}
        onMouseEnter={(e) => {
          onHover(dnaColor);
          // Hover: Levitate and enhance glow
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.background = isPrimary
            ? `linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.12) 100%)`
            : 'linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)';
          e.currentTarget.style.boxShadow = isPrimary
            ? `inset 0 0 20px rgba(255, 255, 255, 0.15), 0 0 10px ${color}50`
            : `inset 0 0 18px rgba(255, 255, 255, 0.12), 0 0 18px ${color}50`;
        }}
        onMouseLeave={(e) => {
          onHover(null);
          e.currentTarget.style.transform = '';
          e.currentTarget.style.background = baseStyle.background;
          e.currentTarget.style.boxShadow = baseStyle.boxShadow;
        }}
        onMouseDown={(e) => {
          // Active: Press down
          e.currentTarget.style.transform = 'translateY(1px)';
          e.currentTarget.style.boxShadow = isPrimary
            ? `inset 0 0 20px rgba(255, 255, 255, 0.15), 0 0 10px ${color}50`
            : `inset 0 0 18px rgba(255, 255, 255, 0.12), 0 0 18px ${color}50`;
        }}
        onMouseUp={(e) => {
          // Return to hover state if still hovering
          if (e.currentTarget.matches(':hover')) {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = isPrimary
              ? `inset 0 0 20px rgba(255, 255, 255, 0.15), 0 0 10px ${color}50`
              : `inset 0 0 18px rgba(255, 255, 255, 0.12), 0 0 18px ${color}50`;
          } else {
            e.currentTarget.style.transform = '';
            e.currentTarget.style.boxShadow = baseStyle.boxShadow;
          }
        }}
      >
        {label}
      </button>
    );
  }
);

GlassButton.displayName = 'GlassButton';

// ============================================
// Toast Component
// ============================================

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  buttonRef?: React.RefObject<HTMLButtonElement>;
}

function Toast({ message, type, buttonRef }: ToastProps) {
  const [position, setPosition] = useState({ top: '50%', left: '50%' });

  useEffect(() => {
    if (buttonRef?.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: `${rect.top - 40}px`,
        left: `${rect.left + rect.width / 2}px`,
      });
    }
  }, [buttonRef]);

  return (
    <div
      style={{
        position: 'fixed',
        background: 'rgba(0, 0, 0, 0.85)',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '8px',
        fontSize: '12px',
        fontWeight: 600,
        zIndex: 10000,
        pointerEvents: 'none',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${type === 'success' ? 'rgba(0, 255, 0, 0.4)' : 'rgba(255, 0, 0, 0.4)'}`,
        boxShadow: `0 4px 12px ${type === 'success' ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)'}`,
        top: position.top,
        left: position.left,
        transform: 'translateX(-50%)',
        whiteSpace: 'nowrap',
      }}
    >
      {message}
    </div>
  );
}

// ============================================
// Flip Card Help Component with Project Input
// ============================================

function HelpCard() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [projectName, setProjectName] = useState('');

  useEffect(() => {
    chrome.storage.sync.get(['prismProject'], (result) => {
      if (result.prismProject && typeof result.prismProject === 'string') {
        setProjectName(result.prismProject);
      }
    });
  }, []);

  const handleProjectChange = (value: string) => {
    setProjectName(value);
    chrome.storage.sync.set({ prismProject: value });
  };

  return (
    <div style={STYLES.helpCardContainer}>
      <div
        style={{
          ...STYLES.helpCard,
          ...(isFlipped ? STYLES.helpCardFlipped : {})
        }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div style={STYLES.helpCardFront}>
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: DNA_COLORS.cyan, textShadow: `0 0 10px ${DNA_COLORS.cyan}` }}>?</span>
        </div>
        <div style={STYLES.helpCardBack}>
          <div style={STYLES.helpContent}>
            <h3 style={STYLES.helpTitle}>BECOME PRISM</h3>
            <p><strong>PRESERVE:</strong> Save as Markdown File</p>
            <p><strong>TRANSPLANT:</strong> Copy Context for AI Chat</p>
            <p><strong>DNA:</strong> Copy Code Blocks Only</p>
            <p><strong>SOUL:</strong> Copy Text Logic Only</p>
            <div style={{ marginTop: '8px' }}>
              <div style={STYLES.helpInputLabel}>ROUTING NODE:</div>
              <input
                type="text"
                value={projectName}
                onChange={(e) => handleProjectChange(e.target.value)}
                placeholder="Default: Current Domain"
                style={STYLES.helpInput}
                onClick={(e) => e.stopPropagation()}
                onFocus={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.opacity = '0.7';
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Visionary Modal Component
// ============================================

interface VisionaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function VisionaryModal({ isOpen, onClose }: VisionaryModalProps) {
  if (!isOpen) return null;

  const modalStyles = {
    overlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      inset: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      zIndex: 2000,
      padding: '20px',
    },
    card: {
      background: 'rgba(10, 15, 25, 0.95)',
      border: '1px solid rgba(255, 215, 0, 0.3)',
      borderRadius: '20px',
      padding: '32px',
      maxWidth: '400px',
      width: '100%',
      boxShadow: '0 0 40px rgba(255, 215, 0, 0.2), 0 0 80px rgba(255, 215, 0, 0.1)',
      position: 'relative' as const,
    },
    title: {
      fontSize: '24px',
      fontWeight: 800,
      color: '#ffd700',
      textShadow: '0 0 20px #ffd700, 0 0 40px #ffd700',
      letterSpacing: '3px',
      textTransform: 'uppercase' as const,
      marginBottom: '24px',
      textAlign: 'center' as const,
    },
    text: {
      fontSize: '14px',
      lineHeight: '1.8',
      color: 'rgba(255, 255, 255, 0.9)',
      marginBottom: '28px',
      whiteSpace: 'pre-line' as const,
      textAlign: 'center' as const,
    },
    button: {
      width: '100%',
      padding: '14px 24px',
      background: 'transparent',
      border: '2px solid #ffd700',
      borderRadius: '8px',
      color: '#ffd700',
      fontSize: '14px',
      fontWeight: 700,
      letterSpacing: '2px',
      textTransform: 'uppercase' as const,
      cursor: 'pointer' as const,
      textShadow: '0 0 10px #ffd700',
      transition: 'all 0.2s ease',
      marginBottom: '16px',
    },
    footer: {
      fontSize: '11px',
      color: 'rgba(255, 255, 255, 0.5)',
      textAlign: 'center' as const,
      fontStyle: 'italic' as const,
    },
  };

  return (
    <motion.div
      style={modalStyles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        style={modalStyles.card}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={modalStyles.title}>BECOME A VISIONARY</h2>
        <p style={modalStyles.text}>
          PRISM is free. But evolution requires fuel.{'\n\n'}
          By acquiring a Visionary Share, you are not donating.{'\n'}
          You are investing in the architecture of a zero-friction future.{'\n\n'}
          Pay what you believe this vision is worth.
        </p>
        <button
          style={modalStyles.button}
          onClick={() => {
            chrome.tabs.create({ url: INVESTMENT_URL });
            onClose();
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#ffd700';
            e.currentTarget.style.color = '#000';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#ffd700';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          ACQUIRE EQUITY
        </button>
        <p style={modalStyles.footer}>Current Status: Open Source / Public Good</p>
      </motion.div>
    </motion.div>
  );
}

// ============================================
// Main Popup Component
// ============================================

function Popup() {
  const [resonanceClass, setResonanceClass] = useState<'preserve' | 'transplant' | 'dna' | 'soul' | null>(null);
  const [isNexusMode, setIsNexusMode] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLiteMode, setIsLiteMode] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; buttonRef?: React.RefObject<HTMLButtonElement> } | null>(null);
  const [activeTabId, setActiveTabId] = useState<number | null>(null);
  const [showVisionary, setShowVisionary] = useState(false);
  
  const preserveRef = useRef<HTMLButtonElement>(null);
  const transplantRef = useRef<HTMLButtonElement>(null);
  const dnaRef = useRef<HTMLButtonElement>(null);
  const soulRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const checkUrl = async () => {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab.id) {
          setActiveTabId(tab.id);
        }
        if (tab.url) {
          const isRestricted = tab.url.startsWith('chrome://') || 
                             tab.url.startsWith('about:') ||
                             tab.url.startsWith('edge://') ||
                             tab.url === 'about:blank';
          setIsNexusMode(isRestricted);
        }
      } catch (error) {
        console.error('[PRISM] Error checking URL:', error);
      }
    };
    checkUrl();
  }, []);

  // Global styles injection for overflow control
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'prism-global-overflow';
    style.textContent = `
      html, body {
        overflow: hidden !important;
        margin: 0;
        padding: 0;
      }
      * {
        box-sizing: border-box;
      }
    `;
    if (!document.getElementById('prism-global-overflow')) {
      document.head.appendChild(style);
    }
    return () => {
      const existing = document.getElementById('prism-global-overflow');
      if (existing && document.head.contains(existing)) {
        document.head.removeChild(existing);
      }
    };
  }, []);

  // Dynamic body height based on mode
  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;
    if (body) {
      body.style.height = isLiteMode ? '260px' : '480px';
      body.style.transition = 'height 0.3s ease-in-out';
      body.style.overflow = 'hidden';
    }
    if (html) {
      html.style.overflow = 'hidden';
    }
  }, [isLiteMode]);

  useEffect(() => {
    chrome.storage.sync.get(['prismProject'], (result) => {
      if (result.prismProject && typeof result.prismProject === 'string') {
        setProjectName(result.prismProject);
      }
    });
  }, []);

  const handleProjectChange = (value: string) => {
    setProjectName(value);
    chrome.storage.sync.set({ prismProject: value });
  };

  const handleButtonHover = (resonance: 'preserve' | 'transplant' | 'dna' | 'soul' | null) => {
    setResonanceClass(resonance);
  };

  // Silent Reconnection Protocol
  const reconnectContentScript = async (tabId: number): Promise<boolean> => {
    try {
      await chrome.scripting.executeScript({
        target: { tabId },
        files: ['content.js']
      });
      await new Promise(resolve => setTimeout(resolve, 100));
      return true;
    } catch (error) {
      console.error('[PRISM] Reconnection failed:', error);
      return false;
    }
  };

  // Visual feedback: Flash button on hotkey press
  const flashButton = (ref: React.RefObject<HTMLButtonElement>) => {
    if (ref.current) {
      const originalTransform = ref.current.style.transform;
      const originalBoxShadow = ref.current.style.boxShadow;
      ref.current.style.transform = 'scale(0.95)';
      ref.current.style.boxShadow = 'inset 0 0 25px rgba(255, 255, 255, 0.3), 0 0 25px rgba(0, 255, 255, 0.8)';
      setTimeout(() => {
        if (ref.current) {
          ref.current.style.transform = originalTransform;
          ref.current.style.boxShadow = originalBoxShadow;
        }
      }, 200);
    }
  };

  // The Conductor: Unidirectional data flow
  const handleExtract = useCallback(async (mode: 'preserve' | 'transplant' | 'dna' | 'soul') => {
    console.log(`[PRISM] Button clicked: ${mode}`);
    
    if (!activeTabId) {
      setToast({ message: 'No active tab', type: 'error' });
      setTimeout(() => setToast(null), 1500);
      return;
    }

    setToast({ message: 'Extracting...', type: 'success' });

    try {
      // Send message to content.js
      let response;
      try {
        response = await chrome.tabs.sendMessage(activeTabId, { 
          action: 'extract', 
          mode: mode
        });
      } catch (error: any) {
        // Silent Reconnection: Try to reconnect if connection fails
        if (error.message?.includes('Could not establish connection')) {
          const reconnected = await reconnectContentScript(activeTabId);
          if (reconnected) {
            response = await chrome.tabs.sendMessage(activeTabId, { 
              action: 'extract', 
              mode: mode
            });
          } else {
            throw new Error('Page not ready. Try refreshing.');
          }
        } else {
          throw error;
        }
      }

      if (!response || !response.success) {
        throw new Error(response?.error || 'Extraction failed');
      }

      const content = response.content || '';
      const title = response.title || 'Untitled';
      
      // Get URL early for fallback logic
      let url = '';
      try {
        const tab = await chrome.tabs.get(activeTabId);
        url = tab.url || '';
      } catch (error) {
        // If tab retrieval fails, use empty string
        url = '';
      }

      // ============================================
      // INVINCIBLE LOGIC: Pre-flight Check & Fallback
      // ============================================
      // The Black Hole Strategy: Always return something, never fail
      const hasContent = content && typeof content === 'string' && content.trim().length > 0;
      
      // Create metadata-only fallback if content is empty
      const createMetadataFallback = (): string => {
        return `# ${title}\n\nSource: ${url || 'Unknown URL'}\n\n[PRISM NOTE: Content extraction failed on this page, but metadata was preserved.]`;
      };

      // Handle response based on mode
      if (mode === 'preserve') {
        // Pre-flight check: If no content, use metadata-only fallback
        let markdown: string;
        
        if (!hasContent) {
          console.warn('[PRISM] No content extracted, using metadata-only fallback');
          markdown = createMetadataFallback();
        } else {
          // Convert HTML to Markdown with graceful error handling
          try {
            const turndownService = new TurndownService();
            markdown = turndownService.turndown(content);
            
            // If conversion resulted in empty markdown, use fallback
            if (!markdown || markdown.trim().length === 0) {
              console.warn('[PRISM] Markdown conversion resulted in empty content, using metadata-only fallback');
              markdown = createMetadataFallback();
            }
          } catch (turndownError) {
            // If turndown conversion fails, use metadata-only fallback
            console.warn('[PRISM] Turndown conversion failed, using metadata-only fallback:', turndownError);
            markdown = createMetadataFallback();
          }
        }

        const safeTitle = title.replace(/[\\/:*?"<>|]/g, '_');
        const storage = await chrome.storage.sync.get(['prismProject']);
        
        // Auto-Domain Routing: Use hostname if project is empty
        let project = (typeof storage.prismProject === 'string' ? storage.prismProject : '') || '';
        if (!project || (typeof project === 'string' && project.trim() === '')) {
          try {
            const tab = await chrome.tabs.get(activeTabId);
            if (tab.url) {
              try {
                const url = new URL(tab.url);
                const hostname = url.hostname.replace(/^www\./, ''); // Remove www. prefix
                project = hostname.replace(/\./g, '_'); // Replace dots with underscores
              } catch (urlError) {
                // If URL parsing fails, use empty string
                project = '';
              }
            }
          } catch (tabError) {
            // If tab retrieval fails, use empty string
            project = '';
          }
        }

        chrome.runtime.sendMessage({
          action: 'saveFile',
          content: markdown,
          title: safeTitle,
          project: project
        });

        setResonanceClass('preserve');
        setTimeout(() => setResonanceClass(null), 400);
        setToast({ message: 'Saved!', type: 'success', buttonRef: preserveRef });
        setTimeout(() => setToast(null), 1500);

      } else if (mode === 'transplant') {
        // Context Injection Prompt: Copy to clipboard for AI Chat
        let markdown: string;
        
        // Pre-flight check: If no content, use metadata-only fallback
        if (!hasContent) {
          console.warn('[PRISM] No content extracted for transplant, using metadata-only fallback');
          markdown = createMetadataFallback();
        } else {
          // Convert HTML to Markdown with graceful error handling
          try {
            const turndownService = new TurndownService();
            markdown = turndownService.turndown(content);
            
            // If conversion resulted in empty markdown, use fallback
            if (!markdown || markdown.trim().length === 0) {
              console.warn('[PRISM] Markdown conversion resulted in empty content for transplant, using metadata-only fallback');
              markdown = createMetadataFallback();
            }
          } catch (turndownError) {
            // If turndown conversion fails, use metadata-only fallback
            console.warn('[PRISM] Turndown conversion failed for transplant, using metadata-only fallback:', turndownError);
            markdown = createMetadataFallback();
          }
        }
        
        const contextInjection = `[SYSTEM: CONTEXT INJECTION]

SOURCE: ${title}${url ? ` (${url})` : ''}

---

${markdown}

---

INSTRUCTION: Read the context above. Wait for my next command.`;

        // Copy to clipboard
        await navigator.clipboard.writeText(contextInjection);

        setResonanceClass('transplant');
        setTimeout(() => setResonanceClass(null), 400);
        setToast({ message: 'Copied! Paste into AI', type: 'success', buttonRef: transplantRef });
        setTimeout(() => setToast(null), 1500);

      } else if (mode === 'dna' || mode === 'soul') {
        // Pre-flight check: If no content, use metadata-only fallback
        let finalContent: string;
        
        if (!hasContent) {
          console.warn(`[PRISM] No content extracted for ${mode}, using metadata-only fallback`);
          finalContent = createMetadataFallback();
        } else {
          finalContent = content;
        }
        
        // Copy to clipboard
        await navigator.clipboard.writeText(finalContent);

        setResonanceClass(mode);
        setTimeout(() => setResonanceClass(null), 400);
        const buttonRef = mode === 'dna' ? dnaRef : soulRef;
        setToast({ message: 'Copied!', type: 'success', buttonRef });
        setTimeout(() => setToast(null), 1500);
      }

    } catch (error: unknown) {
      const err = error as Error;
      console.error('[PRISM] Error:', err);
      
      // Emotional Error Handling
      let errorMessage = 'Something went wrong';
      if (err.message?.includes('Could not establish connection') || err.message?.includes('Page not ready')) {
        errorMessage = 'Page not ready. Try refreshing.';
      } else if (err.message?.includes('No content')) {
        errorMessage = 'No content found on this page.';
      } else if (err.message?.includes('No code')) {
        errorMessage = 'No code blocks found.';
      } else if (err.message?.includes('No context')) {
        errorMessage = 'No context found.';
      }
      // Removed "Failed to convert content" error - now handled by fallback logic

      setResonanceClass('preserve'); // Red glow for error
      setTimeout(() => setResonanceClass(null), 600);
      setToast({ message: errorMessage, type: 'error' });
      setTimeout(() => setToast(null), 1500);
    }
  }, [activeTabId, preserveRef, transplantRef, dnaRef, soulRef]);

  // Notify background that popup opened (resets Oracle's Whisper)
  useEffect(() => {
    chrome.runtime.sendMessage({ action: 'popup-opened' }).catch(() => {
      // Ignore errors if background is not ready
    });
  }, []);

  // Keyboard Shortcuts: Alt+P, Alt+T, Alt+D, Alt+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if Alt key is pressed and not in an input field
      if (!e.altKey) return;
      
      // Don't trigger if user is typing in an input
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      const key = e.key.toLowerCase();

      if (key === 'p') {
        e.preventDefault();
        e.stopPropagation();
        flashButton(preserveRef);
        handleExtract('preserve');
      } else if (key === 't') {
        e.preventDefault();
        e.stopPropagation();
        flashButton(transplantRef);
        handleExtract('transplant');
      } else if (key === 'd') {
        e.preventDefault();
        e.stopPropagation();
        flashButton(dnaRef);
        handleExtract('dna');
      } else if (key === 's') {
        e.preventDefault();
        e.stopPropagation();
        flashButton(soulRef);
        handleExtract('soul');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleExtract]);

  if (isNexusMode) {
    return (
      <div style={STYLES.nexusContainer}>
        <div style={{ width: '120px', height: '120px' }}>
          <SentientEye resonanceClass="soul" />
        </div>
        <div style={STYLES.nexusMessage}>
          <p>Navigate to a webpage to use BECOME PRISM</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {showVisionary && (
          <VisionaryModal isOpen={showVisionary} onClose={() => setShowVisionary(false)} />
        )}
      </AnimatePresence>
      <motion.div style={STYLES.scene(isLiteMode)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
      {/* Incense Smoke Layers */}
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: '200%',
            height: '200%',
            top: `${i * 25}%`,
            left: `${i * 20}%`,
            background: `radial-gradient(circle, rgba(255, 193, 7, ${0.03 - i * 0.005}) 0%, transparent 70%)`,
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 0,
            willChange: 'transform',
          }}
          animate={{
            rotate: [0, 360],
            x: [0, 50, -50, 0],
            y: [0, -30, 30, 0],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{
            duration: 20 + i * 5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
      
      <motion.div 
        style={STYLES.card(isFlipped)}
        layout
        transition={{ duration: 0.8, ease: [0.175, 0.885, 0.32, 1.275] }}
      >
        {/* Front Face */}
        <div style={STYLES.face}>
          {/* Mode Toggle - Top Left */}
          <motion.button
            style={STYLES.modeToggle}
            onClick={() => setIsLiteMode(!isLiteMode)}
            whileHover={{ scale: 1.1, opacity: 1 }}
            whileTap={{ scale: 0.95 }}
            title={isLiteMode ? 'Switch to Full Mode' : 'Switch to Lite Mode'}
          >
            <motion.span 
              style={{ fontSize: '14px', color: 'rgba(255, 193, 7, 0.7)' }}
              animate={{ rotate: isLiteMode ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isLiteMode ? '●' : '○'}
            </motion.span>
          </motion.button>

          <AnimatePresence mode="wait">
            {isLiteMode ? (
              /* LITE MODE - The Talisman */
              <motion.div
                key="lite"
                style={STYLES.liteLayout}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                layout
              >
                {toast && <Toast message={toast.message} type={toast.type} buttonRef={toast.buttonRef} />}
                {/* Compact 2x2 Grid */}
                <motion.div 
                  style={STYLES.liteGrid}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <motion.button
                    ref={preserveRef}
                    style={STYLES.liteButton(DNA_COLORS.red)}
                    onClick={() => handleExtract('preserve')}
                    onMouseEnter={(e) => {
                      handleButtonHover('preserve');
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.boxShadow = `inset 0 0 18px rgba(255, 255, 255, 0.12), 0 0 18px ${DNA_COLORS.red}50`;
                    }}
                    onMouseLeave={(e) => {
                      handleButtonHover(null);
                      e.currentTarget.style.transform = '';
                      e.currentTarget.style.background = STYLES.liteButton(DNA_COLORS.red).background;
                      e.currentTarget.style.boxShadow = STYLES.liteButton(DNA_COLORS.red).boxShadow;
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.transform = 'translateY(1px)';
                      e.currentTarget.style.boxShadow = `inset 0 0 20px rgba(255, 255, 255, 0.15), 0 0 10px ${DNA_COLORS.red}50`;
                    }}
                    onMouseUp={(e) => {
                      if (e.currentTarget.matches(':hover')) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = `inset 0 0 18px rgba(255, 255, 255, 0.12), 0 0 18px ${DNA_COLORS.red}50`;
                      } else {
                        e.currentTarget.style.transform = '';
                        e.currentTarget.style.boxShadow = STYLES.liteButton(DNA_COLORS.red).boxShadow;
                      }
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <span>PRESERVE</span>
                    <span style={{ fontSize: '9px', opacity: 0.7, marginTop: '2px' }}>Alt+P</span>
                  </motion.button>
                  <motion.button
                    ref={transplantRef}
                    style={STYLES.liteButton(DNA_COLORS.yellow)}
                    onClick={() => handleExtract('transplant')}
                    onMouseEnter={(e) => {
                      handleButtonHover('transplant');
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.boxShadow = `inset 0 0 18px rgba(255, 255, 255, 0.12), 0 0 18px ${DNA_COLORS.yellow}50`;
                    }}
                    onMouseLeave={(e) => {
                      handleButtonHover(null);
                      e.currentTarget.style.transform = '';
                      e.currentTarget.style.background = STYLES.liteButton(DNA_COLORS.yellow).background;
                      e.currentTarget.style.boxShadow = STYLES.liteButton(DNA_COLORS.yellow).boxShadow;
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.transform = 'translateY(1px)';
                      e.currentTarget.style.boxShadow = `inset 0 0 20px rgba(255, 255, 255, 0.15), 0 0 10px ${DNA_COLORS.yellow}50`;
                    }}
                    onMouseUp={(e) => {
                      if (e.currentTarget.matches(':hover')) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = `inset 0 0 18px rgba(255, 255, 255, 0.12), 0 0 18px ${DNA_COLORS.yellow}50`;
                      } else {
                        e.currentTarget.style.transform = '';
                        e.currentTarget.style.boxShadow = STYLES.liteButton(DNA_COLORS.yellow).boxShadow;
                      }
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <span>TRANSPLANT</span>
                    <span style={{ fontSize: '9px', opacity: 0.7, marginTop: '2px' }}>Alt+T</span>
                  </motion.button>
                  <motion.button
                    ref={dnaRef}
                    style={STYLES.liteButton(DNA_COLORS.blue)}
                    onClick={() => handleExtract('dna')}
                    onMouseEnter={(e) => {
                      handleButtonHover('dna');
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.boxShadow = `inset 0 0 18px rgba(255, 255, 255, 0.12), 0 0 18px ${DNA_COLORS.blue}50`;
                    }}
                    onMouseLeave={(e) => {
                      handleButtonHover(null);
                      e.currentTarget.style.transform = '';
                      e.currentTarget.style.background = STYLES.liteButton(DNA_COLORS.blue).background;
                      e.currentTarget.style.boxShadow = STYLES.liteButton(DNA_COLORS.blue).boxShadow;
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.transform = 'translateY(1px)';
                      e.currentTarget.style.boxShadow = `inset 0 0 20px rgba(255, 255, 255, 0.15), 0 0 10px ${DNA_COLORS.blue}50`;
                    }}
                    onMouseUp={(e) => {
                      if (e.currentTarget.matches(':hover')) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = `inset 0 0 18px rgba(255, 255, 255, 0.12), 0 0 18px ${DNA_COLORS.blue}50`;
                      } else {
                        e.currentTarget.style.transform = '';
                        e.currentTarget.style.boxShadow = STYLES.liteButton(DNA_COLORS.blue).boxShadow;
                      }
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <span>DNA</span>
                    <span style={{ fontSize: '9px', opacity: 0.7, marginTop: '2px' }}>Alt+D</span>
                  </motion.button>
                  <motion.button
                    ref={soulRef}
                    style={STYLES.liteButton(DNA_COLORS.cyan)}
                    onClick={() => handleExtract('soul')}
                    onMouseEnter={(e) => {
                      handleButtonHover('soul');
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.boxShadow = `inset 0 0 18px rgba(255, 255, 255, 0.12), 0 0 18px ${DNA_COLORS.cyan}50`;
                    }}
                    onMouseLeave={(e) => {
                      handleButtonHover(null);
                      e.currentTarget.style.transform = '';
                      e.currentTarget.style.background = STYLES.liteButton(DNA_COLORS.cyan).background;
                      e.currentTarget.style.boxShadow = STYLES.liteButton(DNA_COLORS.cyan).boxShadow;
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.transform = 'translateY(1px)';
                      e.currentTarget.style.boxShadow = `inset 0 0 20px rgba(255, 255, 255, 0.15), 0 0 10px ${DNA_COLORS.cyan}50`;
                    }}
                    onMouseUp={(e) => {
                      if (e.currentTarget.matches(':hover')) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = `inset 0 0 18px rgba(255, 255, 255, 0.12), 0 0 18px ${DNA_COLORS.cyan}50`;
                      } else {
                        e.currentTarget.style.transform = '';
                        e.currentTarget.style.boxShadow = STYLES.liteButton(DNA_COLORS.cyan).boxShadow;
                      }
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <span>SOUL</span>
                    <span style={{ fontSize: '9px', opacity: 0.7, marginTop: '2px' }}>Alt+S</span>
                  </motion.button>
                </motion.div>
              </motion.div>
            ) : (
              /* FULL MODE - The Temple */
              <motion.div
                key="full"
                style={STYLES.popupContainer}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                layout
              >
                {/* The Eye - The Source */}
                <motion.div 
                  style={STYLES.popupHeader}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <motion.div 
                    style={{ width: '140px', height: '140px', borderRadius: '50%', overflow: 'hidden' }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <SentientEye 
                      resonanceClass={resonanceClass || undefined}
                      onClick={() => setShowVisionary(true)}
                    />
                  </motion.div>
                </motion.div>
                {toast && <Toast message={toast.message} type={toast.type} buttonRef={toast.buttonRef} />}
                {/* The Altar - Sacred Geometry Layout */}
                <motion.div 
                  style={STYLES.buttonsLayout}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  {/* Row 1: PRESERVE (Primary) */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <GlassButton
                      ref={preserveRef}
                      label="PRESERVE"
                      dnaColor="preserve"
                      onClick={() => handleExtract('preserve')}
                      onHover={handleButtonHover}
                      isPrimary={true}
                    />
                  </motion.div>
                  {/* Row 2: TRANSPLANT (Primary) */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <GlassButton
                      ref={transplantRef}
                      label="TRANSPLANT"
                      dnaColor="transplant"
                      onClick={() => handleExtract('transplant')}
                      onHover={handleButtonHover}
                      isPrimary={true}
                    />
                  </motion.div>
                  {/* Row 3: DNA | SOUL (Secondary - Side by Side) */}
                  <motion.div 
                    style={STYLES.secondaryRow}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <GlassButton
                      ref={dnaRef}
                      label="DNA"
                      dnaColor="dna"
                      onClick={() => handleExtract('dna')}
                      onHover={handleButtonHover}
                    />
                    <GlassButton
                      ref={soulRef}
                      label="SOUL"
                      dnaColor="soul"
                      onClick={() => handleExtract('soul')}
                      onHover={handleButtonHover}
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* The Mystery - Tiny Help Button (Both Modes) */}
          <motion.button
            style={STYLES.helpButton}
            onClick={() => setIsFlipped(true)}
            whileHover={{ scale: 1.1, boxShadow: `0 0 15px ${DNA_COLORS.cyan}50` }}
            whileTap={{ scale: 0.95 }}
          >
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: DNA_COLORS.cyan, textShadow: `0 0 6px ${DNA_COLORS.cyan}` }}>?</span>
          </motion.button>
        </div>

        {/* Back Face */}
        <div style={{ ...STYLES.face, ...STYLES.backFace }}>
          <div style={STYLES.helpContent}>
            <h3 style={STYLES.helpTitle}>PRISM PROTOCOLS</h3>
            
            <div style={STYLES.helpDataRow}>
              <span style={STYLES.helpDataLabel}>PRESERVE</span>
              <span style={STYLES.helpDataDesc}>Save as Markdown File</span>
            </div>
            <div style={STYLES.helpDataRow}>
              <span style={STYLES.helpDataLabel}>TRANSPLANT</span>
              <span style={STYLES.helpDataDesc}>Copy Context for AI Chat</span>
            </div>
            <div style={STYLES.helpDataRow}>
              <span style={STYLES.helpDataLabel}>DNA</span>
              <span style={STYLES.helpDataDesc}>Copy Code Blocks Only</span>
            </div>
            <div style={STYLES.helpDataRow}>
              <span style={STYLES.helpDataLabel}>SOUL</span>
              <span style={STYLES.helpDataDesc}>Copy Text Logic Only</span>
            </div>
            
            <div style={{ marginTop: '20px', width: '100%', maxWidth: '280px' }}>
              <div style={STYLES.helpInputLabel}>ROUTING NODE:</div>
              <input
                type="text"
                value={projectName}
                onChange={(e) => handleProjectChange(e.target.value)}
                placeholder="Default: Current Domain"
                style={STYLES.helpInput}
                onFocus={(e) => {
                  e.currentTarget.style.borderBottomColor = DNA_COLORS.cyan;
                  e.currentTarget.style.boxShadow = `0 1px 0 0 ${DNA_COLORS.cyan}40`;
                  e.currentTarget.style.opacity = '1';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderBottomColor = 'rgba(0, 255, 255, 0.5)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.opacity = '0.7';
                }}
              />
            </div>
            <button
              style={STYLES.helpBackButton}
              onClick={() => setIsFlipped(false)}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 77, 77, 0.9)';
                e.currentTarget.style.color = 'rgba(255, 77, 77, 1)';
                e.currentTarget.style.boxShadow = '0 0 12px rgba(255, 77, 77, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 77, 77, 0.6)';
                e.currentTarget.style.color = 'rgba(255, 77, 77, 0.9)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              RETURN TO NEXUS
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
    </>
  );
}

// ============================================
// Global Styles & Initialization
// ============================================

const globalStyle = document.createElement('style');
globalStyle.textContent = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  @keyframes breathe {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.02);
    }
  }
  @keyframes smokeFlow {
    0% {
      background-position: 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%;
    }
    50% {
      background-position: 0% 0%, 0% 0%, 0% 0%, 0% 0%, 100% 100%;
    }
    100% {
      background-position: 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%;
    }
  }
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.6;
      transform: scale(1.2);
    }
  }
  @keyframes eyePulse {
    0%, 100% {
      transform: translateZ(0) scale(1.4);
    }
    50% {
      transform: translateZ(0) scale(1.45);
    }
  }
  @keyframes techRingSpin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  html, body {
    overflow: hidden !important;
    margin: 0;
    padding: 0;
  }
  * {
    box-sizing: border-box;
  }
  body {
    width: 340px;
    height: 480px;
    overflow: hidden;
    transition: height 0.3s ease-in-out;
    background: 
      radial-gradient(ellipse at 50% 20%, rgba(255, 193, 7, 0.12) 0%, transparent 40%),
      radial-gradient(ellipse at 80% 60%, rgba(138, 43, 226, 0.15) 0%, transparent 50%),
      radial-gradient(ellipse at 20% 70%, rgba(75, 0, 130, 0.18) 0%, transparent 50%),
      radial-gradient(ellipse at center, rgba(25, 25, 50, 0.95) 0%, rgba(15, 10, 30, 0.98) 100%),
      linear-gradient(45deg, transparent 30%, rgba(255, 193, 7, 0.05) 50%, transparent 70%);
    background-size: 100% 100%, 100% 100%, 100% 100%, 100% 100%, 200% 200%;
    background-position: 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%;
    animation: smokeFlow 20s ease-in-out infinite;
    backdrop-filter: blur(12px);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: white;
  }
`;
document.head.appendChild(globalStyle);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);

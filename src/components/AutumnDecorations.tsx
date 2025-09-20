import React, { useEffect, useState, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface FallingLeaf {
  id: number;
  left: number;
  animationDuration: number;
  size: number;
  emoji: string;
  delay: number;
}

interface ClickEffect {
  id: number;
  x: number;
  y: number;
  emoji: string;
}

const AutumnDecorations: React.FC = () => {
  const { seasonalTheme } = useTheme();
  const [leaves, setLeaves] = useState<FallingLeaf[]>([]);
  const [clickEffects, setClickEffects] = useState<ClickEffect[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);
  const effectIdRef = useRef(0);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handleChange = () => setReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Generate falling leaves
  useEffect(() => {
    if (seasonalTheme !== 'autumn' || reducedMotion) return;

    const leafEmojis = ['🍁', '🍂', '🍃', '🍄', '🌰'];
    const generateLeaves = () => {
      const newLeaves: FallingLeaf[] = [];
      for (let i = 0; i < 8; i++) {
        newLeaves.push({
          id: i,
          left: Math.random() * 100,
          animationDuration: 8 + Math.random() * 12, // 8-20 seconds
          size: 0.8 + Math.random() * 0.7, // 0.8-1.5 scale
          emoji: leafEmojis[Math.floor(Math.random() * leafEmojis.length)],
          delay: Math.random() * 5, // 0-5 second delay
        });
      }
      setLeaves(newLeaves);
    };

    generateLeaves();
    const interval = setInterval(generateLeaves, 15000); // Regenerate every 15 seconds

    return () => clearInterval(interval);
  }, [seasonalTheme, reducedMotion]);

  // Handle click effects
  useEffect(() => {
    if (seasonalTheme !== 'autumn') return;

    const handleClick = (e: MouseEvent) => {
      const effectEmojis = ['🍁', '☕', '🫖', '🕯️', '✨'];
      const newEffect: ClickEffect = {
        id: effectIdRef.current++,
        x: e.clientX,
        y: e.clientY,
        emoji: effectEmojis[Math.floor(Math.random() * effectEmojis.length)],
      };

      setClickEffects(prev => [...prev, newEffect]);

      // Remove effect after animation
      setTimeout(() => {
        setClickEffects(prev => prev.filter(effect => effect.id !== newEffect.id));
      }, 600);
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [seasonalTheme]);

  if (seasonalTheme !== 'autumn') return null;

  return (
    <>
      {/* Background gradient and fog */}
      <div className="autumn-background" />
      <div className="autumn-fog" />

      {/* Falling leaves */}
      {!reducedMotion && (
        <div className="autumn-decorations">
          {leaves.map((leaf) => (
            <div
              key={leaf.id}
              className="falling-leaf"
              style={{
                left: `${leaf.left}%`,
                fontSize: `${leaf.size}rem`,
                animationDuration: `${leaf.animationDuration}s`,
                animationDelay: `${leaf.delay}s`,
              }}
            >
              {leaf.emoji}
            </div>
          ))}
        </div>
      )}

      {/* Static decorative elements - positioned to avoid content areas */}
      <div className="tea-cup" style={{ top: '5%', right: '15%' }}>☕</div>
      <div className="tea-cup" style={{ bottom: '10%', left: '8%' }}>🫖</div>
      <div className="tea-cup" style={{ top: '70%', right: '8%' }}>🕯️</div>

      {/* Click effects */}
      {clickEffects.map((effect) => (
        <div
          key={effect.id}
          className="autumn-click-effect"
          style={{
            left: effect.x - 10,
            top: effect.y - 10,
          }}
        >
          {effect.emoji}
        </div>
      ))}
    </>
  );
};

export default AutumnDecorations;
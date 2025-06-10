'use client'
import React, { useEffect, useState } from 'react';
import { KeyInfo } from '@/types';
import { keyboardLayout, keyCodeToDisplayName } from '@/lib/utils';

interface KeyboardVisualizationProps {
  pressedKeys: KeyInfo[];
}

const KeyboardVisualization: React.FC<KeyboardVisualizationProps> = ({ pressedKeys }) => {
  const [effectMode, setEffectMode] = useState<'subtle' | 'glow' | 'wave'>('subtle');
  
  // Find if a key is currently pressed
  const isKeyPressed = (keyName: string): KeyInfo | undefined => {
    const displayName = keyName.length === 1 && keyName.match(/[a-z]/i)
      ? keyName.toUpperCase() : keyName;
    
    return pressedKeys.find(k => {
      const keyDisplayName = keyCodeToDisplayName[k.code] || k.key;
      return keyDisplayName === displayName || k.key === keyName;
    });
  };

  // Auto cycle through effects
  useEffect(() => {
    const interval = setInterval(() => {
      setEffectMode(prev => {
        if (prev === 'subtle') return 'glow';
        if (prev === 'glow') return 'wave';
        return 'subtle';
      });
    }, 12000);
    
    return () => clearInterval(interval);
  }, []);

  // Key size classes based on key name
  const getKeySizeClass = (key: string): string => {
    const sizeMap: Record<string, string> = {
      'Space': 'key-space',
      'Backspace': 'key-backspace',
      'Tab': 'key-tab',
      'CapsLock': 'key-capslock',
      'Enter': 'key-enter',
      'Shift': 'key-shift'
    };
    
    return sizeMap[key] || 'key-standard';
  };

  return (
    <div className="keyboard-wrapper">
      <div className="keyboard-controls">
        <button 
          onClick={() => {
            setEffectMode(prev => {
              if (prev === 'subtle') return 'glow';
              if (prev === 'glow') return 'wave';
              return 'subtle';
            });
          }}
          className="control-button"
        >
          Style: {effectMode.charAt(0).toUpperCase() + effectMode.slice(1)}
        </button>
      </div>
      
      <div className="keyboard-container">
        <div className={`keyboard effect-${effectMode}`}>
          {Object.entries(keyboardLayout).map(([rowName, keys]) => (
            <div key={rowName} className="keyboard-row">
              {keys.map((key, index) => {
                const pressedKey = isKeyPressed(key);
                const isPressed = Boolean(pressedKey?.isPressed);
                const isCorrect = Boolean(pressedKey?.isCorrect);
                const isIncorrect = Boolean(pressedKey?.isIncorrect);
                
                const sizeClass = getKeySizeClass(key);
                const stateClass = isPressed 
                  ? `key-pressed ${isCorrect ? 'key-correct' : isIncorrect ? 'key-incorrect' : ''}` 
                  : '';
                
                return (
                  <div
                    key={`${rowName}-${index}`}
                    className={`key ${sizeClass} ${stateClass}`}
                    data-key={key}
                    style={{ 
                      animationDelay: `${(index * 0.02) % 0.5}s` 
                    }}
                  >
                    <span className="key-text">{key === 'Space' ? '' : key}</span>
                    {isPressed && <div className="key-ripple"></div>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .keyboard-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
          font-family: 'SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
        }

        .keyboard-controls {
          margin-bottom: 20px;
        }

        .control-button {
          background: linear-gradient(to bottom, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          font-family: inherit;
        }

        .control-button:hover {
          background: linear-gradient(to bottom, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08));
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        .keyboard-container {
          position: relative;
          max-width: 900px;
          width: 100%;
        }

        .keyboard {
          background: linear-gradient(to bottom, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 24px 20px 20px;
          backdrop-filter: blur(20px);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.05) inset;
          transition: all 0.5s ease;
        }

        /* Effect modes */
        .keyboard.effect-subtle {
          background: linear-gradient(to bottom, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
        }

        .keyboard.effect-glow {
          background: linear-gradient(to bottom, rgba(100, 150, 255, 0.08), rgba(100, 150, 255, 0.03));
          border-color: rgba(100, 150, 255, 0.2);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.3),
            0 0 20px rgba(100, 150, 255, 0.1),
            0 0 0 1px rgba(100, 150, 255, 0.1) inset;
        }

        .keyboard.effect-wave {
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.06) 0%,
            rgba(100, 150, 255, 0.04) 50%,
            rgba(255, 255, 255, 0.02) 100%);
          animation: wave-shift 6s ease-in-out infinite;
        }

        .keyboard-row {
          display: flex;
          justify-content: center;
          margin-bottom: 8px;
          gap: 4px;
        }

        .key {
          position: relative;
          height: 48px;
          border-radius: 8px;
          background: linear-gradient(to bottom, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04));
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #fff;
          font-size: 14px;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(10px);
          overflow: hidden;
        }

        /* Key sizes */
        .key-standard { width: 48px; }
        .key-backspace { width: 84px; }
        .key-tab { width: 72px; }
        .key-capslock { width: 80px; }
        .key-enter { width: 88px; }
        .key-shift { width: 104px; }
        .key-space { width: 240px; }

        .key-text {
          position: relative;
          z-index: 2;
          pointer-events: none;
        }

        /* Hover effects */
        .key:hover {
          background: linear-gradient(to bottom, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.08));
          border-color: rgba(255, 255, 255, 0.25);
          transform: translateY(-1px);
        }

        /* Pressed state */
        .key-pressed {
          background: linear-gradient(to bottom, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.1)) !important;
          border-color: rgba(255, 255, 255, 0.3) !important;
          transform: translateY(1px) !important;
          transition: all 0.1s ease !important;
        }

        /* Correct key feedback */
        .key-correct {
          background: linear-gradient(to bottom, rgba(100, 255, 100, 0.2), rgba(100, 255, 100, 0.1)) !important;
          border-color: rgba(100, 255, 100, 0.4) !important;
          color: #7fff7f !important;
          box-shadow: 0 0 12px rgba(100, 255, 100, 0.3) !important;
        }

        /* Incorrect key feedback */
        .key-incorrect {
          background: linear-gradient(to bottom, rgba(255, 100, 100, 0.2), rgba(255, 100, 100, 0.1)) !important;
          border-color: rgba(255, 100, 100, 0.4) !important;
          color: #ff7f7f !important;
          box-shadow: 0 0 12px rgba(255, 100, 100, 0.3) !important;
        }

        /* Ripple effect */
        .key-ripple {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%) scale(0);
          animation: ripple-expand 0.6s ease-out forwards;
          pointer-events: none;
        }

        /* Effect mode specific styling */
        .effect-glow .key {
          box-shadow: 0 2px 8px rgba(100, 150, 255, 0.1);
        }

        .effect-glow .key:hover {
          box-shadow: 0 4px 16px rgba(100, 150, 255, 0.2);
        }

        .effect-wave .key {
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.1) 0%,
            rgba(100, 150, 255, 0.08) 50%,
            rgba(255, 255, 255, 0.04) 100%);
        }

        /* Animations */
        @keyframes ripple-expand {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
          }
        }

        @keyframes wave-shift {
          0%, 100% {
            background: linear-gradient(135deg, 
              rgba(255, 255, 255, 0.06) 0%,
              rgba(100, 150, 255, 0.04) 50%,
              rgba(255, 255, 255, 0.02) 100%);
          }
          50% {
            background: linear-gradient(135deg, 
              rgba(255, 255, 255, 0.02) 0%,
              rgba(150, 100, 255, 0.04) 50%,
              rgba(255, 255, 255, 0.06) 100%);
          }
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .keyboard {
            padding: 16px 12px 12px;
            border-radius: 12px;
          }
          
          .key {
            height: 44px;
            border-radius: 6px;
            font-size: 13px;
          }
          
          .key-standard { width: 44px; }
          .key-backspace { width: 76px; }
          .key-tab { width: 64px; }
          .key-capslock { width: 72px; }
          .key-enter { width: 80px; }
          .key-shift { width: 96px; }
          .key-space { width: 200px; }
          
          .keyboard-row {
            gap: 3px;
            margin-bottom: 6px;
          }
        }

        @media (max-width: 480px) {
          .key-standard { width: 36px; }
          .key-backspace { width: 64px; }
          .key-tab { width: 56px; }
          .key-capslock { width: 60px; }
          .key-enter { width: 68px; }
          .key-shift { width: 80px; }
          .key-space { width: 160px; }
          
          .key {
            height: 40px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default KeyboardVisualization;
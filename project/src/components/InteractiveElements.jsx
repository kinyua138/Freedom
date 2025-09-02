import React, { useState, useEffect, useRef } from 'react';
import { VolumeXIcon, Volume2Icon, PlayIcon, PauseIcon, SettingsIcon, ZapIcon } from 'lucide-react';

const InteractiveElements = ({ isOpen, onClose }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  
  // Audio context for sound effects
  const audioContextRef = useRef(null);
  const [audioContext, setAudioContext] = useState(null);

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== 'undefined' && window.AudioContext) {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = ctx;
      setAudioContext(ctx);
    }
  }, []);

  // Sound generation functions
  const playSound = (type, frequency = 440, duration = 100) => {
    if (!soundEnabled || !audioContext) return;

    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume * 0.1, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration / 1000);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  };

  // Haptic feedback
  const triggerHaptic = (intensity = 'medium') => {
    if (!hapticEnabled || !navigator.vibrate) return;
    
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [50],
      double: [20, 50, 20],
      success: [10, 30, 10, 30, 10],
      error: [100, 50, 100]
    };

    navigator.vibrate(patterns[intensity] || patterns.medium);
  };

  // Interactive button component
  const InteractiveButton = ({ 
    children, 
    variant = 'primary', 
    soundType = 'sine', 
    frequency = 440, 
    haptic = 'medium',
    animation = 'bounce',
    onClick,
    ...props 
  }) => {
    const [isPressed, setIsPressed] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleClick = (e) => {
      if (soundEnabled) {
        playSound(soundType, frequency, 150);
      }
      
      if (hapticEnabled) {
        triggerHaptic(haptic);
      }

      setIsPressed(true);
      setTimeout(() => setIsPressed(false), 150);

      if (onClick) onClick(e);
    };

    const baseClasses = `
      relative px-6 py-3 rounded-lg font-medium transition-all duration-200 
      transform-gpu select-none cursor-pointer
      ${animationsEnabled ? 'hover:scale-105 active:scale-95' : ''}
      ${isPressed && animationsEnabled ? 'animate-pulse' : ''}
    `;

    const variants = {
      primary: 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl',
      secondary: 'bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 shadow-md hover:shadow-lg',
      success: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl',
      danger: 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl',
      warning: 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl'
    };

    return (
      <button
        className={`${baseClasses} ${variants[variant]}`}
        onClick={handleClick}
        onMouseEnter={() => {
          setIsHovered(true);
          if (soundEnabled) playSound('sine', frequency * 1.2, 50);
        }}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        {children}
        
        {/* Ripple effect */}
        {isPressed && animationsEnabled && (
          <span className="absolute inset-0 rounded-lg bg-white/20 animate-ping" />
        )}
        
        {/* Glow effect */}
        {isHovered && animationsEnabled && (
          <span className="absolute inset-0 rounded-lg bg-white/10 animate-pulse" />
        )}
      </button>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <ZapIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Interactive Elements</h2>
              <p className="text-sm text-gray-600 dark:text-slate-400">Enhance UX with sounds and animations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <span className="text-2xl text-gray-500 dark:text-slate-400">×</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          {/* Settings */}
          <div className="mb-8 p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <SettingsIcon className="w-5 h-5 mr-2" />
              Interactive Settings
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="text-gray-700 dark:text-slate-300">Sound Effects</label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={animationsEnabled}
                  onChange={(e) => setAnimationsEnabled(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="text-gray-700 dark:text-slate-300">Animations</label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={hapticEnabled}
                  onChange={(e) => setHapticEnabled(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="text-gray-700 dark:text-slate-300">Haptic Feedback</label>
              </div>
            </div>

            {soundEnabled && (
              <div className="mt-4">
                <label className="block text-sm text-gray-600 dark:text-slate-400 mb-2">Volume: {Math.round(volume * 100)}%</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            )}
          </div>

          {/* Interactive Buttons */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Interactive Buttons</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InteractiveButton
                variant="primary"
                soundType="sine"
                frequency={440}
                haptic="medium"
                onClick={() => console.log('Primary clicked')}
              >
                Primary Action
              </InteractiveButton>

              <InteractiveButton
                variant="success"
                soundType="triangle"
                frequency={550}
                haptic="success"
                onClick={() => console.log('Success clicked')}
              >
                Success
              </InteractiveButton>

              <InteractiveButton
                variant="danger"
                soundType="sawtooth"
                frequency={330}
                haptic="error"
                onClick={() => console.log('Danger clicked')}
              >
                Danger
              </InteractiveButton>

              <InteractiveButton
                variant="warning"
                soundType="square"
                frequency={660}
                haptic="double"
                onClick={() => console.log('Warning clicked')}
              >
                Warning
              </InteractiveButton>

              <InteractiveButton
                variant="secondary"
                soundType="sine"
                frequency={220}
                haptic="light"
                onClick={() => console.log('Secondary clicked')}
              >
                Secondary
              </InteractiveButton>
            </div>
          </div>

          {/* Sound Test Panel */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sound Test Panel</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: 'Sine', type: 'sine', freq: 440 },
                { name: 'Square', type: 'square', freq: 440 },
                { name: 'Triangle', type: 'triangle', freq: 440 },
                { name: 'Sawtooth', type: 'sawtooth', freq: 440 },
                { name: 'High', type: 'sine', freq: 880 },
                { name: 'Low', type: 'sine', freq: 220 },
                { name: 'Chord', type: 'sine', freq: 550 },
                { name: 'Bass', type: 'triangle', freq: 110 }
              ].map((sound) => (
                <button
                  key={sound.name}
                  onClick={() => playSound(sound.type, sound.freq, 200)}
                  className="px-3 py-2 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 rounded-lg text-sm transition-colors"
                >
                  {sound.name}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Cards */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Interactive Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`
                    p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20
                    border border-gray-200 dark:border-slate-700 rounded-xl cursor-pointer
                    transition-all duration-300 group
                    ${animationsEnabled ? 'hover:scale-105 hover:shadow-xl active:scale-95' : 'hover:shadow-lg'}
                  `}
                  onClick={() => {
                    if (soundEnabled) playSound('sine', 440 + i * 110, 100);
                    if (hapticEnabled) triggerHaptic('light');
                  }}
                >
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Interactive Card {i}
                  </h4>
                  <p className="text-gray-600 dark:text-slate-400">
                    Click me for interactive feedback with sound and haptics!
                  </p>
                  
                  {/* Hover indicator */}
                  <div className={`
                    mt-4 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full
                    transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300
                  `} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveElements;

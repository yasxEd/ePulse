import { useState, useEffect, useCallback, KeyboardEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { TypingState, TypingResult, KeyInfo } from '@/types';
import { calculateWPM, calculateAccuracy } from '@/lib/utils';

export default function useTypingTest(initialText: string) {
  // State for the typing test
  const [state, setState] = useState<TypingState>({
    currentText: initialText,
    typedText: '',
    startTime: null,
    endTime: null,
    isActive: false,
    isComplete: false,
    errors: 0,
    keyStrokes: 0
  });

  // State for result
  const [result, setResult] = useState<TypingResult | null>(null);
  
  // State for keyboard keys
  const [pressedKeys, setPressedKeys] = useState<KeyInfo[]>([]);

  // Start the typing test
  const startTest = useCallback(() => {
    setState({
      currentText: initialText,
      typedText: '',
      startTime: Date.now(),
      endTime: null,
      isActive: true,
      isComplete: false,
      errors: 0,
      keyStrokes: 0
    });
    setResult(null);
  }, [initialText]);

  // Reset the typing test
  const resetTest = useCallback(() => {
    setState({
      currentText: initialText,
      typedText: '',
      startTime: null,
      endTime: null,
      isActive: false,
      isComplete: false,
      errors: 0,
      keyStrokes: 0
    });
    setResult(null);
  }, [initialText]);

  // Handle keyboard input
  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    if (!state.isActive || state.isComplete) return;

    // Update pressed keys for visualization
    setPressedKeys(prevKeys => {
      const keyIndex = prevKeys.findIndex(k => k.code === event.code);
      
      if (keyIndex >= 0) {
        // Key already in array, update its state
        const newKeys = [...prevKeys];
        newKeys[keyIndex] = { 
          ...newKeys[keyIndex], 
          isPressed: true 
        };
        return newKeys;
      } else {
        // Add new key
        return [...prevKeys, { 
          key: event.key, 
          code: event.code, 
          isPressed: true
        }];
      }
    });

    // Ignore modifier keys and special keys
    if (event.ctrlKey || event.altKey || event.metaKey) return;
    if (event.key === 'Shift' || event.key === 'Control' || event.key === 'Alt' || 
        event.key === 'Meta' || event.key === 'CapsLock' || event.key === 'Tab') return;

    // Handle backspace
    if (event.key === 'Backspace') {
      setState(prev => ({
        ...prev,
        typedText: prev.typedText.slice(0, -1),
        keyStrokes: prev.keyStrokes + 1
      }));
      return;
    }

    setState(prev => {
      // Check if the typed character matches the expected character
      const expectedChar = prev.currentText.charAt(prev.typedText.length);
      const isCorrect = event.key === expectedChar;
      
      // Update pressed key status with correctness
      setPressedKeys(prevKeys => {
        const keyIndex = prevKeys.findIndex(k => k.code === event.code);
        if (keyIndex >= 0) {
          const newKeys = [...prevKeys];
          newKeys[keyIndex] = { 
            ...newKeys[keyIndex], 
            isPressed: true,
            isCorrect: isCorrect,
            isIncorrect: !isCorrect
          };
          return newKeys;
        }
        return prevKeys;
      });

      // Update typing state
      const newTypedText = prev.typedText + event.key;
      const newErrors = prev.errors + (isCorrect ? 0 : 1);
      const isComplete = newTypedText.length >= prev.currentText.length;
      
      // If test is complete, calculate results
      if (isComplete) {
        const endTime = Date.now();
        const duration = (endTime - (prev.startTime || endTime)) / 1000; // in seconds
        
        // Create result
        const testResult: TypingResult = {
          id: uuidv4(),
          wpm: calculateWPM(prev.currentText.length, duration),
          accuracy: calculateAccuracy(newErrors, newTypedText.length),
          timestamp: endTime,
          textLength: prev.currentText.length,
          duration: duration
        };
        
        // Set result
        setResult(testResult);
        
        // Save result to local storage
        const savedResults = localStorage.getItem('typingResults');
        const results = savedResults ? JSON.parse(savedResults) : [];
        localStorage.setItem('typingResults', JSON.stringify([...results, testResult]));
        
        // Attempt to save to API
        fetch('/api/results', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(testResult)
        }).catch(err => {
          console.error('Failed to save result to API:', err);
          // Continue silently as this is optional
        });
      }
      
      return {
        ...prev,
        typedText: newTypedText,
        errors: newErrors,
        isComplete: isComplete,
        endTime: isComplete ? Date.now() : prev.endTime,
        isActive: !isComplete,
        keyStrokes: prev.keyStrokes + 1
      };
    });
  }, [state.isActive, state.isComplete]);

  // Handle key up events for keyboard visualization
  const handleKeyUp = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    setPressedKeys(prevKeys => {
      const keyIndex = prevKeys.findIndex(k => k.code === event.code);
      if (keyIndex >= 0) {
        const newKeys = [...prevKeys];
        newKeys[keyIndex] = { 
          ...newKeys[keyIndex], 
          isPressed: false 
        };
        return newKeys.filter(k => k.isPressed || (Date.now() - (k.lastPressTime || 0) < 500));
      }
      return prevKeys;
    });
  }, []);

  // Global keyboard event listeners
  useEffect(() => {
    const keyDownHandler = (e: globalThis.KeyboardEvent) => {
      if (!state.isActive) return;
      
      setPressedKeys(prevKeys => {
        const keyIndex = prevKeys.findIndex(k => k.code === e.code);
        
        if (keyIndex >= 0) {
          const newKeys = [...prevKeys];
          newKeys[keyIndex] = { 
            ...newKeys[keyIndex], 
            isPressed: true,
            lastPressTime: Date.now()
          };
          return newKeys;
        } else {
          return [...prevKeys, { 
            key: e.key, 
            code: e.code, 
            isPressed: true,
            lastPressTime: Date.now()
          }];
        }
      });
    };

    const keyUpHandler = (e: globalThis.KeyboardEvent) => {
      setPressedKeys(prevKeys => {
        const keyIndex = prevKeys.findIndex(k => k.code === e.code);
        if (keyIndex >= 0) {
          const newKeys = [...prevKeys];
          newKeys[keyIndex] = { 
            ...newKeys[keyIndex], 
            isPressed: false 
          };
          return newKeys;
        }
        return prevKeys;
      });
    };

    window.addEventListener('keydown', keyDownHandler);
    window.addEventListener('keyup', keyUpHandler);

    return () => {
      window.removeEventListener('keydown', keyDownHandler);
      window.removeEventListener('keyup', keyUpHandler);
    };
  }, [state.isActive]);

  // Clean up pressed keys periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setPressedKeys(prevKeys => prevKeys.filter(k => 
        k.isPressed || (Date.now() - (k.lastPressTime || 0) < 500)
      ));
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Calculate current metrics
  const currentWPM = useCallback(() => {
    if (!state.startTime || state.typedText.length === 0) return 0;
    
    const timeElapsed = ((state.endTime || Date.now()) - state.startTime) / 1000; // in seconds
    return calculateWPM(state.typedText.length, timeElapsed);
  }, [state]);

  const currentAccuracy = useCallback(() => {
    if (state.typedText.length === 0) return 100;
    return calculateAccuracy(state.errors, state.typedText.length);
  }, [state]);

  return {
    state,
    result,
    pressedKeys,
    startTest,
    resetTest,
    handleKeyDown,
    handleKeyUp,
    currentWPM: currentWPM(),
    currentAccuracy: currentAccuracy()
  };
}
// Typing test result interface
export interface TypingResult {
    id: string;
    wpm: number;
    accuracy: number;
    timestamp: number;
    textLength: number;
    duration: number;
  }
  
  // Typing test current state interface
  export interface TypingState {
    currentText: string;
    typedText: string;
    startTime: number | null;
    endTime: number | null;
    isActive: boolean;
    isComplete: boolean;
    errors: number;
    keyStrokes: number;
  }
  
  // Keyboard key interface
  export interface KeyInfo {
    key: string;
    code: string;
    isPressed: boolean;
    isCorrect?: boolean;
    isIncorrect?: boolean;
  }
  
  // Layout of keyboard
  export interface KeyboardLayout {
    [row: string]: string[];
  }
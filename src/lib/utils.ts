// Calculate Words Per Minute
export const calculateWPM = (textLength: number, timeInSeconds: number): number => {
    // Standard word length is 5 characters
    const words = textLength / 5;
    const minutes = timeInSeconds / 60;
    return Math.round(words / minutes);
  };
  
  // Calculate accuracy percentage
  export const calculateAccuracy = (errors: number, totalKeystrokes: number): number => {
    if (totalKeystrokes === 0) return 100;
    const correctKeystrokes = totalKeystrokes - errors;
    return Math.round((correctKeystrokes / totalKeystrokes) * 100);
  };
  
  // Get random text from a list of texts
  export const getRandomText = (texts: string[]): string => {
    const randomIndex = Math.floor(Math.random() * texts.length);
    return texts[randomIndex];
  };
  
  // Keyboard layout configuration
  export const keyboardLayout = {
    row1: ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', '←'],
    row2: ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
    row3: ['CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'Enter'],
    row4: ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
    row5: ['CTRL', 'Meta', 'Alt', 'Space', 'Alt', 'Meta', 'CTRL']
  };
  
  // Map key codes to display names
  export const keyCodeToDisplayName: { [key: string]: string } = {
    'Backquote': '`',
    'Digit1': '1',
    'Digit2': '2',
    'Digit3': '3',
    'Digit4': '4',
    'Digit5': '5',
    'Digit6': '6',
    'Digit7': '7',
    'Digit8': '8',
    'Digit9': '9',
    'Digit0': '0',
    'Minus': '-',
    'Equal': '=',
    'Backspace': '⌫',
    'Tab': '⇥',
    'KeyQ': 'Q',
    'KeyW': 'W',
    'KeyE': 'E',
    'KeyR': 'R',
    'KeyT': 'T',
    'KeyY': 'Y',
    'KeyU': 'U',
    'KeyI': 'I',
    'KeyO': 'O',
    'KeyP': 'P',
    'BracketLeft': '[',
    'BracketRight': ']',
    'Backslash': '\\',
    'CapsLock': 'Caps',
    'KeyA': 'A',
    'KeyS': 'S',
    'KeyD': 'D',
    'KeyF': 'F',
    'KeyG': 'G',
    'KeyH': 'H',
    'KeyJ': 'J',
    'KeyK': 'K',
    'KeyL': 'L',
    'Semicolon': ';',
    'Quote': '\'',
    'Enter': '↵',
    'ShiftLeft': 'Shift',
    'KeyZ': 'Z',
    'KeyX': 'X',
    'KeyC': 'C',
    'KeyV': 'V',
    'KeyB': 'B',
    'KeyN': 'N',
    'KeyM': 'M',
    'Comma': ',',
    'Period': '.',
    'Slash': '/',
    'ShiftRight': 'Shift',
    'ControlLeft': 'Ctrl',
    'MetaLeft': 'Win',
    'AltLeft': 'Alt',
    'Space': 'Space',
    'AltRight': 'Alt',
    'MetaRight': 'Win',
    'ControlRight': 'Ctrl'
  };
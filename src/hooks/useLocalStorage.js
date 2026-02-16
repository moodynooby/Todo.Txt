import { useState, useCallback } from 'react';

/**
 * Simple custom hook for persisting state to localStorage
 * @param {string} key - localStorage key
 * @param {*} initialValue - Initial value
 * @returns {[*, (value) => void]} - [storedValue, setValue]
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      return localStorage.getItem(key) || initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, valueToStore);
  }, [key, storedValue]);

  return [storedValue, setValue];
}

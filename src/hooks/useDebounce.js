/**
 * hooks/useDebounce.js
 * Best Practice: Debounces a value to avoid firing API calls on every keystroke.
 * Usage: const debouncedSearch = useDebounce(searchTerm, 400);
 */

import { useState, useEffect } from "react";

const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer); // Cleanup on each change
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;

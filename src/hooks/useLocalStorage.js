import { useState, useEffect } from 'react';

/** Custom hook to store a state value in local storage */
function useLocalStorage(key, value) {

  const initialValue = JSON.parse(localStorage.getItem(key)) || value;
  const [data, setData] = useState(initialValue);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(data));
  }, [data])

  return [data, setData];
}

export default useLocalStorage;
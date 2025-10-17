import { useEffect, useState } from "react";

export const useCountDown = () => {
  const [count, setCount] = useState(60);
  useEffect(() => {
    if (count === 0) return;
    const timer = setTimeout(() => {
      setCount((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearTimeout(timer);
  }, [count]);

  const formatTime = () => `00:${count.toString().padStart(2, "0")}`;
  return { count, setCount, formatTime };
};

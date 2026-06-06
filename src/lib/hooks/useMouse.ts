import { useState, useEffect } from "react";

export function useMouse() {
  const [mouse, setMouse] = useState({ x: 0, y: 0, pxX: 0, pxY: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
        pxX: e.clientX,
        pxY: e.clientY,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return mouse;
}
export default useMouse;

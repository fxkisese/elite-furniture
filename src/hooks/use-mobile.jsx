import { useEffect, useState } from 'react';

export default function useMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= breakpoint);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth <= breakpoint);
    window.addEventListener('resize', update);
    update();

    return () => window.removeEventListener('resize', update);
  }, [breakpoint]);

  return isMobile;
}

/* React */
import { useEffect } from 'react';
/* Router */
import { useLocation } from 'react-router-dom';

/* //////////////////////////////////////////////////////////////// */
export default function ScrollToTop() {
  const pathname = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  /* JSX ---------------------------------------------------------- */
  return null;
}

import { useEffect } from 'react';
import Nav from '../components/Nav.jsx';
import Hero from '../components/Hero.jsx';
import Experience from '../components/Experience.jsx';
import Projects from '../components/Projects.jsx';
import Terminal from '../components/Terminal.jsx';
import Contact from '../components/Contact.jsx';
import styles from './Portfolio.module.css';

export default function Portfolio() {
  // scroll progress bar
  useEffect(() => {
    const bar = document.getElementById('progress');
    const onScroll = () => {
      const p = document.documentElement;
      const pct = p.scrollTop / (p.scrollHeight - p.clientHeight) * 100;
      if (bar) bar.style.width = pct + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // scroll reveal
  useEffect(() => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.section-reveal').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div id="progress" className={styles.progress} />
      <Nav />
      <Hero />
      <Experience />
      <Projects />
      <Terminal />
      <Contact />
      <footer className={styles.footer}>
        <span className={styles.footL}>© 2026 Harry Wang · Waterloo, ON</span>
        <span className={styles.footR}>Built with React & Vite.</span>
      </footer>
    </>
  );
}

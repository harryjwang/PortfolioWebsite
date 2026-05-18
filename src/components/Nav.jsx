import styles from './Nav.module.css';

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <a href="/" className={styles.logo}>
        Harry <em>Wang</em>
        <div className={styles.dot} />
      </a>
      <ul className={styles.links}>
        <li><a href="#experience">Experience</a></li>
        <li><a href="#projects">Projects</a></li>
        <li><a href="#terminal">Terminal</a></li>
        <li><a href="#contact">Contact</a></li>
        <li><a href="/room" className={styles.cta}>Room ↗</a></li>
        <li><a href="/PortfolioWebsite/room" className={styles.cta}>Room ↗</a></li>
      </ul>
    </nav>
  );
}

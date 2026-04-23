import { PROJECTS } from '../data/index.js';
import styles from './Projects.module.css';

export default function Projects() {
  return (
    <section className={`${styles.section} section-reveal`} id="projects">
      <div className={styles.head}>
        <span className={styles.num}>03</span>
        <h2 className={styles.title}>Starred<br /><em>Projects.</em></h2>
      </div>
      <div className={styles.grid}>
        {PROJECTS.map((p, i) => (
          <a
            key={i}
            href={p.link}
            target="_blank"
            rel="noreferrer"
            className={`${styles.card} ${p.wide ? styles.wide : ''}`}
          >
            <div className={styles.cardNum}>0{i + 1}</div>
            <div className={styles.cardName}>{p.name}</div>
            <p className={styles.cardDesc}>{p.desc}</p>
            <div className={styles.chips}>
              {p.chips.map(c => <span className={styles.chip} key={c}>{c}</span>)}
            </div>
            <div className={styles.lang}>Lang: <span>{p.lang}</span></div>
            <div className={styles.link}>View on GitHub <span>→</span></div>
          </a>
        ))}
      </div>
    </section>
  );
}

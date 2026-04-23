import { EXP } from '../data/index.js';
import styles from './Experience.module.css';

export default function Experience() {
  return (
    <section className={`${styles.section} section-reveal`} id="experience">
      <div className={styles.head}>
        <span className={styles.num}>02</span>
        <h2 className={styles.title}>Work &amp;<br /><em>Experience.</em></h2>
      </div>
      <div className={styles.list}>
        {EXP.map((e, i) => (
          <a href={e.link} target="_blank" rel="noreferrer" className={styles.row} key={i}>
            <div className={styles.meta}>
              <div className={styles.period}>{e.period}</div>
              <div className={styles.org}>{e.org}</div>
              <div className={styles.type}>{e.type}</div>
            </div>
            <div className={styles.content}>
              <div className={styles.role}>{e.role}</div>
              <p className={styles.desc}>{e.desc}</p>
              <div className={styles.chips}>
                {e.chips.map(c => <span className={styles.chip} key={c}>{c}</span>)}
              </div>
            </div>
            <span className={styles.arrow}>→</span>
          </a>
        ))}
      </div>
    </section>
  );
}

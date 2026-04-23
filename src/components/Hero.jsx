import { SKILLS } from '../data/index.js';
import styles from './Hero.module.css';

const STATS = [
  { num: '4A',   label: 'CompEng · UWaterloo' },
  { num: '5',    label: 'Co-ops Completed' },
  { num: '2',    label: 'Design Teams' },
  { num: 'VB·TN', label: 'Volleyball & Tennis' },
];

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.left}>
        <div className={styles.eyebrow}>5 Co-ops complete · Open to new roles</div>
        <h1 className={styles.name}>Harry<br /><em>Wang.</em></h1>
        <p className={styles.bio}>
          <strong>4A Computer Engineering</strong> at the University of Waterloo.
          I build at every layer — from ARM assembly and embedded RTOS kernels
          to ML systems, automation platforms, and interactive experiences.
          Electrical &amp; Embedded Lead on <strong>UW Baja SAE</strong>.
          Control group on the <strong>UW ASIC Design Team</strong>.
        </p>
        <div className={styles.actions}>
          <a href="#experience" className={styles.btnRed}>View Work</a>
          <a href="https://github.com/harryjwang" target="_blank" rel="noreferrer" className={styles.btnOutline}>GitHub ↗</a>
          <a href="https://www.linkedin.com/in/harry-j-wang/" target="_blank" rel="noreferrer" className={styles.btnOutline}>LinkedIn ↗</a>
        </div>
        <div className={styles.ghostNum}>01</div>
      </div>

      <div className={styles.right}>
        <div className={styles.statGrid}>
          {STATS.map(s => (
            <div className={styles.stat} key={s.label}>
              <div className={styles.statNum}>{s.num}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
        <div className={styles.skillsWrap}>
          {SKILLS.map(s => <span className={styles.skillTag} key={s}>{s}</span>)}
        </div>
      </div>
    </section>
  );
}

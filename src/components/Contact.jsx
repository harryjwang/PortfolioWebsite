import styles from './Contact.module.css';

const LINKS = [
  { icon: 'GitHub',   text: 'github.com/harryjwang',    href: 'https://github.com/harryjwang' },
  { icon: 'LinkedIn', text: 'harry-j-wang',              href: 'https://www.linkedin.com/in/harry-j-wang/' },
  { icon: 'Email',    text: 'harryjwang04@gmail.com',   href: 'mailto:harryjwang04@gmail.com' },
  { icon: 'Website',  text: 'harryjwang.com',            href: 'https://harryjwang.com' },
];

export default function Contact() {
  return (
    <section className={`${styles.wrap} section-reveal`} id="contact">
      <div className={styles.left}>
        <h2 className={styles.title}>Let's build<br /><em>something.</em></h2>
        <p className={styles.sub}>
          Open to co-op roles, interesting projects, and conversations
          about engineering at any layer of the stack. Reach out any time.
        </p>
      </div>
      <div className={styles.right}>
        {LINKS.map(l => (
          <a key={l.icon} href={l.href} target="_blank" rel="noreferrer" className={styles.link}>
            <span className={styles.icon}>{l.icon}</span>
            <span className={styles.text}>{l.text}</span>
            <span className={styles.arrow}>↗</span>
          </a>
        ))}
      </div>
    </section>
  );
}

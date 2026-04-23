import { useState, useRef, useEffect } from 'react';
import { TERMINAL_COMMANDS } from '../data/index.js';
import styles from './Terminal.module.css';

const INIT = [
  { t: 'comment', s: '# Harry Wang — Interactive Terminal v1.0' },
  { t: 'comment', s: '# Type "help" to see available commands' },
  { t: 'spacer' },
];

export default function Terminal() {
  const [lines, setLines] = useState(INIT);
  const [inp, setInp] = useState('');
  const [hist, setHist] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  function run(cmd) {
    const c = cmd.trim().toLowerCase();
    const next = [...lines, { t: 'cmd', s: cmd }];
    if (c === 'clear') { setLines(INIT); return; }
    const fn = TERMINAL_COMMANDS[c];
    if (fn) {
      setLines([...next, ...fn(), { t: 'spacer' }]);
    } else if (c === '') {
      setLines(next);
    } else {
      setLines([...next, { t: 'out', s: `command not found: <strong>${cmd}</strong>. Try <strong>help</strong>.` }, { t: 'spacer' }]);
    }
  }

  function onKey(e) {
    if (e.key === 'Enter') {
      setHist(h => [inp, ...h]);
      setHistIdx(-1);
      run(inp);
      setInp('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const ni = Math.min(histIdx + 1, hist.length - 1);
      setHistIdx(ni);
      if (hist[ni]) setInp(hist[ni]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const ni = Math.max(histIdx - 1, -1);
      setHistIdx(ni);
      setInp(ni === -1 ? '' : hist[ni]);
    }
  }

  return (
    <div className={`${styles.section} section-reveal`} id="terminal">
      <div className={styles.heading}>
        Ask me anything — <span>interactively.</span>
      </div>
      <div className={styles.window} onClick={() => inputRef.current?.focus()}>
        <div className={styles.titlebar}>
          <div className={styles.dot} style={{ background: '#ff5f57' }} />
          <div className={styles.dot} style={{ background: '#ffbd2e' }} />
          <div className={styles.dot} style={{ background: '#28c840' }} />
          <span className={styles.titlebarText}>harry@portfolio:~</span>
        </div>
        <div className={styles.body}>
          {lines.map((l, i) => {
            if (l.t === 'spacer') return <div key={i} style={{ height: 6 }} />;
            if (l.t === 'comment') return (
              <div key={i} className={styles.line}>
                <span className={styles.comment}>{l.s}</span>
              </div>
            );
            if (l.t === 'cmd') return (
              <div key={i} className={styles.line}>
                <span className={styles.prompt}>harry@portfolio:~$</span>
                <span className={styles.cmd}> {l.s}</span>
              </div>
            );
            return <div key={i} className={styles.out} dangerouslySetInnerHTML={{ __html: l.s }} />;
          })}
          <div className={styles.inputRow}>
            <span className={styles.prompt}>harry@portfolio:~$</span>
            <input
              ref={inputRef}
              className={styles.input}
              value={inp}
              onChange={e => setInp(e.target.value)}
              onKeyDown={onKey}
              autoComplete="off"
              spellCheck={false}
            />
            <span className={styles.cursor} />
          </div>
          <div ref={endRef} />
        </div>
      </div>
      <div className={styles.hint}>
        ↑↓ command history &nbsp;·&nbsp; try: about, coops, hardware, software, teams, hobbies
      </div>
    </div>
  );
}

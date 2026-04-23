import { useEffect, useRef, useState } from 'react';
import { buildScene } from '../room/scene.js';
import styles from './Room.module.css';

const ZONES = [
  { id:'desk',     tag:'Work / Internships', name:'The Desk',     desc:'Where the 9-to-5 happens. Co-ops, internships, industry engineering.',       cam:{x:-4,y:2.6,z:5.2} },
  { id:'shelf',    tag:'Design Teams',       name:'The Shelf',    desc:'UW design teams. Hardware, embedded systems, and competition engineering.',   cam:{x:4.5,y:2.4,z:4.8} },
  { id:'projects', tag:'Starred Projects',   name:'The Pinboard', desc:'The things I\'m most proud of building — hardware, software, and AI.',       cam:{x:0,y:3,z:6} },
  { id:'sports',   tag:'Sports',             name:'The Court',    desc:'Volleyball and tennis. Competitive, team-oriented, always improving.',        cam:{x:5.5,y:2.2,z:-0.5} },
  { id:'corner',   tag:'About Me',           name:'The Corner',   desc:'A quiet spot. Who I am beyond the résumé.',                                   cam:{x:-5.5,y:2.2,z:-0.5} },
];

export default function Room() {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const [intro, setIntro] = useState(true);
  const [activeZone, setActiveZone] = useState(-1);
  const [modal, setModal] = useState(null);
  const [isCursorHover, setIsCursorHover] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;
    const s = buildScene(
      canvasRef.current,
      (data) => setModal(data),
      (type, val) => { if (type === 'hover') setIsCursorHover(val); }
    );
    sceneRef.current = s;
    return () => s.destroy();
  }, []);

  function goZone(i) {
    setActiveZone(i);
    sceneRef.current?.goZone(i, ZONES);
  }

  function enter() {
    setIntro(false);
    setTimeout(() => goZone(0), 400);
  }

  return (
    <div className={styles.root} style={{ cursor: isCursorHover ? 'pointer' : 'none' }}>
      <canvas ref={canvasRef} className={styles.canvas} />

      {/* intro */}
      {intro && (
        <div className={styles.intro}>
          <h1 className={styles.introName}>Harry <em>Wang</em></h1>
          <p className={styles.introSub}>4A Computer Engineering · University of Waterloo</p>
          <button className={styles.introBtn} onClick={enter}>Enter the Room →</button>
        </div>
      )}

      {/* HUD */}
      {!intro && (
        <>
          <div className={styles.hud}>
            <div>
              <div className={styles.hudName}>Harry <em>Wang</em></div>
              <div className={styles.hudSub}>4A CompEng · UWaterloo</div>
            </div>
          </div>

          <a href="/" className={styles.backLink}>← Portfolio</a>

          {/* Zone info */}
          {activeZone >= 0 && (
            <div className={styles.zoneDisplay}>
              <div className={styles.zoneTag}>{ZONES[activeZone].tag}</div>
              <div className={styles.zoneName}>{ZONES[activeZone].name}</div>
              <div className={styles.zoneDesc}>{ZONES[activeZone].desc}</div>
            </div>
          )}

          {/* Nav dots */}
          <div className={styles.navDots}>
            {ZONES.map((z, i) => (
              <div
                key={z.id}
                className={`${styles.dot} ${activeZone === i ? styles.dotActive : ''}`}
                onClick={() => goZone(i)}
              >
                <span className={styles.dotLabel}>{z.tag}</span>
                <div className={styles.dotPip} />
              </div>
            ))}
          </div>

          {/* Hint */}
          <div className={styles.hint}>drag to orbit · click objects to explore</div>
        </>
      )}

      {/* Modal */}
      {modal && (
        <div className={styles.modalOverlay} onClick={() => setModal(null)}>
          <div className={styles.modalCard} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setModal(null)}>×</button>
            <div className={styles.modalEy}>{modal.ey}</div>
            <div className={styles.modalTitle}>{modal.title}</div>
            <div className={styles.modalBody}>{modal.body}</div>
            <div className={styles.modalChips}>
              {modal.chips?.map(c => <span key={c} className={styles.chip}>{c}</span>)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

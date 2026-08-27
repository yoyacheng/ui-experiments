import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import './styles.css';

type Bill = { name: string; date: string; amount: string; category: string; color: string; icon: string };
const assetPath = `${import.meta.env.BASE_URL}assets/`;

const bills: Record<number, Bill> = {
  10: { name: 'Electricity Bill', date: 'Mar 10', amount: '$29.99', category: 'Utilities', color: '#62d38e', icon: `${assetPath}bolt.svg` },
  11: { name: 'Gas Bill', date: 'Mar 11', amount: '$10', category: 'Utilities', color: '#f0b026', icon: `${assetPath}gas.svg` },
  15: { name: 'Credit Card Bill', date: 'Mar 15', amount: '$230', category: 'Credit Card', color: '#5e8eef', icon: `${assetPath}card.svg` }
};

const days = [
  { weekday: 'M', date: 9 }, { weekday: 'T', date: 10 }, { weekday: 'W', date: 11 },
  { weekday: 'T', date: 12 }, { weekday: 'F', date: 13 }, { weekday: 'S', date: 14 }, { weekday: 'S', date: 15 }
];

function BillItem({ bill }: { bill: Bill }) {
  return <motion.article role="status" aria-label={`${bill.name}, due ${bill.date}, ${bill.amount}, ${bill.category}`}
    className="bill-item"
    initial={{ y: -108 }}
    animate={{ y: 0 }}
    exit={{
      y: -108,
      transition: { duration: 0.23, ease: [0.23, 1, 0.32, 1] },
    }}
    transition={{
      duration: 0.35,
      ease: [0.08, 0.82, 0.21, 1.11],
    }}
  >
    <div className="bill-icon" style={{ background: bill.color }}><img src={bill.icon} alt="" /></div>
    <div className="bill-details"><strong>{bill.name}</strong><span>{bill.date}</span></div>
    <div className="bill-amount"><strong>{bill.amount}</strong><span>{bill.category}</span></div>
  </motion.article>;
}

function DayPill({ weekday, date, selected, onSelect }: { weekday: string; date: number; selected: boolean; onSelect: () => void }) {
  const bill = bills[date];
  return <button className={`day ${selected ? 'selected' : ''}`} onClick={onSelect} aria-pressed={selected} aria-label={`${weekday}, March ${date}${bill ? `, ${bill.name}` : ''}`}>
    <span className="weekday">{weekday}</span>
    <motion.span
      className="pill"
      initial={false}
      animate={{ scale: selected ? [0.94, 1.035, 1] : 1 }}
      transition={selected ? { duration: 0.34, times: [0, 0.62, 1], ease: ['easeOut', 'easeOut'] } : { duration: 0.18, ease: 'easeOut' }}
    >
      <motion.span className="pill-fill" initial={false} animate={{ scaleY: selected ? 1 : 0 }} transition={{ type: 'spring', stiffness: 480, damping: 32, mass: .65 }} />
      <motion.span className="date" animate={{ color: selected ? '#fff' : '#111112' }} transition={{ duration: .16, delay: selected ? .08 : 0 }}>{date}</motion.span>
      {bill ? <span className={`status status-${date}`} style={{ background: bill.color }}><img src={bill.icon} alt="" /></span> : <span className="empty" aria-hidden="true" />}
    </motion.span>
  </button>;
}

function BillsDemo() {
  const [selected, setSelected] = useState(9);
  const [tab, setTab] = useState<'upcoming'|'all'>('upcoming');
  const [sortOpen, setSortOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const selectedBill = bills[selected];
  const embedded = new URLSearchParams(window.location.search).has('embed');
  return <main className={`stage ${dark ? 'dark' : ''} ${embedded ? 'embedded' : ''}`}>
    <motion.section
      className="prototype"
      aria-label="Bills date picker prototype"
      initial={false}
      animate={{ y: selectedBill ? [54, -5, 0] : 54 }}
      transition={{
        duration: selectedBill ? 0.35 : 0.27,
        times: selectedBill ? [0, 0.72, 1] : undefined,
        ease: selectedBill ? [0.08, 0.82, 0.21, 1.11] : [0.23, 1, 0.32, 1],
      }}
    >
      <div className="widget">
        <header><h1>Bills</h1><div className="actions"><button className="theme-toggle" aria-label={dark ? 'Use light theme' : 'Use dark theme'} aria-pressed={dark} onClick={() => setDark(v => !v)}><span className="material-symbols-outlined" aria-hidden="true">{dark ? 'wb_sunny' : 'bedtime'}</span></button></div></header>
        <div className="controls">
          <div className="tabs" role="group" aria-label="Bill views"><button aria-pressed={tab === 'upcoming'} className={tab === 'upcoming' ? 'active' : ''} onClick={() => setTab('upcoming')}>Upcoming Bills</button><button aria-pressed={tab === 'all'} className={tab === 'all' ? 'active' : ''} onClick={() => setTab('all')}>All Bills</button></div>
          <div className="sort-wrap"><button className="sort" onClick={() => setSortOpen(v => !v)} aria-expanded={sortOpen} aria-controls="sort-options">Sort <img src={`${assetPath}chevron.svg`} alt="" /></button><AnimatePresence>{sortOpen && <motion.div id="sort-options" className="menu" role="region" aria-label="Sort options" initial={{ opacity:0, y:-5, scale:.96 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:-5, scale:.96 }}>Due date</motion.div>}</AnimatePresence></div>
        </div>
        <p className="summary">You have <strong>3 bills</strong> due within the next 7 days</p>
        <div className="calendar">{days.map(d => <DayPill key={d.date} {...d} selected={selected === d.date} onSelect={() => setSelected(d.date)} />)}</div>
      </div>
      <AnimatePresence mode="wait">{selectedBill && <BillItem key={selected} bill={selectedBill} />}</AnimatePresence>
    </motion.section>
  </main>;
}

const projects = [
  {
    id: '001',
    slug: 'bills-date-picker',
    title: 'Bills Date Picker',
    category: 'Interaction',
    type: 'Motion',
    year: '2026',
  },
];

function BillsThumbnail() {
  return <div className="gallery-bills-preview" aria-hidden="true">
    <div className="preview-widget">
      <div className="preview-head"><strong>Bills</strong><span /></div>
      <div className="preview-tabs"><i /><i /></div>
      <div className="preview-copy" />
      <div className="preview-calendar">
        {[0, 1, 2, 3, 4, 5, 6].map((item) => <span key={item} className={item === 1 ? 'has-bill' : item === 4 ? 'is-active' : ''}><i /></span>)}
      </div>
    </div>
  </div>;
}

function Gallery() {
  const demoHref = `${import.meta.env.BASE_URL}demos/bills-date-picker/`;
  const dialogHref = `${import.meta.env.BASE_URL}experiments/bills-date-picker/`;
  const [openProject, setOpenProject] = useState(() => window.location.pathname.includes('/experiments/bills-date-picker'));
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const cardLinkRef = useRef<HTMLAnchorElement>(null);

  const openDialog = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.history.pushState({ project: 'bills-date-picker' }, '', dialogHref);
    setOpenProject(true);
  };

  const closeDialog = () => {
    window.history.pushState({}, '', import.meta.env.BASE_URL);
    setOpenProject(false);
    window.setTimeout(() => cardLinkRef.current?.focus(), 0);
  };

  useEffect(() => {
    const onPopState = () => setOpenProject(window.location.pathname.includes('/experiments/bills-date-picker'));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    document.body.style.overflow = openProject ? 'hidden' : '';
    if (openProject) closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape' && openProject) closeDialog(); };
    window.addEventListener('keydown', onKeyDown);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKeyDown); };
  }, [openProject]);

  return <main className="gallery-page">
    <header className="gallery-header">
      <a className="gallery-logo" href={import.meta.env.BASE_URL}>UI Experiments</a>
      <nav aria-label="Primary"><a href="#work">Work</a></nav>
    </header>

    <section className="gallery-work" id="work" aria-label="Experiments">
      <div className="project-grid">
        {projects.map(project => <article className="project-card" key={project.slug}>
          <a ref={cardLinkRef} className="project-preview" href={dialogHref} onClick={openDialog} aria-label={`Open ${project.title} preview`}><BillsThumbnail /><span className="open-mark" aria-hidden="true">↗</span></a>
          <div className="project-meta">
            <div><h3><a href={demoHref}>{project.title}</a><span>#{project.id}</span></h3></div>
            <p className="project-type">{project.category} · {project.type} · {project.year}</p>
          </div>
        </article>)}
      </div>
    </section>

    <footer className="gallery-footer"><span>UI Experiments</span><span>Built with care · 2026</span></footer>

    <AnimatePresence>
      {openProject && <motion.div className="dialog-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .2 }} onMouseDown={(event) => { if (event.target === event.currentTarget) closeDialog(); }}>
        <motion.section className="experiment-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title" initial={{ opacity: 0, y: 18, scale: .99 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: .995 }} transition={{ duration: .32, ease: [0.23, 1, 0.32, 1] }}>
          <div className="dialog-stage"><iframe src={`${demoHref}?embed=1`} title="Bills Date Picker interactive demo" /></div>
          <aside className="dialog-info">
            <div className="dialog-actions"><button ref={closeButtonRef} className="dialog-icon-button" onClick={closeDialog} aria-label="Close preview">×</button><div><button className="dialog-icon-button" disabled aria-label="Previous experiment">←</button><button className="dialog-icon-button" disabled aria-label="Next experiment">→</button></div></div>
            <div className="dialog-copy"><div className="dialog-kicker"><span className="dialog-tag">Motion</span><span className="dialog-number">#001</span></div><h2 id="dialog-title">Bills Date Picker</h2><p>An interactive weekly bill picker with tactile transitions, bill states, and accessible light and dark themes.</p></div>
            <a className="view-demo-button" href={demoHref}>Open full demo <span aria-hidden="true">↗</span></a>
          </aside>
        </motion.section>
      </motion.div>}
    </AnimatePresence>
  </main>;
}

function Root() {
  const isDemo = window.location.pathname.includes('/demos/bills-date-picker');
  return isDemo ? <BillsDemo /> : <Gallery />;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><MotionConfig reducedMotion="user"><Root /></MotionConfig></React.StrictMode>);

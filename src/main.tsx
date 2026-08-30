import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import './styles.css';

type Bill = { name: string; date: string; amount: string; category: string; color: string; icon: string };
const assetPath = `${import.meta.env.BASE_URL}assets/`;

type FolderTheme = 'gray' | 'blue' | 'yellow';
const folderOptions: Record<FolderTheme, { name: string; size: string }> = {
  gray: { name: 'Images', size: '310 GB' },
  blue: { name: 'Documents', size: '24 GB' },
  yellow: { name: 'Videos', size: '24 GB' },
};

const folderRearGradients: Record<FolderTheme, {
  closed: Array<[number, string]>;
  open: Array<[number, string]>;
}> = {
  gray: {
    closed: [[0, '#818799'], [.25, '#6C7180'], [.5, '#565A66'], [.75, '#41444D'], [1, '#2B2D33']],
    open: [[0, '#818799'], [.25, '#6C7180'], [.5, '#565A66'], [.75, '#41444D'], [1, '#2B2D33']],
  },
  blue: {
    closed: [[0, '#C9D6F3'], [.25, '#9EB4E5'], [.5, '#7392D7'], [.75, '#4970C9'], [.875, '#345FC2'], [1, '#1E4EBB']],
    open: [[0, '#8AADFF'], [.5, '#6E93E9'], [1, '#5379D2']],
  },
  yellow: {
    closed: [[0, '#F9C96A'], [.5, '#E6AE3E'], [.75, '#DDA028'], [1, '#D39311']],
    open: [[0, '#F9C96A'], [.5, '#E6AE3E'], [.75, '#DDA028'], [1, '#D39311']],
  },
};

function FolderCard({ preview = false, theme = 'gray' }: { preview?: boolean; theme?: FolderTheme }) {
  const folder = folderOptions[theme];
  const rearGradients = folderRearGradients[theme];
  return <button className={`folder-card folder-${theme} ${preview ? 'folder-card-preview' : ''}`} aria-label={`${folder.name} folder, ${folder.size}. Hover or focus to open`}>
    <span className="folder-shell" aria-hidden="true">
      <svg className="folder-rear" viewBox="0 0 343 247" aria-hidden="true">
        <defs>
          <radialGradient id={`folder-rear-gradient-closed-${theme}`} cx="0" cy="0" r="10" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0 -22.4 35.9 0 171.5 214)">
            {rearGradients.closed.map(([offset, color]) => <stop key={`${offset}-${color}`} offset={offset} stopColor={color} />)}
          </radialGradient>
          <radialGradient id={`folder-rear-gradient-open-${theme}`} cx="0" cy="0" r="10" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0 -15.25 21.18 0 171.5 141.04)">
            {rearGradients.open.map(([offset, color]) => <stop key={`${offset}-${color}`} offset={offset} stopColor={color} />)}
          </radialGradient>
        </defs>
        <path />
      </svg>
      <span className="folder-paper-clip">
        <span className="folder-paper folder-paper-back" />
        <span className="folder-paper folder-paper-front" />
      </span>
      <span className="folder-front" />
      <svg className="folder-front-outline" viewBox="0 0 343.175 247.15" aria-hidden="true">
        <defs><linearGradient id={`folder-front-stroke-${theme}`} x1="222.5" y1="-9.67" x2="188.55" y2="238.45" gradientUnits="userSpaceOnUse"><stop stopColor="var(--stroke-1)" /><stop offset="1" stopColor="var(--stroke-2)" /></linearGradient></defs>
        <path data-name="folder-back" />
      </svg>
      <span className="folder-name">{folder.name}</span>
      <span className="folder-size">{folder.size}</span>
    </span>
  </button>;
}

function FolderHoverDemo() {
  const [theme, setTheme] = useState<FolderTheme>('gray');
  const [previewTheme, setPreviewTheme] = useState<FolderTheme | null>(null);
  const [outgoingTheme, setOutgoingTheme] = useState<FolderTheme | null>(null);
  const [enteringFromPreview, setEnteringFromPreview] = useState(false);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (transitionTimer.current) clearTimeout(transitionTimer.current);
  }, []);

  const switchTheme = (nextTheme: FolderTheme) => {
    if (nextTheme === theme) return;
    if (transitionTimer.current) clearTimeout(transitionTimer.current);
    setEnteringFromPreview(previewTheme === nextTheme);
    setPreviewTheme(null);
    setOutgoingTheme(theme);
    setTheme(nextTheme);
    transitionTimer.current = setTimeout(() => {
      setOutgoingTheme(null);
      setEnteringFromPreview(false);
      transitionTimer.current = null;
    }, 960);
  };

  return <main className="folder-demo-stage">
    <section className="folder-storage-card" aria-label="Folder storage demo">
      <div className={`folder-display ${outgoingTheme ? 'is-switching' : ''}`}>
        <div className={`folder-transition-layer ${outgoingTheme ? `is-entering ${enteringFromPreview ? 'is-from-preview' : ''}` : ''}`}><FolderCard theme={theme} /></div>
        {!outgoingTheme && previewTheme && previewTheme !== theme && <div className="folder-transition-layer is-preview"><FolderCard theme={previewTheme} /></div>}
        {outgoingTheme && <div className="folder-transition-layer is-leaving"><FolderCard theme={outgoingTheme} /></div>}
      </div>
      <section className="storage-panel" aria-labelledby="storage-title">
        <div className="storage-heading"><div><h2 id="storage-title">Your Storage</h2><p>432 GB of 560 GB used</p></div><span>77%</span></div>
        <div className="storage-progress" role="group" aria-label="Choose folder color">
          <span className="progress-track">
            {(['blue','yellow','gray'] as FolderTheme[]).map(color => <button key={color} className={`progress-segment progress-${color} ${theme === color ? 'is-selected' : ''}`} aria-label={`Show ${folderOptions[color].name} folder, ${folderOptions[color].size}`} aria-pressed={theme === color} onMouseEnter={() => color !== theme && setPreviewTheme(color)} onMouseLeave={() => setPreviewTheme(null)} onFocus={() => color !== theme && setPreviewTheme(color)} onBlur={() => setPreviewTheme(null)} onClick={() => switchTheme(color)}><span className="storage-tooltip">{folderOptions[color].size}</span></button>)}
          </span>
        </div>
        <div className="storage-legend" aria-hidden="true">
          {(['blue','yellow','gray'] as FolderTheme[]).map(color => <span key={color}><i className={`legend-dot legend-${color}`} />{folderOptions[color].name}</span>)}
        </div>
      </section>
    </section>
  </main>;
}

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
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const selectedBill = bills[selected];
  const embedded = new URLSearchParams(window.location.search).has('embed');
  const embeddedScale = embedded ? Math.min(.82, Math.max(.5, (viewportWidth - 48) / 460)) : 1;

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return <main className={`stage ${dark ? 'dark' : ''} ${embedded ? 'embedded' : ''}`}>
    <div className="prototype-shell" style={{ '--demo-scale': embeddedScale } as React.CSSProperties}>
    <div className="prototype-scale">
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
    </div>
    </div>
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
  {
    id: '002',
    slug: 'folder-hover',
    title: 'Folder Hover',
    category: 'Interaction',
    type: 'Hover',
    year: '2026',
  },
];

function ProjectThumbnail({ slug }: { slug: string }) {
  const filename = slug === 'folder-hover' ? 'folder-hover.png' : 'bills-date-picker.png';
  return <img className="project-thumbnail-image" src={`${import.meta.env.BASE_URL}assets/gallery/${filename}`} alt="" />;
}

function Gallery() {
  const pathProject = projects.find(project => window.location.pathname.includes(`/experiments/${project.slug}`));
  const [openProject, setOpenProject] = useState<string | null>(() => pathProject?.slug ?? null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const cardLinkRef = useRef<HTMLAnchorElement>(null);

  const openDialog = (event: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    event.preventDefault();
    window.history.pushState({ project: slug }, '', `${import.meta.env.BASE_URL}experiments/${slug}/`);
    setOpenProject(slug);
  };

  const closeDialog = () => {
    window.history.pushState({}, '', import.meta.env.BASE_URL);
    setOpenProject(null);
    window.setTimeout(() => cardLinkRef.current?.focus(), 0);
  };

  useEffect(() => {
    const onPopState = () => setOpenProject(projects.find(project => window.location.pathname.includes(`/experiments/${project.slug}`))?.slug ?? null);
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

  const activeProject = projects.find(project => project.slug === openProject);
  const activeDemoHref = activeProject ? `${import.meta.env.BASE_URL}demos/${activeProject.slug}/` : '';

  return <main className="gallery-page">
    <header className="gallery-header">
      <a className="gallery-logo" href={import.meta.env.BASE_URL}>UI Experiments</a>
      <nav aria-label="Primary"><a href="#work">Work</a></nav>
    </header>

    <section className="gallery-work" id="work" aria-label="Experiments">
      <div className="project-grid">
        {projects.map(project => <article className="project-card" key={project.slug}>
          <a ref={cardLinkRef} className="project-preview" href={`${import.meta.env.BASE_URL}experiments/${project.slug}/`} onClick={(event) => openDialog(event, project.slug)} aria-label={`Open ${project.title} preview`}><ProjectThumbnail slug={project.slug} /><span className="open-mark" aria-hidden="true">↗</span></a>
          <div className="project-meta">
            <div><h3><a href={`${import.meta.env.BASE_URL}demos/${project.slug}/`}>{project.title}</a><span>#{project.id}</span></h3></div>
            <p className="project-type">{project.category} · {project.type} · {project.year}</p>
          </div>
        </article>)}
      </div>
    </section>

    <footer className="gallery-footer"><span>UI Experiments</span><span>Built with care · 2026</span></footer>

    <AnimatePresence>
      {activeProject && <motion.div className="dialog-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .2 }} onMouseDown={(event) => { if (event.target === event.currentTarget) closeDialog(); }}>
        <motion.section className="experiment-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title" initial={{ opacity: 0, y: 18, scale: .99 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: .995 }} transition={{ duration: .32, ease: [0.23, 1, 0.32, 1] }}>
          <div className="dialog-stage"><iframe src={`${activeDemoHref}?embed=1`} title={`${activeProject.title} interactive demo`} /></div>
          <aside className="dialog-info">
            <div className="dialog-actions"><button ref={closeButtonRef} className="dialog-icon-button" onClick={closeDialog} aria-label="Close preview">×</button><div><button className="dialog-icon-button" disabled aria-label="Previous experiment">←</button><button className="dialog-icon-button" disabled aria-label="Next experiment">→</button></div></div>
            <div className="dialog-copy"><div className="dialog-kicker"><span className="dialog-tag">{activeProject.type}</span><span className="dialog-number">#{activeProject.id}</span></div><h2 id="dialog-title">{activeProject.title}</h2><p>{activeProject.slug === 'folder-hover' ? 'A tactile folder card that unfolds on hover or keyboard focus, reconstructed from the supplied Figma states.' : 'An interactive weekly bill picker with tactile transitions, bill states, and accessible light and dark themes.'}</p></div>
            <a className="view-demo-button" href={activeDemoHref}>Open full demo <span aria-hidden="true">↗</span></a>
          </aside>
        </motion.section>
      </motion.div>}
    </AnimatePresence>
  </main>;
}

function Root() {
  if (window.location.pathname.includes('/demos/folder-hover')) return <FolderHoverDemo />;
  if (window.location.pathname.includes('/demos/bills-date-picker')) return <BillsDemo />;
  return <Gallery />;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><MotionConfig reducedMotion="user"><Root /></MotionConfig></React.StrictMode>);

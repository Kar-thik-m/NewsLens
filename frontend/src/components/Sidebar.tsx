import React from 'react';
import {
  Newspaper,
  Zap,
  Globe,
  Cpu,
  TrendingUp,
  Landmark,
  FlaskConical,
  Gamepad2,
  Sparkles,
} from 'lucide-react';

export interface SidebarCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const CATEGORIES: SidebarCategory[] = [
  { id: 'all',         label: 'All News',    icon: <Newspaper   size={16} /> },
  { id: 'trending',   label: 'Trending',    icon: <Zap         size={16} /> },
  { id: 'world',      label: 'World',       icon: <Globe       size={16} /> },
  { id: 'tech',       label: 'Technology',  icon: <Cpu         size={16} /> },
  { id: 'business',   label: 'Business',   icon: <TrendingUp  size={16} /> },
  { id: 'politics',   label: 'Politics',   icon: <Landmark    size={16} /> },
  { id: 'science',    label: 'Science',    icon: <FlaskConical size={16} /> },
  { id: 'gaming',     label: 'Gaming',     icon: <Gamepad2    size={16} /> },
  { id: 'ai',         label: 'AI & Future',icon: <Sparkles    size={16} /> },
];

interface SidebarProps {
  active: string;
  onChange: (id: string) => void;
  counts: Record<string, number>;
}

const Sidebar: React.FC<SidebarProps> = ({ active, onChange, counts }) => {
  return (
    <aside className="sidebar" aria-label="News categories">
      <span className="sidebar-section-label">Categories</span>

      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          id={`sidebar-${cat.id}`}
          className={`sidebar-item ${active === cat.id ? 'active' : ''}`}
          onClick={() => onChange(cat.id)}
          aria-current={active === cat.id ? 'page' : undefined}
        >
          <span className="item-icon">{cat.icon}</span>
          {cat.label}
          {counts[cat.id] !== undefined && (
            <span className="item-count">{counts[cat.id]}</span>
          )}
        </button>
      ))}

      <div className="sidebar-divider" />
      <span className="sidebar-section-label">Sources</span>
      <p style={{ fontSize: '12px', color: 'var(--text-muted)', padding: '4px 12px' }}>
        RSS feeds aggregated automatically
      </p>
    </aside>
  );
};

export default Sidebar;

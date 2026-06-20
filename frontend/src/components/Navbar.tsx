import React from 'react';
import { Rss } from 'lucide-react';

interface NavbarProps {
  onRefresh: () => void;
  refreshing: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onRefresh, refreshing }) => {
  return (
    <nav className="navbar" role="banner">
      <a className="navbar-brand" href="/" id="navbar-brand">
        <div className="navbar-logo">N</div>
        <span className="navbar-title">NewsLens</span>
      </a>

      <div className="navbar-actions">
        <button
          id="navbar-refresh-btn"
          className={`btn btn-ghost refresh-btn ${refreshing ? 'spinning' : ''}`}
          onClick={onRefresh}
          disabled={refreshing}
          aria-label="Refresh news feed"
        >
          <Rss size={14} />
          {refreshing ? 'Fetching…' : 'Fetch Latest'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

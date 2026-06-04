import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link to="/" className="site-brand animate-logo">
          <img src="/top-bar-logo-also may use at footer.png" alt="Sahityotsav Logo" className="site-logo" />
          <div className="header-logo-text">
            <h1>SAHITYOTSAV</h1>
            <span>Results Hub</span>
          </div>
        </Link>
        
        <nav className="site-nav">
          <Link to="/results">Results</Link>
          <Link to="/search">Search</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;

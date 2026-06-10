import { Link } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div>
      <Header />
      
      <main>
        {/* Hero Section */}
        <div className="home-hero" style={{
          position: 'relative',
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          paddingBottom: '100px',
          overflow: 'hidden'
        }}>
          {/* Background Image / Poster */}
          <div className="home-poster-bg" style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: 'url(/main-poster.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: -2
          }} />
          
          {/* Gradient Overlay */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'linear-gradient(to bottom, rgba(13,25,32,0.3) 0%, rgba(13,25,32,0.8) 70%, rgba(13,25,32,1) 100%)',
            zIndex: -1
          }} />
          
          <div className="bg-orb orb-1"></div>
          <div className="bg-orb orb-2"></div>
          
          {/* Hero Content */}
          <div className="container animate-fade-up" style={{ position: 'relative', zIndex: 10 }}>
            <div className="home-hero-content animate-float">
              <h2 className="gold-gradient-text hero-title" style={{ fontSize: '4rem', fontWeight: 800, marginBottom: '20px', lineHeight: 1.1, textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                Celebrate <br />Literary Excellence
              </h2>
              <p className="hero-subtitle" style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '550px', marginBottom: '40px', lineHeight: 1.6, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                Discover the rising stars of literature, arts, and culture. The official platform for Sahityotsav event results and updates.
              </p>
              
              <div className="hero-buttons" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <Link to="/results" className="btn-primary" style={{ padding: '1.1rem 2.5rem', fontSize: '1.1rem' }}>
                  View Results &rarr;
                </Link>
                <Link to="/search" className="btn-outline-white glass-card" style={{ padding: '1.1rem 2.5rem', fontSize: '1.1rem' }}>
                  <SearchIcon size={20} /> Search My Name
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <section className="container home-about-section animate-fade-up" style={{ padding: '100px 1.5rem', position: 'relative' }}>
          <div className="glass-card home-about-card admin-layout" style={{
            display: 'flex',
            gap: '32px',
            alignItems: 'flex-start',
            padding: '40px',
            background: 'linear-gradient(145deg, rgba(25, 45, 60, 0.4), rgba(13, 25, 32, 0.8))'
          }}>
            <div className="home-about-accent" style={{ width: '4px', height: '100%', minHeight: '120px', background: 'linear-gradient(to bottom, var(--gold-accent), var(--gold-primary))', borderRadius: '4px', flexShrink: 0, boxShadow: '0 0 15px rgba(201, 168, 76, 0.5)' }} />
            <div>
              <h3 className="home-about-title" style={{ fontSize: '2.5rem', color: 'white', marginBottom: '24px', fontWeight: 700 }}>About Sahityotsav</h3>
              <p className="home-about-copy" style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.15rem', maxWidth: '800px' }}>
                Sahityotsav is a vibrant festival celebrating linguistic diversity and cultural heritage. 
                It serves as a platform for thousands of students to showcase their talents in literature, 
                arts, and culture across multiple languages and disciplines. This Results Hub allows participants, 
                parents, and organizers to seamlessly access and download beautifully crafted result posters.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;

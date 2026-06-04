import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Search as SearchIcon, X, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '../components/ToastContext';

const Search = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { addToast } = useToast();

  // Debounced suggestions fetch
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query.trim() || query.length < 2) {
        setSuggestions([]);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('participants')
          .select('student_name, programs!inner(categories(name))')
          .ilike('student_name', `%${query.trim()}%`)
          .limit(10);
          
        if (error) throw error;
        
        // Format and deduplicate suggestions
        const uniqueSuggestions = new Map();
        data?.forEach(p => {
          const key = p.student_name.toLowerCase();
          if (!uniqueSuggestions.has(key)) {
            uniqueSuggestions.set(key, {
              name: p.student_name,
              category: p.programs?.categories?.name || 'Unknown'
            });
          }
        });
        
        setSuggestions(Array.from(uniqueSuggestions.values()));
      } catch (err) {
        console.error('Failed to fetch suggestions:', err);
      }
    };

    const debounceTimer = setTimeout(() => {
      if (!hasSearched) fetchSuggestions();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, hasSearched]);

  const handleSearch = async (e, forcedQuery = null) => {
    if (e) e.preventDefault();
    const searchQuery = forcedQuery || query;
    if (!searchQuery.trim()) return;

    setShowSuggestions(false);

    setLoading(true);
    setHasSearched(true);
    try {
      // 1. Find participants matching the name
      const { data: participantsData, error: pError } = await supabase
        .from('participants')
        .select(`
          id, student_name, unit_name, program_id,
          programs ( id, name, category_id, categories ( id, name ) )
        `)
        .ilike('student_name', `%${searchQuery.trim()}%`);

      if (pError) throw pError;

      // Group by student_name
      const studentsMap = new Map();
      
      participantsData?.forEach(p => {
        const key = p.student_name.toLowerCase();
        if (!studentsMap.has(key)) {
          studentsMap.set(key, {
            student_name: p.student_name,
            unit_name: p.unit_name,
            programs: [],
            wonAny: false
          });
        }
        
        studentsMap.get(key).programs.push({
          id: p.programs.id,
          name: p.programs.name,
          category: p.programs.categories?.name,
          result: null // Will fill this next
        });
      });

      // 2. Fetch results for these students to see if they won
      const { data: resultsData, error: rError } = await supabase
        .from('results')
        .select('program_id, position, grade, student_name')
        .ilike('student_name', `%${searchQuery.trim()}%`);
        
      if (rError) throw rError;

      // 3. Merge results into studentsMap
      resultsData?.forEach(r => {
        const key = r.student_name.toLowerCase();
        if (studentsMap.has(key)) {
          const student = studentsMap.get(key);
          const progIndex = student.programs.findIndex(p => p.id === r.program_id);
          if (progIndex !== -1) {
            student.programs[progIndex].result = {
              position: r.position,
              grade: r.grade
            };
            student.wonAny = true;
          }
        }
      });

      setSearchResults(Array.from(studentsMap.values()));
    } catch (err) {
      console.error(err);
      addToast('Search failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getMedalEmoji = (position) => {
    if (position === 1) return '🥇';
    if (position === 2) return '🥈';
    if (position === 3) return '🥉';
    return '🏅';
  };

  return (
    <div style={{ paddingTop: '75px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      <main style={{ flex: 1 }}>
        <div style={{ 
          background: 'linear-gradient(to bottom, rgba(13,25,32,1) 0%, rgba(20,40,55,0.5) 100%)',
          padding: '60px 0',
          borderBottom: '1px solid rgba(255,255,255,0.05)'
        }}>
          <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
            <span style={{ color: 'var(--gold-primary)', fontWeight: 600, letterSpacing: '2px', fontSize: '0.9rem', textTransform: 'uppercase' }}>Participant Lookup</span>
            <h2 style={{ fontSize: '3rem', margin: '16px 0', color: 'white' }}>Find Your Result</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '40px' }}>
              Search for your name to see your registered programs and any prizes you've won across all categories.
            </p>

            <form onSubmit={handleSearch} style={{ position: 'relative', display: 'flex', gap: '12px', maxWidth: '600px', margin: '0 auto' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <SearchIcon size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input 
                  type="text" 
                  className="input-field"
                  placeholder="Enter your full name..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setHasSearched(false);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  style={{ paddingLeft: '48px', paddingRight: '48px', height: '56px', fontSize: '1.1rem', borderRadius: showSuggestions && suggestions.length > 0 ? '8px 8px 0 0' : '8px' }}
                />
                {query && (
                  <button 
                    type="button"
                    onClick={() => { setQuery(''); setSuggestions([]); setHasSearched(false); }}
                    style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}
                  >
                    <X size={20} />
                  </button>
                )}
                
                {/* Autocomplete Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0, right: 0,
                    background: 'var(--bg-card)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid var(--glass-border)',
                    borderTop: 'none',
                    borderRadius: '0 0 8px 8px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                    zIndex: 50,
                    overflow: 'hidden'
                  }}>
                    {suggestions.map((sug, i) => (
                      <div 
                        key={i}
                        onClick={() => {
                          setQuery(sug.name);
                          handleSearch(null, sug.name);
                        }}
                        style={{
                          padding: '12px 16px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          cursor: 'pointer',
                          borderBottom: i < suggestions.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.1)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <span style={{ color: 'white', fontWeight: 500 }}>{sug.name}</span>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '100px' }}>{sug.category}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button type="submit" className="btn-primary" style={{ height: '56px', padding: '0 32px' }} disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : 'Search'}
              </button>
            </form>
          </div>
        </div>

        <div className="container" style={{ padding: '60px 1.5rem' }}>
          {!hasSearched ? (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px' }}>
              <Sparkles size={48} style={{ margin: '0 auto 24px auto', opacity: 0.3, color: 'var(--gold-primary)' }} />
              <p>Enter a name above to discover the results.</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="animate-fade-up" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px' }}>
              <AlertCircle size={48} style={{ margin: '0 auto 24px auto', opacity: 0.3 }} />
              <p style={{ fontSize: '1.2rem', color: 'white', marginBottom: '8px' }}>No participants found</p>
              <p>We couldn't find anyone matching "{query}". Please check the spelling.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '24px', maxWidth: '800px', margin: '0 auto' }}>
              {searchResults.map((student, idx) => (
                <div key={idx} className="glass-card animate-fade-up" style={{ padding: '24px', animationDelay: `${idx * 0.1}s` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>
                    <div style={{ 
                      width: '64px', height: '64px', 
                      borderRadius: '50%', 
                      background: 'linear-gradient(135deg, var(--gold-accent), var(--gold-primary))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '2rem', fontWeight: 'bold', color: 'var(--bg-primary)'
                    }}>
                      {student.student_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.5rem', color: 'white', margin: '0 0 4px 0' }}>{student.student_name}</h3>
                      <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{student.unit_name}</p>
                    </div>
                    {student.wonAny && (
                      <div style={{ marginLeft: 'auto', background: 'rgba(201, 168, 76, 0.15)', color: 'var(--gold-primary)', padding: '8px 16px', borderRadius: '100px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Sparkles size={16} /> Prize Winner
                      </div>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {student.programs.map((prog, pIdx) => (
                      <div key={pIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '12px 16px', borderRadius: '8px' }}>
                        <div>
                          <div style={{ color: 'white', fontWeight: 500 }}>{prog.name}</div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{prog.category}</div>
                        </div>
                        <div>
                          {prog.result ? (
                            <div style={{ background: 'rgba(201,168,76,0.2)', border: '1px solid var(--gold-primary)', color: 'var(--gold-primary)', padding: '6px 12px', borderRadius: '100px', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                              {getMedalEmoji(prog.result.position)} {prog.result.position}{prog.result.position === 1 ? 'st' : prog.result.position === 2 ? 'nd' : 'rd'} Place ({prog.result.grade})
                            </div>
                          ) : (
                            <div style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', padding: '6px 12px', borderRadius: '100px', fontSize: '0.9rem' }}>
                              Awaiting
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Search;

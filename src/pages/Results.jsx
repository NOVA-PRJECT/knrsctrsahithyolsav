import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Select from '../components/Select';
import { Poster1, Poster2, Poster3 } from '../components/Posters';
import { Trophy, BookOpen, Loader2, Hourglass, Download } from 'lucide-react';
import { toPng } from 'html-to-image';
import { useToast } from '../components/ToastContext';

const Results = () => {
  const [categories, setCategories] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedProgramId, setSelectedProgramId] = useState('');
  const [winners, setWinners] = useState([]);
  
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingProgs, setLoadingProgs] = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const { addToast } = useToast();

  const poster1Ref = useRef(null);
  const poster2Ref = useRef(null);
  const poster3Ref = useRef(null);


  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategoryId) {
      fetchPrograms(selectedCategoryId);
      setSelectedProgramId('');
      setWinners([]);
    }
  }, [selectedCategoryId]);

  useEffect(() => {
    if (selectedProgramId) {
      fetchResults(selectedProgramId);
    }
  }, [selectedProgramId]);

  async function fetchCategories() {
    try {
      const { data, error } = await supabase.from('categories').select('*').order('name');
      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error(err);
      addToast('Failed to load categories', 'error');
    } finally {
      setLoadingCats(false);
    }
  };

  async function fetchPrograms(categoryId) {
    setLoadingProgs(true);
    try {
      const { data, error } = await supabase.from('programs').select('*').eq('category_id', categoryId).order('name');
      if (error) throw error;
      setPrograms(data || []);
    } catch (err) {
      console.error(err);
      addToast('Failed to load programs', 'error');
    } finally {
      setLoadingProgs(false);
    }
  };

  async function fetchResults(programId) {
    setLoadingResults(true);
    try {
      const { data, error } = await supabase.from('results').select('*').eq('program_id', programId).order('position');
      if (error) throw error;
      setWinners(data || []);
    } catch (err) {
      console.error(err);
      addToast('Failed to load results', 'error');
    } finally {
      setLoadingResults(false);
    }
  };

  const handleDownload = async (ref, designName) => {
    if (!ref.current) return;
    setIsDownloading(true);
    try {
      // Small delay to ensure styles are applied
      await new Promise(r => setTimeout(r, 100));
      
      const dataUrl = await toPng(ref.current, { 
        cacheBust: true,
        pixelRatio: 3,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left'
        }
      });
      
      const link = document.createElement('a');
      link.download = `Sahityotsav_${selectedProgram?.name}_${designName}.png`;
      link.href = dataUrl;
      link.click();
      addToast('Poster downloaded successfully!');
    } catch (err) {
      console.error(err);
      addToast('Failed to generate poster', 'error');
    } finally {
      setIsDownloading(false);
    }
  };

  const selectedCategory = categories.find(c => c.id === selectedCategoryId);
  const selectedProgram = programs.find(p => p.id === selectedProgramId);

  return (
    <div style={{ paddingTop: '75px' }}>
      <Header />
      
      <main className="container" style={{ minHeight: '80vh', padding: '40px 1.5rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2.5rem' }} className="gold-gradient-text">
          Event Results
        </h2>

        <div style={{ maxWidth: '600px', margin: '0 auto 40px auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Select Category</label>
              {loadingCats ? (
                <div style={{ padding: '12px', display: 'flex', justifyContent: 'center' }}><Loader2 className="animate-spin" /></div>
              ) : (
                <Select 
                  options={categories.map(c => ({ value: c.id, label: c.name }))}
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  placeholder="-- Choose a Category --"
                />
              )}
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Select Program</label>
              {loadingProgs ? (
                <div style={{ padding: '12px', display: 'flex', justifyContent: 'center' }}><Loader2 className="animate-spin" /></div>
              ) : (
                <Select 
                  options={programs.map(p => ({ value: p.id, label: p.name }))}
                  value={selectedProgramId}
                  onChange={(e) => setSelectedProgramId(e.target.value)}
                  placeholder="-- Choose a Program --"
                  disabled={!selectedCategoryId || programs.length === 0}
                />
              )}
            </div>
          </div>
        </div>

        {/* Empty States & Results */}
        <div style={{ marginTop: '40px' }}>
          {!selectedCategoryId ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
              <Trophy size={64} style={{ margin: '0 auto 24px auto', opacity: 0.2, color: 'var(--gold-primary)' }} />
              <p style={{ fontSize: '1.2rem' }}>Select a category to begin exploring results.</p>
            </div>
          ) : !selectedProgramId ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
              <BookOpen size={64} style={{ margin: '0 auto 24px auto', opacity: 0.2, color: 'var(--gold-primary)' }} />
              <p style={{ fontSize: '1.2rem' }}>Now select a program to view the winners.</p>
            </div>
          ) : loadingResults ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
              <Loader2 size={48} className="animate-spin" style={{ margin: '0 auto 24px auto', color: 'var(--gold-primary)' }} />
              <p>Loading results...</p>
            </div>
          ) : winners.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
              <Hourglass size={64} style={{ margin: '0 auto 24px auto', opacity: 0.2 }} />
              <p style={{ fontSize: '1.2rem' }}>Results for {selectedProgram?.name} are not published yet.</p>
            </div>
          ) : (
            <div className="animate-fade-up">
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h3 style={{ fontSize: '2rem', color: 'white', marginBottom: '8px' }}>{selectedProgram?.name}</h3>
                <span style={{ background: 'rgba(201, 168, 76, 0.1)', color: 'var(--gold-primary)', padding: '4px 12px', borderRadius: '100px', fontSize: '0.9rem' }}>
                  {selectedCategory?.name}
                </span>
              </div>

              {/* Winners Quick List */}
              <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto 60px auto', padding: '24px' }}>
                <h4 style={{ color: 'var(--gold-primary)', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Winners List</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {winners.map(w => (
                    <div key={w.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(0,0,0,0.2)', padding: '12px 16px', borderRadius: '8px' }}>
                      <div style={{ fontSize: '1.5rem' }}>
                        {w.position === 1 ? '🥇' : w.position === 2 ? '🥈' : '🥉'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: 'white', fontWeight: 600 }}>{w.student_name}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{w.unit_name}</div>
                      </div>
                      <div style={{ color: 'var(--gold-primary)', fontWeight: 'bold' }}>{w.grade}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Downloadable Posters */}
              <h4 style={{ textAlign: 'center', color: 'var(--gold-primary)', marginBottom: '30px', fontSize: '1.5rem' }}>Download Celebration Posters</h4>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                gap: '30px',
                maxWidth: '900px',
                margin: '0 auto'
              }}>
                {/* Poster 1 */}
                <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ color: 'white', fontWeight: 500, textAlign: 'center' }}>Classic Gold</div>
                  <Poster1 ref={poster1Ref} program={selectedProgram.name} category={selectedCategory.name} winners={winners} />
                  <button className="btn-primary" onClick={() => handleDownload(poster1Ref, 'Classic')} disabled={isDownloading}>
                    <Download size={18} /> Download
                  </button>
                </div>
                
                {/* Poster 2 */}
                <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ color: 'white', fontWeight: 500, textAlign: 'center' }}>Teal Ribbon</div>
                  <Poster2 ref={poster2Ref} program={selectedProgram.name} category={selectedCategory.name} winners={winners} />
                  <button className="btn-primary" onClick={() => handleDownload(poster2Ref, 'Teal')} disabled={isDownloading}>
                    <Download size={18} /> Download
                  </button>
                </div>

                {/* Poster 3 */}
                <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ color: 'white', fontWeight: 500, textAlign: 'center' }}>Midnight Wreath</div>
                  <Poster3 ref={poster3Ref} program={selectedProgram.name} category={selectedCategory.name} winners={winners} />
                  <button className="btn-primary" onClick={() => handleDownload(poster3Ref, 'Midnight')} disabled={isDownloading}>
                    <Download size={18} /> Download
                  </button>
                </div>


              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Results;

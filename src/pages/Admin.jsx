import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useToast } from '../components/ToastContext';
import ConfirmModal from '../components/ConfirmModal';
import Select from '../components/Select';
import { LogOut, Trash2, Plus, Users, Trophy, BookOpen, Layers } from 'lucide-react';

const Admin = ({ session }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [activeTab, setActiveTab] = useState('categories');
  const { addToast } = useToast();

  // Data states
  const [categories, setCategories] = useState([]);
  const [programs, setPrograms] = useState([]);
  
  // Modal state
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });



  useEffect(() => {
    if (session) {
      fetchCategories();
      fetchPrograms();
    }
  }, [session, activeTab]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoadingAuth(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      addToast('Logged in successfully');
    } catch (error) {
      addToast(error.message, 'error');
    } finally {
      setLoadingAuth(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    addToast('Logged out');
  };

  async function fetchCategories() {
    const { data } = await supabase.from('categories').select('*').order('name');
    if (data) setCategories(data);
  }

  async function fetchPrograms() {
    const { data } = await supabase.from('programs').select('*, categories(name)').order('name');
    if (data) setPrograms(data);
  }

  if (!session) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div className="glass-card" style={{ maxWidth: '400px', width: '100%', padding: '40px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '8px', color: 'white' }}>Admin Portal</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '32px' }}>Sign in to manage results</p>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input 
              type="email" 
              placeholder="Email" 
              className="input-field" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
            <input 
              type="password" 
              placeholder="Password" 
              className="input-field" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
            <button type="submit" className="btn-primary" style={{ marginTop: '8px' }} disabled={loadingAuth}>
              {loadingAuth ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="admin-topbar" style={{ background: 'var(--bg-card)', padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container admin-topbar-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.25rem', color: 'var(--gold-primary)', margin: 0 }}>Sahityotsav Admin</h1>
          <button className="btn-outline-white" style={{ padding: '8px 16px' }} onClick={handleLogout}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </header>

      <div className="container admin-layout" style={{ display: 'flex', gap: '32px', padding: '40px 1.5rem', flex: 1 }}>
        {/* Sidebar Nav */}
        <div className="admin-sidebar" style={{ width: '250px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <NavButton active={activeTab === 'categories'} onClick={() => setActiveTab('categories')} icon={<Layers size={20} />} label="Categories" />
          <NavButton active={activeTab === 'programs'} onClick={() => setActiveTab('programs')} icon={<BookOpen size={20} />} label="Programs" />
          <NavButton active={activeTab === 'participants'} onClick={() => setActiveTab('participants')} icon={<Users size={20} />} label="Participants" />
          <NavButton active={activeTab === 'results'} onClick={() => setActiveTab('results')} icon={<Trophy size={20} />} label="Results" />
        </div>

        {/* Content Area */}
        <div className="admin-content" style={{ flex: 1, minWidth: 0 }}>
          {activeTab === 'categories' && <CategoriesManager categories={categories} reload={fetchCategories} addToast={addToast} setConfirmModal={setConfirmModal} />}
          {activeTab === 'programs' && <ProgramsManager programs={programs} categories={categories} reload={fetchPrograms} addToast={addToast} setConfirmModal={setConfirmModal} />}
          {activeTab === 'participants' && <ParticipantsManager categories={categories} addToast={addToast} />}
          {activeTab === 'results' && <ResultsManager categories={categories} addToast={addToast} />}
        </div>
      </div>

      <ConfirmModal 
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={() => {
          confirmModal.onConfirm();
          setConfirmModal({ ...confirmModal, isOpen: false });
        }}
      />
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '12px 16px',
      borderRadius: '8px',
      background: active ? 'rgba(201, 168, 76, 0.15)' : 'transparent',
      color: active ? 'var(--gold-primary)' : 'var(--text-secondary)',
      fontWeight: active ? 600 : 500,
      textAlign: 'left',
      transition: 'all 0.2s',
      border: 'none',
      cursor: 'pointer'
    }}
  >
    {icon} {label}
  </button>
);

// --- Subcomponents for Managers ---

const getEmptyResults = () => [
  { position: 1, student_name: '', unit_name: '', grade: 'A' },
  { position: 2, student_name: '', unit_name: '', grade: 'A' },
  { position: 3, student_name: '', unit_name: '', grade: 'B' }
];

const CategoriesManager = ({ categories, reload, addToast, setConfirmModal }) => {
  const [name, setName] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const { error } = await supabase.from('categories').insert([{ name }]);
      if (error) throw error;
      addToast('Category added successfully');
      setName('');
      reload();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleDelete = (id) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Category',
      message: 'Are you sure? This will delete all programs and results associated with this category.',
      onConfirm: async () => {
        try {
          const { error } = await supabase.from('categories').delete().eq('id', id);
          if (error) throw error;
          addToast('Category deleted');
          reload();
        } catch (err) {
          addToast(err.message, 'error');
        }
      }
    });
  };

  return (
    <div className="animate-fade-up">
      <h2 style={{ color: 'white', marginBottom: '24px' }}>Manage Categories</h2>
      
      <form onSubmit={handleAdd} className="glass-card form-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', padding: '24px', marginBottom: '24px' }}>
        <input type="text" className="input-field" placeholder="New Category Name" value={name} onChange={e => setName(e.target.value)} style={{ flex: 1, minWidth: '200px' }} />
        <button type="submit" className="btn-primary" style={{ whiteSpace: 'nowrap' }}><Plus size={18} /> Add Category</button>
      </form>

      <div className="glass-card data-card" style={{ padding: '24px' }}>
        {categories.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No categories yet.</p> : (
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white', minWidth: '500px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                <th style={{ padding: '12px', color: 'var(--text-secondary)' }}>Name</th>
                <th style={{ padding: '12px', width: '100px' }}></th>
              </tr>
            </thead>
            <tbody>
              {categories.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px' }}>{c.name}</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <button onClick={() => handleDelete(c.id)} style={{ color: 'var(--danger)', opacity: 0.8 }}><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
};

const ProgramsManager = ({ programs, categories, reload, addToast, setConfirmModal }) => {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim() || !categoryId) return;
    try {
      const { error } = await supabase.from('programs').insert([{ name, category_id: categoryId }]);
      if (error) throw error;
      addToast('Program added successfully');
      setName('');
      reload();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleDelete = (id) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Program',
      message: 'Are you sure? This will delete all results associated with this program.',
      onConfirm: async () => {
        try {
          const { error } = await supabase.from('programs').delete().eq('id', id);
          if (error) throw error;
          addToast('Program deleted');
          reload();
        } catch (err) {
          addToast(err.message, 'error');
        }
      }
    });
  };

  return (
    <div className="animate-fade-up">
      <h2 style={{ color: 'white', marginBottom: '24px' }}>Manage Programs</h2>
      
      <form onSubmit={handleAdd} className="glass-card form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '12px', padding: '24px', marginBottom: '24px', alignItems: 'center' }}>
        <Select 
          options={categories.map(c => ({ value: c.id, label: c.name }))}
          value={categoryId} onChange={e => setCategoryId(e.target.value)}
          placeholder="Select Category"
        />
        <input type="text" className="input-field" placeholder="Program Name" value={name} onChange={e => setName(e.target.value)} />
        <button type="submit" className="btn-primary" style={{ whiteSpace: 'nowrap' }}><Plus size={18} /> Add</button>
      </form>

      <div className="glass-card data-card" style={{ padding: '24px' }}>
        <div className="table-responsive">
          <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white', minWidth: '600px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
              <th style={{ padding: '12px', color: 'var(--text-secondary)' }}>Program Name</th>
              <th style={{ padding: '12px', color: 'var(--text-secondary)' }}>Category</th>
              <th style={{ padding: '12px', width: '100px' }}></th>
            </tr>
          </thead>
          <tbody>
            {programs.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '12px' }}>{p.name}</td>
                <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{p.categories?.name}</td>
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  <button onClick={() => handleDelete(p.id)} style={{ color: 'var(--danger)', opacity: 0.8 }}><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};

const ResultsManager = ({ categories, addToast }) => {
  const [categoryId, setCategoryId] = useState('');
  const [programId, setProgramId] = useState('');
  const [programsList, setProgramsList] = useState([]);
  
  const [results, setResults] = useState(getEmptyResults);

  useEffect(() => {
    if (categoryId) {
      supabase.from('programs').select('*').eq('category_id', categoryId).order('name')
        .then(({ data }) => setProgramsList(data || []));
    }
  }, [categoryId]);

  const handleCategoryChange = (e) => {
    setCategoryId(e.target.value);
    setProgramId('');
  };

  useEffect(() => {
    if (programId) {
      supabase.from('results').select('*').eq('program_id', programId).order('position')
        .then(({ data }) => {
          if (data && data.length > 0) {
            setResults(prev => {
              const newRes = [...prev];
              data.forEach(r => {
                if (r.position <= 3) {
                  newRes[r.position - 1] = { ...r };
                }
              });
              return newRes;
            });
          } else {
            setResults(getEmptyResults());
          }
        });
    }
  }, [programId]);

  const handleSave = async () => {
    if (!programId) return addToast('Select a program first', 'error');
    
    const validResults = results.filter(r => r.student_name.trim() !== '');
    
    try {
      // Delete existing for this program
      await supabase.from('results').delete().eq('program_id', programId);
      
      if (validResults.length > 0) {
        const toInsert = validResults.map(r => ({
          program_id: programId,
          position: r.position,
          student_name: r.student_name,
          unit_name: r.unit_name,
          grade: r.grade
        }));
        
        const { error } = await supabase.from('results').insert(toInsert);
        if (error) throw error;
      }
      
      addToast('Results saved successfully');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div className="animate-fade-up">
      <h2 style={{ color: 'white', marginBottom: '24px' }}>Manage Results</h2>
      
      <div className="glass-card form-grid results-filter-grid" style={{ padding: '24px', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ flex: 1 }}>
          <Select options={categories.map(c => ({ value: c.id, label: c.name }))} value={categoryId} onChange={handleCategoryChange} placeholder="Select Category" />
        </div>
        <div style={{ flex: 1 }}>
          <Select options={programsList.map(p => ({ value: p.id, label: p.name }))} value={programId} onChange={e => setProgramId(e.target.value)} placeholder="Select Program" disabled={!categoryId} />
        </div>
      </div>

      {programId && (
        <div className="glass-card data-card" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--gold-primary)', marginBottom: '20px' }}>Publish Winners</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[1, 2, 3].map((pos, idx) => (
              <div key={pos} className="winner-row" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px' }}>
                <div style={{ fontSize: '1.5rem', width: '40px', textAlign: 'center' }}>{pos === 1 ? '🥇' : pos === 2 ? '🥈' : '🥉'}</div>
                <input type="text" className="input-field" placeholder="Student Name" value={results[idx].student_name} onChange={e => {
                  const newRes = [...results]; newRes[idx].student_name = e.target.value; setResults(newRes);
                }} style={{ flex: 2 }} />
                <input type="text" className="input-field" placeholder="Unit Name" value={results[idx].unit_name} onChange={e => {
                  const newRes = [...results]; newRes[idx].unit_name = e.target.value; setResults(newRes);
                }} style={{ flex: 1 }} />
                <Select options={['A', 'B', 'C'].map(g => ({ value: g, label: `Grade ${g}` }))} value={results[idx].grade} onChange={e => {
                  const newRes = [...results]; newRes[idx].grade = e.target.value; setResults(newRes);
                }} style={{ width: '120px' }} />
              </div>
            ))}
          </div>

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-primary" onClick={handleSave}>Save Results</button>
          </div>
        </div>
      )}
    </div>
  );
};

const ParticipantsManager = ({ categories, addToast }) => {
  // Simplified implementation for constraints
  const [categoryId, setCategoryId] = useState('');
  const [programsList, setProgramsList] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [unitName, setUnitName] = useState('');
  const [selectedPrograms, setSelectedPrograms] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (categoryId) {
      supabase.from('programs').select('*').eq('category_id', categoryId).order('name')
        .then(({ data }) => setProgramsList(data || []));
    }
  }, [categoryId]);

  const handleCategoryChange = (e) => {
    setCategoryId(e.target.value);
    setSelectedPrograms([]);
  };

  const handleToggle = (id) => {
    if (selectedPrograms.includes(id)) {
      setSelectedPrograms(prev => prev.filter(pid => pid !== id));
    } else {
      if (selectedPrograms.length >= 6) {
        addToast('Maximum 6 programs allowed per student', 'error');
        return;
      }
      setSelectedPrograms(prev => [...prev, id]);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!studentName || !unitName || selectedPrograms.length === 0) return;
    
    setLoading(true);
    try {
      const toInsert = selectedPrograms.map(pid => ({
        student_name: studentName,
        unit_name: unitName,
        program_id: pid
      }));
      
      const { error } = await supabase.from('participants').insert(toInsert);
      if (error) throw error;
      
      addToast('Participant registered successfully');
      setStudentName('');
      setUnitName('');
      setSelectedPrograms([]);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-up">
      <h2 style={{ color: 'white', marginBottom: '24px' }}>Register Participant</h2>
      
      <form onSubmit={handleSave} className="glass-card data-card" style={{ padding: '24px' }}>
        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Student Name</label>
            <input type="text" className="input-field" value={studentName} onChange={e=>setStudentName(e.target.value)} required />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Unit Name</label>
            <input type="text" className="input-field" value={unitName} onChange={e=>setUnitName(e.target.value)} required />
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Category Filter</label>
          <Select options={categories.map(c => ({ value: c.id, label: c.name }))} value={categoryId} onChange={handleCategoryChange} placeholder="Select Category to view programs" />
        </div>

        {categoryId && (
          <div style={{ marginBottom: '24px' }}>
            <div className="program-select-heading" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <label style={{ color: 'var(--text-secondary)' }}>Select Programs</label>
              <span style={{ color: selectedPrograms.length === 6 ? 'var(--danger)' : 'var(--gold-primary)', fontSize: '0.9rem' }}>
                {selectedPrograms.length} / 6 Selected
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {programsList.map(p => {
                const isSelected = selectedPrograms.includes(p.id);
                return (
                  <button 
                    type="button" 
                    key={p.id}
                    onClick={() => handleToggle(p.id)}
                    style={{
                      background: isSelected ? 'var(--gold-primary)' : 'rgba(0,0,0,0.3)',
                      color: isSelected ? 'var(--bg-primary)' : 'white',
                      border: `1px solid ${isSelected ? 'var(--gold-primary)' : 'rgba(255,255,255,0.1)'}`,
                      padding: '8px 16px',
                      borderRadius: '100px',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      transition: 'all 0.2s'
                    }}
                  >
                    {p.name}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn-primary" disabled={loading || selectedPrograms.length === 0}>
            {loading ? 'Saving...' : 'Register Participant'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Admin;

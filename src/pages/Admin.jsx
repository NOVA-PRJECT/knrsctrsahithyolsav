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
  const [programParticipants, setProgramParticipants] = useState([]);
  const [manualModes, setManualModes] = useState([false, false, false]);

  useEffect(() => {
    if (categoryId) {
      supabase.from('programs').select('*').eq('category_id', categoryId).order('name')
        .then(({ data }) => setProgramsList(data || []));
    } else {
      setProgramsList([]);
      setProgramId('');
    }
  }, [categoryId]);

  const handleCategoryChange = (e) => {
    setCategoryId(e.target.value);
    setProgramId('');
  };

  useEffect(() => {
    if (programId) {
      Promise.all([
        supabase.from('participants').select('*').eq('program_id', programId).order('student_name'),
        supabase.from('results').select('*').eq('program_id', programId).order('position')
      ]).then(([pRes, rRes]) => {
        const pData = pRes.data || [];
        const rData = rRes.data || [];
        
        setProgramParticipants(pData);
        
        const newResults = getEmptyResults();
        // If there are no participants registered, default to manual mode so they can type
        const newManual = pData.length === 0 ? [true, true, true] : [false, false, false];
        
        rData.forEach(r => {
          if (r.position <= 3) {
            newResults[r.position - 1] = { ...r };
            if (pData.length > 0) {
              const hasMatch = pData.some(p => p.student_name.trim().toLowerCase() === r.student_name.trim().toLowerCase() && p.unit_name.trim().toLowerCase() === r.unit_name.trim().toLowerCase());
              if (r.student_name && !hasMatch) {
                newManual[r.position - 1] = true;
              }
            }
          }
        });
        
        setResults(newResults);
        setManualModes(newManual);
      });
    } else {
      setProgramParticipants([]);
      setResults(getEmptyResults());
      setManualModes([false, false, false]);
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
          student_name: r.student_name.trim(),
          unit_name: r.unit_name.trim(),
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

  const handleSelectWinnerChange = (idx, value) => {
    const newRes = [...results];
    const newManual = [...manualModes];
    
    if (value === 'manual') {
      newManual[idx] = true;
      newRes[idx].student_name = '';
      newRes[idx].unit_name = '';
    } else if (value === '') {
      newRes[idx].student_name = '';
      newRes[idx].unit_name = '';
    } else {
      const [name, unit] = value.split('|||');
      newRes[idx].student_name = name;
      newRes[idx].unit_name = unit;
    }
    
    setResults(newRes);
    setManualModes(newManual);
  };

  // Options for each position select box
  const participantOptions = [
    ...programParticipants.map(p => ({
      value: `${p.student_name}|||${p.unit_name}`,
      label: `${p.student_name} (${p.unit_name})`
    })),
    { value: 'manual', label: '✍️ Enter Manually...' }
  ];

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
            {[1, 2, 3].map((pos, idx) => {
              const currentValue = results[idx].student_name 
                ? (manualModes[idx] ? 'manual' : `${results[idx].student_name}|||${results[idx].unit_name}`)
                : '';

              return (
                <div key={pos} className="winner-row" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '1.5rem', width: '40px', textAlign: 'center' }}>{pos === 1 ? '🥇' : pos === 2 ? '🥈' : '🥉'}</div>
                  
                  {/* Select Dropdown */}
                  <div style={{ flex: 2, minWidth: '200px' }}>
                    <Select 
                      options={participantOptions}
                      value={currentValue}
                      onChange={e => handleSelectWinnerChange(idx, e.target.value)}
                      placeholder="-- Choose Winner from Registered Participants --"
                    />
                  </div>
                  
                  {/* Manual Inputs - Shown if in manual mode or no participants registered */}
                  {manualModes[idx] && (
                    <>
                      <input 
                        type="text" 
                        className="input-field" 
                        placeholder="Student Name" 
                        value={results[idx].student_name} 
                        onChange={e => {
                          const newRes = [...results]; 
                          newRes[idx].student_name = e.target.value; 
                          setResults(newRes);
                        }} 
                        style={{ flex: 2, minWidth: '150px' }} 
                        required
                      />
                      <input 
                        type="text" 
                        className="input-field" 
                        placeholder="Unit Name" 
                        value={results[idx].unit_name} 
                        onChange={e => {
                          const newRes = [...results]; 
                          newRes[idx].unit_name = e.target.value; 
                          setResults(newRes);
                        }} 
                        style={{ flex: 1, minWidth: '120px' }} 
                        required
                      />
                      {/* Button to toggle back if programParticipants are available */}
                      {programParticipants.length > 0 && (
                        <button 
                          type="button" 
                          onClick={() => {
                            const newManual = [...manualModes];
                            newManual[idx] = false;
                            setManualModes(newManual);
                            const newRes = [...results];
                            newRes[idx].student_name = '';
                            newRes[idx].unit_name = '';
                            setResults(newRes);
                          }}
                          style={{ color: 'var(--gold-primary)', fontSize: '0.85rem', textDecoration: 'underline' }}
                        >
                          Cancel
                        </button>
                      )}
                    </>
                  )}
                  
                  {/* Unit Name display if selecting a registered participant (non-manual mode) */}
                  {!manualModes[idx] && results[idx].student_name && (
                    <div style={{ flex: 1, color: 'var(--text-secondary)', padding: '0 12px', background: 'rgba(255,255,255,0.05)', height: '42px', display: 'flex', alignItems: 'center', borderRadius: '8px' }}>
                      {results[idx].unit_name}
                    </div>
                  )}

                  <Select 
                    options={['A', 'B', 'C'].map(g => ({ value: g, label: `Grade ${g}` }))} 
                    value={results[idx].grade} 
                    onChange={e => {
                      const newRes = [...results]; 
                      newRes[idx].grade = e.target.value; 
                      setResults(newRes);
                    }} 
                    style={{ width: '120px' }} 
                  />
                </div>
              );
            })}
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
  const [categoryId, setCategoryId] = useState('');
  const [programId, setProgramId] = useState('');
  const [programsList, setProgramsList] = useState([]);
  
  // Participants in the currently selected program
  const [programParticipants, setProgramParticipants] = useState([]);
  const [selectedParticipantId, setSelectedParticipantId] = useState('');
  
  // All unique students in the database (for autofill dropdown)
  const [allStudents, setAllStudents] = useState([]);
  const [selectedExistingStudent, setSelectedExistingStudent] = useState('');
  
  // Form states
  const [studentName, setStudentName] = useState('');
  const [unitName, setUnitName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUniqueStudents();
  }, []);

  useEffect(() => {
    if (categoryId) {
      supabase.from('programs').select('*').eq('category_id', categoryId).order('name')
        .then(({ data }) => setProgramsList(data || []));
    } else {
      setProgramsList([]);
      setProgramId('');
    }
  }, [categoryId]);

  useEffect(() => {
    if (programId) {
      fetchProgramParticipants();
    } else {
      setProgramParticipants([]);
      setSelectedParticipantId('');
    }
  }, [programId]);

  const fetchUniqueStudents = async () => {
    try {
      const { data, error } = await supabase.from('participants').select('student_name, unit_name');
      if (error) throw error;
      if (data) {
        const unique = [];
        const seen = new Set();
        data.forEach(p => {
          const name = p.student_name?.trim();
          const unit = p.unit_name?.trim();
          if (name && unit) {
            const key = `${name.toLowerCase()}|||${unit.toLowerCase()}`;
            if (!seen.has(key)) {
              seen.add(key);
              unique.push({ student_name: name, unit_name: unit });
            }
          }
        });
        unique.sort((a, b) => a.student_name.localeCompare(b.student_name));
        setAllStudents(unique);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProgramParticipants = async () => {
    try {
      const { data, error } = await supabase.from('participants').select('*').eq('program_id', programId).order('student_name');
      if (error) throw error;
      setProgramParticipants(data || []);
      setSelectedParticipantId('');
    } catch (err) {
      addToast('Failed to fetch participants for this program', 'error');
    }
  };

  const handleCategoryChange = (e) => {
    setCategoryId(e.target.value);
    setProgramId('');
  };

  const handleExistingStudentChange = (e) => {
    const val = e.target.value;
    setSelectedExistingStudent(val);
    if (val) {
      const [name, unit] = val.split('|||');
      setStudentName(name);
      setUnitName(unit);
    } else {
      setStudentName('');
      setUnitName('');
    }
  };

  const handleAddParticipant = async (e) => {
    e.preventDefault();
    if (!programId) return addToast('Select a program first', 'error');
    if (!studentName.trim() || !unitName.trim()) return;

    setLoading(true);
    try {
      // Check if participant is already registered for this program
      const alreadyRegistered = programParticipants.some(
        p => p.student_name.toLowerCase().trim() === studentName.toLowerCase().trim()
      );
      if (alreadyRegistered) {
        throw new Error('This participant is already registered for this program');
      }

      const { error } = await supabase.from('participants').insert([{
        student_name: studentName.trim(),
        unit_name: unitName.trim(),
        program_id: programId
      }]);
      if (error) throw error;

      addToast('Participant added successfully');
      setStudentName('');
      setUnitName('');
      setSelectedExistingStudent('');
      
      // Refresh lists
      await fetchProgramParticipants();
      await fetchUniqueStudents();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteParticipant = async () => {
    if (!selectedParticipantId) return addToast('Select a participant to delete', 'error');
    
    try {
      const { error } = await supabase.from('participants').delete().eq('id', selectedParticipantId);
      if (error) throw error;
      
      addToast('Participant removed from program');
      setSelectedParticipantId('');
      
      // Refresh lists
      await fetchProgramParticipants();
      await fetchUniqueStudents();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const selectedProgram = programsList.find(p => p.id === programId);

  return (
    <div className="animate-fade-up">
      <h2 style={{ color: 'white', marginBottom: '24px' }}>Manage Participants</h2>
      
      <div className="glass-card form-grid results-filter-grid" style={{ padding: '24px', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ flex: 1 }}>
          <Select options={categories.map(c => ({ value: c.id, label: c.name }))} value={categoryId} onChange={handleCategoryChange} placeholder="Select Category" />
        </div>
        <div style={{ flex: 1 }}>
          <Select options={programsList.map(p => ({ value: p.id, label: p.name }))} value={programId} onChange={e => setProgramId(e.target.value)} placeholder="Select Program" disabled={!categoryId} />
        </div>
      </div>

      {programId && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* View / Delete Participants */}
          <div className="glass-card data-card" style={{ padding: '24px' }}>
            <h3 style={{ color: 'var(--gold-primary)', marginBottom: '20px' }}>Registered Participants</h3>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <Select 
                  options={programParticipants.map(p => ({ value: p.id, label: `${p.student_name} (${p.unit_name})` }))}
                  value={selectedParticipantId}
                  onChange={e => setSelectedParticipantId(e.target.value)}
                  placeholder={programParticipants.length === 0 ? "No participants registered" : "-- Select Participant --"}
                  disabled={programParticipants.length === 0}
                />
              </div>
              <button 
                type="button"
                onClick={handleDeleteParticipant}
                className="btn-primary" 
                style={{ background: 'var(--danger)', color: 'white', boxShadow: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                disabled={!selectedParticipantId}
              >
                <Trash2 size={18} /> Remove Participant
              </button>
            </div>

            {programParticipants.length > 0 ? (
              <div className="table-responsive">
                <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white', minWidth: '500px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                      <th style={{ padding: '12px', color: 'var(--text-secondary)' }}>Student Name</th>
                      <th style={{ padding: '12px', color: 'var(--text-secondary)' }}>Unit Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {programParticipants.map(p => (
                      <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: selectedParticipantId === p.id ? 'rgba(201, 168, 76, 0.1)' : 'transparent' }}>
                        <td style={{ padding: '12px', fontWeight: selectedParticipantId === p.id ? 600 : 400 }}>{p.student_name}</td>
                        <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{p.unit_name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>No participants registered for {selectedProgram?.name} yet.</p>
            )}
          </div>

          {/* Add Participant Form */}
          <div className="glass-card data-card" style={{ padding: '24px' }}>
            <h3 style={{ color: 'var(--gold-primary)', marginBottom: '20px' }}>Add Participant to Program</h3>
            
            <form onSubmit={handleAddParticipant} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Existing Student Autofill Dropdown */}
              {allStudents.length > 0 && (
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Select Existing Student (Autofill Name & Unit)</label>
                  <Select 
                    options={allStudents.map(s => ({ value: `${s.student_name}|||${s.unit_name}`, label: `${s.student_name} (${s.unit_name})` }))}
                    value={selectedExistingStudent}
                    onChange={handleExistingStudentChange}
                    placeholder="-- Or Select Existing Student to Autofill --"
                  />
                </div>
              )}

              <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Student Name</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Enter student name"
                    value={studentName} 
                    onChange={e => setStudentName(e.target.value)} 
                    required 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Unit Name</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Enter unit name"
                    value={unitName} 
                    onChange={e => setUnitName(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn-primary" disabled={loading || !studentName.trim() || !unitName.trim()}>
                  {loading ? 'Adding...' : 'Add Participant'}
                </button>
              </div>
            </form>
          </div>

        </div>
      )}
    </div>
  );
};

export default Admin;

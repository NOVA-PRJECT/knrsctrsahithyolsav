import React, { useState, useEffect, useCallback } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Home from './pages/Home'
import Results from './pages/Results'
import Search from './pages/Search'
import Admin from './pages/Admin'
import ConfirmModal from './components/ConfirmModal'
import { useToast } from './components/ToastContext'

const PublicGuard = ({ session, children, onRestricted }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      onRestricted();
      navigate('/admin', { replace: true });
    }
  }, [session, navigate, onRestricted]);

  if (session) return null;
  return children;
};

function App() {
  const [session, setSession] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setShowModal(false);
    addToast('Logged out successfully');
  };

  const handleRestricted = useCallback(() => {
    setShowModal(true);
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<PublicGuard session={session} onRestricted={handleRestricted}><Home /></PublicGuard>} />
        <Route path="/results" element={<PublicGuard session={session} onRestricted={handleRestricted}><Results /></PublicGuard>} />
        <Route path="/search" element={<PublicGuard session={session} onRestricted={handleRestricted}><Search /></PublicGuard>} />
        <Route path="/admin" element={<Admin session={session} />} />
      </Routes>
      
      <ConfirmModal 
        isOpen={showModal}
        title="Admin Restricted"
        message="You are currently signed in as an Admin. You must sign out to access public pages."
        onCancel={() => setShowModal(false)}
        onConfirm={handleSignOut}
        confirmText="Sign Out"
        confirmStyle={{ background: 'var(--gold-primary)', color: 'var(--bg-primary)' }}
      />
    </>
  )
}

export default App

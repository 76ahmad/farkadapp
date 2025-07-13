import React, { useState } from 'react';
import { auth } from '../../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';

function LoginView({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!email || !password) {
      setError('الرجاء إدخال البريد الإلكتروني وكلمة المرور.');
      setLoading(false);
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      onLogin({ uid: user.uid, email: user.email });
    } catch (err) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
      } else if (err.code === 'auth/invalid-email') {
        setError('صيغة البريد الإلكتروني غير صحيحة.');
      } else {
        setError('حدث خطأ أثناء تسجيل الدخول. الرجاء المحاولة مرة أخرى.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0B1A22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'none', padding: 0, borderRadius: 24, width: '100%', maxWidth: 400, textAlign: 'center' }}>
        {/* Logo */}
        <div style={{ marginBottom: 24 }}>
          <img src="/logo.png" alt="Logo" style={{ height: 120, margin: '0 auto', display: 'block' }} />
        </div>
        {/* App Name */}
        <div style={{ marginBottom: 32 }}>
          <span style={{ color: '#FFF6D6', fontSize: 48, fontWeight: 'bold', letterSpacing: 2 }}>BINA</span>
        </div>
        {/* Form */}
        <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 16 }}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#888' }}>
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z"/></svg>
            </span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px 14px 48px',
                borderRadius: 16,
                border: 'none',
                background: '#FFF6D6',
                fontSize: 18,
                color: '#222',
                outline: 'none',
                marginBottom: 0,
              }}
              required
            />
          </div>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#888' }}>
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px 14px 48px',
                borderRadius: 16,
                border: 'none',
                background: '#FFF6D6',
                fontSize: 18,
                color: '#222',
                outline: 'none',
                marginBottom: 0,
              }}
              required
            />
          </div>
          {error && <div style={{ color: '#ff3333', fontSize: 15 }}>{error}</div>}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: '#FF8800',
              color: '#fff',
              border: 'none',
              borderRadius: 16,
              padding: '16px 0',
              fontSize: 22,
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: 8,
              marginBottom: 0,
              transition: 'background 0.2s',
            }}
          >
            {loading ? '...جاري الدخول' : 'Log in'}
          </button>
        </form>
        {/* Sign up link */}
        <div style={{ marginTop: 16 }}>
          <span style={{ color: '#bdbdbd', fontSize: 18 }}>Don’t have an account? </span>
          <a href="/signup" style={{ color: '#FF8800', fontWeight: 'bold', fontSize: 18, textDecoration: 'none' }}>Sign up</a>
        </div>
      </div>
    </div>
  );
}

export default LoginView;


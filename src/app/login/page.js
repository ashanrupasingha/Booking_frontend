"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../utils/api';
import Link from 'next/link';

const inputStyle = {
  width: '100%',
  padding: '0.9rem 1rem',
  borderRadius: '12px',
  background: 'rgba(15, 23, 42, 0.6)',
  border: '1px solid rgba(99,102,241,0.3)',
  color: '#e2e8f0',
  fontSize: '0.95rem',
  outline: 'none',
  boxSizing: 'border-box',
  transition: '0.3s',
  boxShadow: 'inset 0 0 10px rgba(99,102,241,0.2)'
};

const labelStyle = {
  color: '#94a3b8',
  fontSize: '0.8rem',
  fontWeight: 500,
  display: 'block',
  marginBottom: '0.4rem'
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch('/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('email', data.email);
        router.push('/');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at top, #1e1b4b, #020617)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        fontFamily: "'Inter', sans-serif"
      }}>

        <div style={{
          width: '100%',
          maxWidth: '420px',
          background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(25px)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: '24px',
          padding: '2.5rem',
          boxShadow: '0 0 40px rgba(99,102,241,0.3)'
        }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '2.7rem' }}>🅿️</div>
            <h1 style={{ color: '#e0e7ff', fontSize: '1.9rem', fontWeight: 700 }}>
              Welcome Back
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
              Smart Parking System
            </p>
          </div>

          {/* Error */}
          {error && (
              <div style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.4)',
                borderRadius: '10px',
                padding: '0.7rem',
                color: '#f87171',
                fontSize: '0.85rem',
                marginBottom: '1.2rem',
                textAlign: 'center'
              }}>
                {error}
              </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

            <div>
              <label style={labelStyle}>Email Address</label>
              <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={inputStyle}
              />
            </div>

            {/* Button */}
            <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '0.9rem',
                  borderRadius: '12px',
                  background: loading
                      ? 'rgba(99,102,241,0.4)'
                      : 'linear-gradient(135deg, #6366f1, #22d3ee)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '1rem',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: '0.3s',
                  boxShadow: '0 0 20px rgba(99,102,241,0.6)'
                }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

          </form>

          {/* Footer */}
          <p style={{
            textAlign: 'center',
            color: '#64748b',
            fontSize: '0.8rem',
            marginTop: '1.5rem'
          }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" style={{ color: '#38bdf8', fontWeight: 600 }}>
              Register
            </Link>
          </p>

        </div>
      </div>
  );
}
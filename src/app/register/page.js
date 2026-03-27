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
  fontSize: '0.9rem',
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
  marginBottom: '0.3rem'
};

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: '', password: '', fullName: '', email: '', vehicleNumber: '', vehicleType: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch('/users/register', {
        method: 'POST',
        body: JSON.stringify(form),
      });

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('email', data.email);
        router.push('/');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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
        padding: '2rem 1rem',
        fontFamily: "'Inter', sans-serif"
      }}>

        <div style={{
          width: '100%',
          maxWidth: '500px',
          background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(25px)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: '24px',
          padding: '2.5rem',
          boxShadow: '0 0 40px rgba(99,102,241,0.3)'
        }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '2.8rem' }}>🚘</div>
            <h1 style={{ color: '#e0e7ff', fontSize: '1.9rem', fontWeight: 700 }}>
              Create Account
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
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Username</label>
                <input type="text" required value={form.username} onChange={update('username')} style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Full Name</label>
                <input type="text" required value={form.fullName} onChange={update('fullName')} style={inputStyle} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Email</label>
              <input type="email" required value={form.email} onChange={update('email')} style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <input type="password" required value={form.password} onChange={update('password')} style={inputStyle} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Vehicle Number</label>
                <input type="text" required value={form.vehicleNumber} onChange={update('vehicleNumber')} style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Vehicle Type</label>
                <select value={form.vehicleType} onChange={update('vehicleType')} required style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="">Select</option>
                  <option value="CAR">Car</option>
                  <option value="BIKE">Bike</option>
                  <option value="VAN">Van</option>
                  <option value="TRUCK">Truck</option>
                </select>
              </div>
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
                  cursor: 'pointer',
                  transition: '0.3s',
                  boxShadow: '0 0 20px rgba(99,102,241,0.6)'
                }}
            >
              {loading ? 'Creating...' : 'Create Account'}
            </button>

          </form>

          {/* Footer */}
          <p style={{
            textAlign: 'center',
            color: '#64748b',
            fontSize: '0.8rem',
            marginTop: '1.5rem'
          }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#38bdf8', fontWeight: 600 }}>
              Login
            </Link>
          </p>

        </div>
      </div>
  );
}
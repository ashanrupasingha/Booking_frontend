"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const cards = [
  { href: '/slots', icon: '🅿️', title: 'Available Slots', desc: 'View and book parking slots in real-time.', color: '#6366f1' },
  { href: '/bookings', icon: '📅', title: 'My Bookings', desc: 'Manage your active and past parking bookings.', color: '#8b5cf6' },
  { href: '/tickets', icon: '🎫', title: 'Ticket History', desc: 'View entry/exit times and payment history.', color: '#ec4899' },
];

export default function DashboardPage() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    const storedEmail = localStorage.getItem('email');
    setEmail(storedEmail || 'User');
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', fontFamily: "'Inter', sans-serif" }}>
      {/* Navbar */}
      <nav style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '0 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '64px', position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🅿️</span>
          <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.5px' }}>SPMS</span>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', marginLeft: '0.5rem' }}>Smart Parking</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{
            color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem',
            background: 'rgba(255,255,255,0.08)', padding: '0.4rem 0.85rem',
            borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)'
          }}>
            👤 {email}
          </span>
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#f87171', borderRadius: '8px', padding: '0.4rem 1rem',
              cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '4rem 1rem 2rem' }}>
        <h1 style={{ color: '#fff', fontSize: '2.5rem', fontWeight: 800, margin: 0, letterSpacing: '-1px' }}>
          Welcome to <span style={{ background: 'linear-gradient(135deg, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Smart Parking</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '1rem', fontSize: '1.05rem' }}>
          Manage your parking slots, bookings, and tickets seamlessly.
        </p>
      </div>

      {/* Cards */}
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {cards.map((card) => (
            <Link key={card.href} href={card.href} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px', padding: '2rem',
                cursor: 'pointer', transition: 'all 0.3s ease',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = card.color; e.currentTarget.style.boxShadow = `0 8px 30px rgba(0,0,0,0.3), 0 0 0 1px ${card.color}40`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)'; }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{card.icon}</div>
                <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', margin: '0 0 0.5rem' }}>{card.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', margin: 0 }}>{card.desc}</p>
                <div style={{
                  marginTop: '1.5rem', display: 'inline-block', fontSize: '0.8rem',
                  color: card.color, fontWeight: 600, letterSpacing: '0.5px'
                }}>
                  Open →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

"use client";
import { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';
import { useRouter } from 'next/navigation';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [releasing, setReleasing] = useState(null);
  const router = useRouter();

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) { router.push('/login'); return; }
    try {
      const data = await apiFetch(`/parking/bookings/${userId}`);
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRelease = async (bookingId) => {
    setReleasing(bookingId);
    try {
      await apiFetch(`/parking/release/${bookingId}`, { method: 'POST' });
      alert('✅ Slot released successfully!');
      fetchBookings();
    } catch (err) {
      alert('❌ ' + (err.message || 'Release failed'));
    } finally {
      setReleasing(null);
    }
  };

  const statusStyle = (status) => ({
    background: status === 'ACTIVE' ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.08)',
    color: status === 'ACTIVE' ? '#4ade80' : 'rgba(255,255,255,0.5)',
    border: `1px solid ${status === 'ACTIVE' ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.1)'}`,
    borderRadius: '20px', padding: '0.2rem 0.7rem', fontSize: '0.75rem', fontWeight: 600
  });

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', padding: '2rem 1.5rem', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>📅 My Bookings</h1>
          <button onClick={() => router.push('/')} style={{
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.7)', borderRadius: '8px', padding: '0.5rem 1rem',
            cursor: 'pointer', fontSize: '0.875rem'
          }}>← Dashboard</button>
        </div>

        {loading ? (
          <div style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '4rem' }}>Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px', padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            <p>No bookings found. <span style={{ color: '#818cf8', cursor: 'pointer' }} onClick={() => router.push('/slots')}>Book a slot →</span></p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {bookings.map((booking) => (
              <div key={booking.id} style={{
                background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px',
                padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ color: '#fff', fontWeight: 700 }}>
                      Booking #{String(booking.id).slice(-6)}
                    </span>
                    <span style={statusStyle(booking.status)}>{booking.status}</span>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', margin: 0 }}>
                    Slot: {booking.slotId}
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', margin: 0 }}>
                    {new Date(booking.bookingTime).toLocaleString()}
                  </p>
                </div>
                {booking.status === 'ACTIVE' && (
                  <button
                    onClick={() => handleRelease(booking.id)}
                    disabled={releasing === booking.id}
                    style={{
                      padding: '0.6rem 1.2rem', borderRadius: '10px',
                      background: releasing === booking.id ? 'rgba(239,68,68,0.3)' : 'rgba(239,68,68,0.85)',
                      color: '#fff', fontWeight: 700, border: 'none',
                      cursor: releasing === booking.id ? 'not-allowed' : 'pointer', fontSize: '0.875rem'
                    }}
                  >
                    {releasing === booking.id ? 'Releasing...' : 'Release'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

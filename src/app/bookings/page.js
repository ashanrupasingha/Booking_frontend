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
    background: status === 'ACTIVE'
        ? 'rgba(34,197,94,0.15)'
        : 'rgba(255,255,255,0.05)',
    color: status === 'ACTIVE'
        ? '#4ade80'
        : '#94a3b8',
    border: `1px solid ${status === 'ACTIVE'
        ? 'rgba(34,197,94,0.4)'
        : 'rgba(99,102,241,0.2)'}`,
    borderRadius: '20px',
    padding: '0.25rem 0.8rem',
    fontSize: '0.75rem',
    fontWeight: 600
  });

  return (
      <div style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at top, #1e1b4b, #020617)',
        padding: '2rem 1.5rem',
        fontFamily: "'Inter', sans-serif"
      }}>
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>

          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem'
          }}>
            <h1 style={{
              color: '#e0e7ff',
              fontSize: '2rem',
              fontWeight: 800
            }}>
              📅 My Bookings
            </h1>

            <button
                onClick={() => router.push('/')}
                style={{
                  background: 'rgba(15,23,42,0.6)',
                  border: '1px solid rgba(99,102,241,0.3)',
                  color: '#c7d2fe',
                  borderRadius: '10px',
                  padding: '0.5rem 1.2rem',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  transition: '0.3s',
                  boxShadow: '0 0 10px rgba(99,102,241,0.3)'
                }}
            >
              ← Dashboard
            </button>
          </div>

          {/* Loading */}
          {loading ? (
              <div style={{
                color: '#64748b',
                textAlign: 'center',
                padding: '4rem'
              }}>
                Loading bookings...
              </div>
          ) : bookings.length === 0 ? (

              /* Empty State */
              <div style={{
                background: 'rgba(15,23,42,0.6)',
                border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: '20px',
                padding: '3rem',
                textAlign: 'center',
                color: '#64748b',
                boxShadow: '0 0 30px rgba(99,102,241,0.2)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                <p>
                  No bookings found.{' '}
                  <span
                      style={{ color: '#38bdf8', cursor: 'pointer' }}
                      onClick={() => router.push('/slots')}
                  >
                Book a slot →
              </span>
                </p>
              </div>

          ) : (

              /* Booking List */
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.2rem'
              }}>
                {bookings.map((booking) => (
                    <div key={booking.id} style={{
                      background: 'rgba(15,23,42,0.7)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(99,102,241,0.2)',
                      borderRadius: '18px',
                      padding: '1.5rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      boxShadow: '0 0 25px rgba(99,102,241,0.2)'
                    }}>

                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.4rem'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.8rem'
                        }}>
                    <span style={{
                      color: '#e0e7ff',
                      fontWeight: 700
                    }}>
                      Booking #{String(booking.id).slice(-6)}
                    </span>

                          <span style={statusStyle(booking.status)}>
                      {booking.status}
                    </span>
                        </div>

                        <p style={{
                          color: '#94a3b8',
                          fontSize: '0.85rem',
                          margin: 0
                        }}>
                          Slot: {booking.slotId}
                        </p>

                        <p style={{
                          color: '#64748b',
                          fontSize: '0.8rem',
                          margin: 0
                        }}>
                          {new Date(booking.bookingTime).toLocaleString()}
                        </p>
                      </div>

                      {booking.status === 'ACTIVE' && (
                          <button
                              onClick={() => handleRelease(booking.id)}
                              disabled={releasing === booking.id}
                              style={{
                                padding: '0.6rem 1.3rem',
                                borderRadius: '10px',
                                background: releasing === booking.id
                                    ? 'rgba(239,68,68,0.3)'
                                    : 'linear-gradient(135deg, #ef4444, #f97316)',
                                color: '#fff',
                                fontWeight: 700,
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                boxShadow: '0 0 15px rgba(239,68,68,0.5)'
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
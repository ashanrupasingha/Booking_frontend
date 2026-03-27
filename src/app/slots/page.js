"use client";
import { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';
import { useRouter } from 'next/navigation';

export default function SlotsPage() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);
  const [seeding, setSeeding] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/parking/slots/available');
      setSlots(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedSlots = async () => {
    setSeeding(true);
    setMessage('');
    try {
      await apiFetch('/parking/slots/seed', { method: 'POST' });
      setMessage('✅ 10 sample slots added!');
      await fetchSlots();
    } catch (err) {
      setMessage('❌ ' + err.message);
    } finally {
      setSeeding(false);
    }
  };

  const handleBook = async (slotId) => {
    const userId = localStorage.getItem('userId');
    if (!userId) { router.push('/login'); return; }

    setBooking(slotId);
    setMessage('');
    try {
      await apiFetch(`/parking/book/${userId}/${slotId}`, { method: 'POST' });
      await apiFetch(`/tickets/generate/${userId}/${slotId}`, { method: 'POST' });

      setMessage('✅ Slot booked successfully!');
      await fetchSlots();
      setTimeout(() => router.push('/bookings'), 1500);
    } catch (err) {
      setMessage('❌ ' + (err.message || 'Booking failed'));
    } finally {
      setBooking(null);
    }
  };

  const floorColors = { G: '#6366f1', '1': '#8b5cf6', '2': '#ec4899' };

  return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
        padding: '2rem 1.5rem',
        fontFamily: "'Inter', sans-serif"
      }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>

          {/* HEADER */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem'
          }}>
            <div>
              <h1 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>
                🅿️ Available Parking Slots
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                {slots.length} slots available
              </p>
            </div>

            <button onClick={() => router.push('/')} style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.7)',
              borderRadius: '10px',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              transition: '0.2s'
            }}>
              ← Dashboard
            </button>
          </div>

          {/* MESSAGE */}
          {message && (
              <div style={{
                background: message.startsWith('✅')
                    ? 'rgba(34,197,94,0.15)'
                    : 'rgba(239,68,68,0.15)',
                border: `1px solid ${
                    message.startsWith('✅')
                        ? 'rgba(34,197,94,0.3)'
                        : 'rgba(239,68,68,0.3)'
                }`,
                borderRadius: '14px',
                padding: '0.9rem 1.2rem',
                marginBottom: '1.5rem',
                color: message.startsWith('✅') ? '#4ade80' : '#f87171'
              }}>
                {message}
              </div>
          )}

          {/* LOADING */}
          {loading ? (
              <div style={{
                textAlign: 'center',
                color: 'rgba(255,255,255,0.5)',
                padding: '4rem'
              }}>
                Loading slots...
              </div>

          ) : slots.length === 0 ? (

              /* EMPTY */
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '18px',
                padding: '3rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '3rem' }}>🅿️</div>
                <p style={{ color: 'rgba(255,255,255,0.5)' }}>
                  No slots available
                </p>

                <button onClick={handleSeedSlots} disabled={seeding} style={{
                  marginTop: '1rem',
                  padding: '0.8rem 1.6rem',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer'
                }}>
                  {seeding ? 'Adding...' : '➕ Add Slots'}
                </button>
              </div>

          ) : (

              /* GRID (kept same, just polished) */
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '1.2rem'
              }}>
                {slots.map((slot) => (
                    <div key={slot.id} style={{
                      background: 'rgba(255,255,255,0.05)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '18px',
                      padding: '1.4rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.8rem',
                      transition: 'transform 0.2s, border 0.2s'
                    }}>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}>
                  <span style={{ color: '#fff', fontWeight: 700 }}>
                    {slot.slotNumber}
                  </span>

                        <span style={{
                          color: floorColors[slot.floor] || '#6366f1',
                          fontSize: '0.75rem',
                          fontWeight: 600
                        }}>
                    Floor {slot.floor || 'G'}
                  </span>
                      </div>

                      <span style={{
                        color: '#4ade80',
                        fontSize: '0.8rem'
                      }}>
                  ● Available
                </span>

                      <button
                          onClick={() => handleBook(slot.id)}
                          disabled={booking === slot.id}
                          style={{
                            marginTop: '0.5rem',
                            padding: '0.7rem',
                            borderRadius: '10px',
                            background: booking === slot.id
                                ? 'rgba(99,102,241,0.3)'
                                : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            color: '#fff',
                            border: 'none',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                      >
                        {booking === slot.id ? 'Booking...' : 'Book'}
                      </button>

                    </div>
                ))}
              </div>
          )}
        </div>
      </div>
  );
}
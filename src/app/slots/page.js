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
      console.error('Failed to load slots:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add 10 sample slots for testing
  const handleSeedSlots = async () => {
    setSeeding(true);
    setMessage('');
    try {
      await apiFetch('/parking/slots/seed', { method: 'POST' });
      setMessage('✅ 10 sample slots added! Refreshing...');
      await fetchSlots();
    } catch (err) {
      setMessage('❌ ' + err.message);
    } finally {
      setSeeding(false);
    }
  };

  // Book slot AND generate ticket in one flow
  const handleBook = async (slotId) => {
    const userId = localStorage.getItem('userId');
    if (!userId) { router.push('/login'); return; }

    setBooking(slotId);
    setMessage('');
    try {
      // Step 1: Book the parking slot
      await apiFetch(`/parking/book/${userId}/${slotId}`, { method: 'POST' });

      // Step 2: Generate a ticket for entry tracking
      await apiFetch(`/tickets/generate/${userId}/${slotId}`, { method: 'POST' });

      setMessage('✅ Slot booked and entry ticket generated!');
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
      padding: '2rem 1.5rem', fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>🅿️ Available Parking Slots</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '0.3rem', fontSize: '0.875rem' }}>
              {slots.length} slot{slots.length !== 1 ? 's' : ''} available right now
            </p>
          </div>
          <button onClick={() => router.push('/')} style={{
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.7)', borderRadius: '8px', padding: '0.5rem 1rem',
            cursor: 'pointer', fontSize: '0.875rem'
          }}>← Dashboard</button>
        </div>

        {/* Message Banner */}
        {message && (
          <div style={{
            background: message.startsWith('✅') ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
            border: `1px solid ${message.startsWith('✅') ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
            borderRadius: '12px', padding: '0.85rem 1.25rem',
            color: message.startsWith('✅') ? '#4ade80' : '#f87171',
            fontSize: '0.9rem', marginBottom: '1.5rem', fontWeight: 500
          }}>{message}</div>
        )}

        {/* Loading State */}
        {loading ? (
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', padding: '5rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
            Loading available slots...
          </div>

        /* Empty State with Seed Button */
        ) : slots.length === 0 ? (
          <div style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px', padding: '4rem 2rem', textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🅿️</div>
            <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: '0.5rem' }}>No Slots Available</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2rem', fontSize: '0.9rem' }}>
              The parking lot is empty. Add sample slots to get started.
            </p>
            <button
              onClick={handleSeedSlots}
              disabled={seeding}
              style={{
                padding: '0.9rem 2rem', borderRadius: '12px',
                background: seeding ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff', fontWeight: 700, fontSize: '1rem', border: 'none',
                cursor: seeding ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 20px rgba(99,102,241,0.4)'
              }}
            >
              {seeding ? '⏳ Adding Slots...' : '➕ Add 10 Sample Slots'}
            </button>
          </div>

        /* Slots Grid */
        ) : (
          <>
            {/* Add More Slots button when some exist */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
              <button
                onClick={handleSeedSlots}
                disabled={seeding}
                style={{
                  padding: '0.5rem 1rem', borderRadius: '8px',
                  background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)',
                  color: '#818cf8', fontWeight: 600, fontSize: '0.8rem',
                  cursor: seeding ? 'not-allowed' : 'pointer'
                }}
              >
                {seeding ? 'Adding...' : '➕ Add More Slots'}
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '1.25rem'
            }}>
              {slots.map((slot) => (
                <div key={slot.id} style={{
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px', padding: '1.5rem',
                  display: 'flex', flexDirection: 'column', gap: '1rem',
                  transition: 'border-color 0.2s'
                }}>
                  {/* Slot Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.2rem' }}>{slot.slotNumber}</span>
                    <span style={{
                      background: `${floorColors[slot.floor] || '#6366f1'}22`,
                      color: floorColors[slot.floor] || '#6366f1',
                      border: `1px solid ${floorColors[slot.floor] || '#6366f1'}44`,
                      borderRadius: '20px', padding: '0.2rem 0.65rem',
                      fontSize: '0.75rem', fontWeight: 700
                    }}>Floor {slot.floor || 'G'}</span>
                  </div>

                  {/* Status */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem'
                  }}>
                    <span style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      background: '#22c55e', display: 'inline-block'
                    }}></span>
                    Available
                  </div>

                  {/* Book Button */}
                  <button
                    onClick={() => handleBook(slot.id)}
                    disabled={booking === slot.id}
                    style={{
                      padding: '0.75rem', borderRadius: '10px', width: '100%',
                      background: booking === slot.id
                        ? 'rgba(99,102,241,0.3)'
                        : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      color: '#fff', fontWeight: 700, border: 'none',
                      cursor: booking === slot.id ? 'not-allowed' : 'pointer',
                      fontSize: '0.9rem', transition: 'opacity 0.2s',
                      boxShadow: '0 4px 15px rgba(99,102,241,0.3)'
                    }}
                  >
                    {booking === slot.id ? '⏳ Booking...' : '🚗 Book Now'}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

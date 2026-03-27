"use client";
import { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';
import { useRouter } from 'next/navigation';

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(null);
  const router = useRouter();

  useEffect(() => { fetchTickets(); }, []);

  const fetchTickets = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) { router.push('/login'); return; }
    try {
      const data = await apiFetch(`/tickets/user/${userId}`);
      setTickets(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExit = async (ticketId) => {
    setPaying(ticketId);
    try {
      await apiFetch(`/tickets/exit/${ticketId}`, { method: 'POST' });
      alert('✅ Exit processed successfully!');
      fetchTickets();
    } catch (err) {
      alert('❌ ' + (err.message || 'Failed to process exit'));
    } finally {
      setPaying(null);
    }
  };

  const statusStyle = (status) => ({
    background: status === 'PAID' ? 'rgba(34,197,94,0.15)' : 'rgba(251,146,60,0.15)',
    color: status === 'PAID' ? '#4ade80' : '#fb923c',
    border: `1px solid ${status === 'PAID' ? 'rgba(34,197,94,0.3)' : 'rgba(251,146,60,0.3)'}`,
    borderRadius: '20px',
    padding: '0.25rem 0.8rem',
    fontSize: '0.75rem',
    fontWeight: 600
  });

  return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
        padding: '2rem 1.5rem',
        fontFamily: "'Inter', sans-serif"
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>

          {/* HEADER */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem'
          }}>
            <h1 style={{
              color: '#fff',
              fontSize: '1.9rem',
              fontWeight: 800,
              margin: 0
            }}>
              🎫 Ticket History
            </h1>

            <button
                onClick={() => router.push('/')}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'rgba(255,255,255,0.7)',
                  borderRadius: '10px',
                  padding: '0.5rem 1.1rem',
                  cursor: 'pointer'
                }}
            >
              ← Dashboard
            </button>
          </div>

          {/* LOADING */}
          {loading ? (
              <div style={{
                color: 'rgba(255,255,255,0.5)',
                textAlign: 'center',
                padding: '4rem'
              }}>
                Loading tickets...
              </div>

          ) : tickets.length === 0 ? (

              /* EMPTY STATE */
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '18px',
                padding: '3rem',
                textAlign: 'center',
                color: 'rgba(255,255,255,0.5)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎟️</div>
                <p>No tickets found yet.</p>
              </div>

          ) : (

              /* TICKETS LIST */
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                {tickets.map((ticket) => (
                    <div key={ticket.id} style={{
                      background: 'rgba(255,255,255,0.05)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '18px',
                      padding: '1.4rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>

                      {/* LEFT */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.4rem'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.7rem'
                        }}>
                    <span style={{
                      color: '#fff',
                      fontWeight: 700
                    }}>
                      Ticket #{String(ticket.id).slice(-6)}
                    </span>

                          <span style={statusStyle(ticket.status)}>
                      {ticket.status}
                    </span>
                        </div>

                        <p style={{
                          color: 'rgba(255,255,255,0.5)',
                          fontSize: '0.85rem',
                          margin: 0
                        }}>
                          Slot: {ticket.slotId}
                        </p>

                        <p style={{
                          color: 'rgba(255,255,255,0.4)',
                          fontSize: '0.8rem',
                          margin: 0
                        }}>
                          Entry: {new Date(ticket.entryTime).toLocaleString()}
                        </p>

                        {ticket.exitTime && (
                            <p style={{
                              color: 'rgba(255,255,255,0.4)',
                              fontSize: '0.8rem',
                              margin: 0
                            }}>
                              Exit: {new Date(ticket.exitTime).toLocaleString()}
                            </p>
                        )}

                        {ticket.amount && (
                            <p style={{
                              color: '#4ade80',
                              fontWeight: 700,
                              margin: '0.3rem 0 0 0'
                            }}>
                              💰 ${ticket.amount.toFixed(2)}
                            </p>
                        )}
                      </div>

                      {/* RIGHT BUTTON */}
                      {ticket.status === 'PENDING' && (
                          <button
                              onClick={() => handleExit(ticket.id)}
                              disabled={paying === ticket.id}
                              style={{
                                padding: '0.6rem 1.2rem',
                                borderRadius: '10px',
                                background: paying === ticket.id
                                    ? 'rgba(99,102,241,0.4)'
                                    : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                color: '#fff',
                                fontWeight: 700,
                                border: 'none',
                                cursor: paying === ticket.id ? 'not-allowed' : 'pointer'
                              }}
                          >
                            {paying === ticket.id ? 'Processing...' : 'Pay & Exit'}
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
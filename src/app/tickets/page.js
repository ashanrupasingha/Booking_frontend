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
    borderRadius: '20px', padding: '0.2rem 0.7rem', fontSize: '0.75rem', fontWeight: 600
  });

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', padding: '2rem 1.5rem', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>🎫 Ticket History</h1>
          <button onClick={() => router.push('/')} style={{
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.7)', borderRadius: '8px', padding: '0.5rem 1rem',
            cursor: 'pointer', fontSize: '0.875rem'
          }}>← Dashboard</button>
        </div>

        {loading ? (
          <div style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '4rem' }}>Loading tickets...</div>
        ) : tickets.length === 0 ? (
          <div style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px', padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎟️</div>
            <p>No tickets found yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {tickets.map((ticket) => (
              <div key={ticket.id} style={{
                background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '1.5rem',
                display: 'flex', flexDirection: 'column', gap: '1rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#fff', fontWeight: 700 }}>Ticket #{ticket.id}</span>
                  <span style={statusStyle(ticket.status)}>{ticket.status}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>Slot</span>
                    <span style={{ color: '#fff', fontSize: '0.875rem', fontWeight: 600 }}>{ticket.slotId}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>Entry</span>
                    <span style={{ color: '#fff', fontSize: '0.875rem' }}>{new Date(ticket.entryTime).toLocaleString()}</span>
                  </div>
                  {ticket.exitTime && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>Exit</span>
                      <span style={{ color: '#fff', fontSize: '0.875rem' }}>{new Date(ticket.exitTime).toLocaleString()}</span>
                    </div>
                  )}
                  {ticket.amount && (
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
                      <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>Total Fee</span>
                      <span style={{ color: '#4ade80', fontWeight: 800, fontSize: '1.1rem' }}>${ticket.amount.toFixed(2)}</span>
                    </div>
                  )}
                </div>
                {ticket.status === 'PENDING' && (
                  <button
                    onClick={() => handleExit(ticket.id)}
                    disabled={paying === ticket.id}
                    style={{
                      padding: '0.7rem', borderRadius: '10px',
                      background: paying === ticket.id ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      color: '#fff', fontWeight: 700, border: 'none',
                      cursor: paying === ticket.id ? 'not-allowed' : 'pointer', fontSize: '0.875rem'
                    }}
                  >
                    {paying === ticket.id ? 'Processing...' : 'Process Exit & Pay'}
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

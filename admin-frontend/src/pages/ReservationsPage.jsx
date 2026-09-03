import React, { useEffect, useState } from 'react';
import api, { getImageUrl } from '../services/api';

const ReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/reservations/host');
      setReservations(response.data.data || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: '60px' }}>Loading reservations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerRowStyle}>
        <h1 style={titleStyle}>Reservations</h1>
      </div>

      {reservations.length === 0 ? (
        <div style={emptyStateStyle}>No reservations yet.</div>
      ) : (
        <div style={tableWrapperStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Property</th>
                <th style={thStyle}>Guest</th>
                <th style={thStyle}>Dates</th>
                <th style={thStyle}>Guests</th>
                <th style={thStyle}>Total</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation._id} style={trStyle}>
                  <td style={tdStyle}>
                    <div style={propertyCellStyle}>
                      {reservation.accommodation?.images?.[0] ? (
                        <img src={getImageUrl(reservation.accommodation.images[0])} alt={reservation.accommodation?.title || 'Accommodation'} style={thumbStyle} />
                      ) : (
                        <div style={thumbStyle}>No Image</div>
                      )}
                      <div>
                        <div style={{ fontWeight: 600 }}>{reservation.accommodation?.title || 'Listing'}</div>
                        <div style={{ color: '#717171', fontSize: '12px' }}>{reservation.accommodation?.location || ''}</div>
                      </div>
                    </div>
                  </td>
                  <td style={tdStyle}>{reservation.user?.username || reservation.user?.email || 'Guest'}</td>
                  <td style={tdStyle}>
                    {new Date(reservation.checkIn).toLocaleDateString()} - {new Date(reservation.checkOut).toLocaleDateString()}
                  </td>
                  <td style={tdStyle}>{reservation.guests}</td>
                  <td style={tdStyle}>R{reservation.totalCost || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const containerStyle = {
  padding: '40px 24px',
};

const headerRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '24px',
};

const titleStyle = {
  fontSize: '28px',
  fontWeight: 700,
};

const tableWrapperStyle = {
  background: 'white',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
};

const thStyle = {
  textAlign: 'left',
  padding: '16px',
  background: '#f7f7f7',
  color: '#717171',
  fontSize: '12px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const trStyle = {
  borderBottom: '1px solid #ebebeb',
};

const tdStyle = {
  padding: '16px',
  verticalAlign: 'middle',
};

const propertyCellStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
};

const thumbStyle = {
  width: '64px',
  height: '48px',
  objectFit: 'cover',
  borderRadius: '8px',
};

const emptyStateStyle = {
  background: 'white',
  borderRadius: '12px',
  padding: '60px 24px',
  textAlign: 'center',
  color: '#717171',
};

export default ReservationsPage;

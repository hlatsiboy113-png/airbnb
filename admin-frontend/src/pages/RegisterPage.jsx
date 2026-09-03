import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await register(form.username, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle} className="card">
        <h1>Create account</h1>
        <p>Join the Airbnb community.</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label htmlFor="username">Name</label><input id="username" required minLength="2" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} /></div>
          <div className="form-group"><label htmlFor="email">Email</label><input id="email" type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></div>
          <div className="form-group"><label htmlFor="password">Password</label><input id="password" type="password" required minLength="6" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></div>
          <div className="form-group"><label htmlFor="confirmPassword">Confirm password</label><input id="confirmPassword" type="password" required value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} /></div>
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Creating account...' : 'Create account'}</button>
        </form>
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/')} style={{ marginTop: '12px' }}>Back to home</button>
      </div>
    </div>
  );
};

const pageStyle = { minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' };
const cardStyle = { width: '100%', maxWidth: '460px', padding: '32px' };

export default RegisterPage;

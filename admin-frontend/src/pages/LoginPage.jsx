import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '', role: 'admin' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError('');
    try {
      const user = await login(formData.email, formData.password, formData.role);
      const publicUrl = process.env.REACT_APP_PUBLIC_URL || 'https://airbnb-guest.onrender.com';
      const token = localStorage.getItem('token');
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'host') navigate('/host/dashboard');
      else window.location.assign(`${publicUrl}?token=${encodeURIComponent(token)}`);
    } catch (error) {
      if (!error.response) {
        setApiError('Unable to reach the server. Please try again later.');
      } else {
        setApiError(error.response?.data?.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">WELCOME BACK</h1>
        <div className="role-picker" role="group" aria-labelledby="workspace-login-role-label">
          <span id="workspace-login-role-label" className="role-picker-label">Choose your sign-in role</span>
          <div className="role-options">
            {[['guest', 'Guest', 'Find and book stays'], ['host', 'Host', 'Manage your listings'], ['admin', 'Administrator', 'Manage the platform']].map(([value, label, description]) => (
              <label key={value} className={`role-option ${formData.role === value ? 'is-selected' : ''}`}>
                <input type="radio" name="role" value={value} checked={formData.role === value} onChange={handleChange} />
                <span><strong>{label}</strong><small>{description}</small></span>
              </label>
            ))}
          </div>
        </div>

        {apiError && <div className="alert alert-error">{apiError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" className={errors.email ? 'error-border' : ''} />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" className={errors.password ? 'error-border' : ''} />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>
          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

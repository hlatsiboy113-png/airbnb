import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const roles = ['user', 'host', 'admin'];

const ManageUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/users');
      setUsers(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'We could not load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const updateRole = async (id, role) => {
    const existing = users.find((user) => user._id === id);
    if (existing?.role === role) return;
    try {
      setUpdatingId(id);
      setError('');
      const response = await api.patch(`/users/${id}/role`, { role });
      setUsers((current) => current.map((user) => (user._id === id ? response.data.data : user)));
      setNotice(`${response.data.data.username}'s role is now ${role}.`);
    } catch (err) {
      setError(err.response?.data?.message || 'The role could not be updated.');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <section className="workspace-shell"><div className="workspace-skeleton" role="status">Loading users…</div></section>;

  return (
    <section className="workspace-shell">
      <div className="workspace-heading"><div><p className="workspace-eyebrow">Platform access</p><h1>Manage users</h1><p className="workspace-subtitle">Assign access deliberately to keep the marketplace healthy.</p></div></div>
      {error && <div className="alert alert-error" role="alert">{error}<button type="button" onClick={loadUsers}>Try again</button></div>}
      {notice && <div className="alert alert-success" role="status">{notice}</div>}
      <div className="listing-table-wrap">
        <table className="listing-table users-table">
          <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead>
          <tbody>{users.map((user) => {
            const isSelf = user._id === currentUser?._id;
            return <tr key={user._id}>
              <td data-label="User"><strong>{user.username}</strong>{isSelf && <span className="self-badge">You</span>}</td>
              <td data-label="Email">{user.email}</td>
              <td data-label="Role"><select aria-label={`Change ${user.username}'s role`} disabled={updatingId === user._id || isSelf} value={user.role} onChange={(event) => updateRole(user._id, event.target.value)}>{roles.map((role) => <option key={role} value={role}>{role[0].toUpperCase() + role.slice(1)}</option>)}</select>{isSelf && <small className="field-note">Your admin role is protected.</small>}</td>
              <td data-label="Joined">{user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</td>
            </tr>;
          })}</tbody>
        </table>
      </div>
    </section>
  );
};

export default ManageUsers;

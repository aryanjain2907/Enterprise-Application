import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('Employee');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
     
      const response = await axios.post('http://localhost:3000/api/auth/login', { 
        email, 
        password,
        role: selectedRole 
      });
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      
      if (user.role === 'Admin') navigate('/admin/dashboard',{ state: { user } });
      else if (user.role === 'HR_Manager') navigate('/hr/dashboard',{ state: { user } });
      else navigate('/employee/dashboard',{ state: { user } });

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  
  const buttonStyle = (role) => ({
    flex: 1,
    padding: '10px',
    margin: '0 5px',
    backgroundColor: selectedRole === role ? '#007bff' : '#f0f0f0',
    color: selectedRole === role ? '#fff' : '#000',
    border: '1px solid #ccc',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: selectedRole === role ? 'bold' : 'normal',
    transition: 'all 0.2s ease'
  });

  return (
    <>
    <div style={{display:'flex'}}>
    <div>
      
    </div>
    <div style={{ maxWidth: '450px', margin: '80px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Portal Login</h2>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
        <button type="button" style={buttonStyle('Employee')} onClick={() => setSelectedRole('Employee')}>
          Employee Login
        </button>
        <button type="button" style={buttonStyle('HR_Manager')} onClick={() => setSelectedRole('HR_Manager')}>
          HR Login
        </button>
        <button type="button" style={buttonStyle('Admin')} onClick={() => setSelectedRole('Admin')}>
          Admin Login
        </button>
      </div>

      <p style={{ textAlign: 'center', color: '#666' }}>Logging in as: <strong>{selectedRole}</strong></p>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email Address:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>
        <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer' }}>
          Sign In
        </button>
      </form>
    </div>
    </div>
    </>
  );
};

export default Login;
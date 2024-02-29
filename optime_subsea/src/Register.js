import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style/Registerstyle.css'

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:1226/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
          role: userRole, // Assuming userRole is a state variable holding the role
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        navigate('/home')
        console.log('Registration successful', data);
        // Handle successful registration (e.g., navigate to login page)
      } else {
        console.error('Registration failed', data.message);
        // Handle registration failure (e.g., show error message)
      }
    } catch (error) {
      console.error('Error submitting form', error);
      // Handle network errors (e.g., show error message)
    }
  };
  

  return (
    <div className="background-container">
    <form onSubmit={handleSubmit} className="form-container">
      <div className="mb-4">
        <label htmlFor="username" className="form-label">Enter Username</label>
        <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="form-input" />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="form-label">Enter Password</label>
        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-input" />
      </div>
      <div className="mb-4">
        <label htmlFor="role" className="form-label"> Select User Role</label>
        <select id="role" value={userRole} onChange={(e) => setUserRole(e.target.value)} className="form-select">
          <option value="">Select a role</option>
          <option value="supervisor">Supervisor</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <button type="submit" className="submit-button">Register</button>
    </form>
    </div>
  );
}

export default Register;


import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/signup', { name, email, password });
      navigate('/dashboard');
    } catch (error) {
      alert('Signup failed');
    }
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-4">
        <h2 className="text-center">Signup</h2>
        <form onSubmit={handleSignup}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <small className="form-text text-muted">
              Password must be at least 6 characters long.
            </small>
          </div>
          <button type="submit" className="btn btn-primary m-3">Signup</button>
          <button type = 'buttton ' className='btn btn-info m-3 text-light' onClick = { () => navigate('/login')}>Already have an account? Login here</button>
        </form>
        
      </div>
    </div>
  );
};

export default Signup;
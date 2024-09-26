
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login'); // Redirect to login if no token is found
        return;
      }
      
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        setName(response.data.name);
        setEmail(response.data.email);
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Handle error (e.g., show a message, redirect, etc.)
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/profile`, { name, email }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUser({ ...user, name, email });
  };
  const handleDashboard = () => {
    navigate('/dashboard');
}

  return (
    <div>
      <h1 className="text-center m-3 mb-3 text-info">Simple Todos</h1>
      <h2 className="text-center mt-4">Profile</h2>
      <form onSubmit={handleUpdateProfile}>
        <div className='d-flex justify-content-end'>
        <button className='btn btn-info m-3 text-light' onClick={handleDashboard}>Todo list</button>
        </div>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary">Update</button>
      </form>
    </div>
  );
};

export default Profile;
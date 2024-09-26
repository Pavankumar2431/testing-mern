import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { RiDeleteBinLine } from 'react-icons/ri'; 

const Dashboard = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('Pending');
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editStatus, setEditStatus] = useState('Pending');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTodos = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login'); // Redirect to login if no token is found
        return;
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/todos`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTodos(response.data);
      } catch (error) {
        console.error('Error fetching todos:', error.response.data.message || error.message);
      }
    };
    fetchTodos();
  }, [navigate]);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    console.log(token)
    if (!token) {
      navigate('/login');
      return;
    }

    try {
        const response = await axios.post('http://localhost:5000/api/todos', { title, status }, {
            headers: { Authorization: `Bearer ${token}` }
        });
      setTodos([...todos, response.data]);
      setTitle('');
      setStatus('Pending');
    } catch (error) {
      console.error('Error adding todo:', error.response.data.message || error.message);
    }
  };

  const handleEditTodo = (todo) => {
    setEditId(todo.id);
    setEditTitle(todo.title);
    setEditStatus(todo.status);
  };

  const handleUpdateTodo = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:5000/api/todos/${editId}`, { title: editTitle, status: editStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedTodos = todos.map(todo => (todo.id === editId ? response.data : todo));
      setTodos(updatedTodos);
      setEditId(null);
      setEditTitle('');
      setEditStatus('Pending');
    } catch (error) {
      console.error('Error updating todo:', error.response.data.message || error.message);
    }
  };

  const handleDeleteTodo = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error.response.data.message || error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token from local storage
    navigate('/login'); // Redirect to login
  };

  return (
    <div>
      <h2 className="text-center mt-4">Todo List</h2>
      <div className='d-flex justify-content-end'>
        <button className="btn btn-danger mb-3" onClick={handleLogout}>Logout</button>
      </div>
      
    
      <form onSubmit={handleAddTodo}>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Add new todo"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <button className="btn btn-success" type="submit">Add</button>
        </div>
      </form>

     
      {editId && (
        <form onSubmit={handleUpdateTodo}>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              required
            />
            <select className="form-select" value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <button className="btn btn-warning" type="submit">Update</button>
            <button type="button" className="btn btn-secondary" onClick={() => setEditId(null)}>Cancel</button>
          </div>
        </form>
      )}

 
      <ul className="list-group">
        {todos.map(todo => (
          <li key={todo.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{todo.title} ({todo.status})</span>
            <div>
              <button className="btn btn-info m-2" onClick={() => handleEditTodo(todo)}>Edit</button>
              <button className="btn btn-outline-none " onClick={() => handleDeleteTodo(todo.id)}>
                <RiDeleteBinLine />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
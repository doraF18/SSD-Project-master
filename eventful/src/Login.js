import React, { useState, useEffect } from 'react';
import { Route, Routes} from 'react-router';
import { Link,  useNavigate } from 'react-router-dom';
import axios from 'axios';
import Register from './Register';
import Logged from './Logged';
import './Navbar.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    // Fetch users data from the URL when the component mounts
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://apex.oracle.com/pls/apex/laluna/login/get');
        setUsers(response.data.items);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleLogin = (event) => {
    event.preventDefault();
  
    // Find user with matching email and password
    const user = users.find(u => u.email === email && u.password === password && u.role === role);
  
    if (user) {
      let token;
      if (user.role === 'Submitter') {
        token = 'submitter_token'; // Generate token for submitter
      } else if (user.role === 'Attendee') {
        token = 'attendee_token'; // Generate token for attendee
      }
      localStorage.setItem('token', token);
      setMessage('Login successful');
      navigate('/logged');
    } else {
      setMessage('Invalid credentials');
    }
  };
  

  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/register', {
        email,
        password,
        role
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error connecting to the server');
    }
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  return (
    <>
      <div className="row">
        <div className="col-2"></div>
        <div className="col-8">
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-text" >
                Email address
              </label>
              <input
                type="email"
                className="form-control" 
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div id="emailHelp" className="form-text">
                We'll never share your email with anyone else.
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control normal-font"
                id="exampleInputPassword1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Role</label>
              <div>
                <input
                  type="radio"
                  id="submitter"
                  name="role"
                  value="Submitter"
                  checked={role === 'Submitter'}
                  onChange={handleRoleChange}
                />
                <label htmlFor="submitter">Submitter</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="Attendee"
                  name="role"
                  value="Attendee"
                  checked={role === 'Attendee'}
                  onChange={handleRoleChange}
                />
                <label htmlFor="Attendee">Attendee</label>
              </div>
            </div>
            <br />
            <button type="submit" className="btn btn-success">
              Login
            </button>
            <button type="button" className="btn btn-success" style={{ marginLeft: '10px' }}>
              <Link className="nav-link active" to="/register">Register</Link>
            </button>
          </form>
          {message && <div className="alert alert-info mt-3">{message}</div>}
        </div>
        <div className="col-2"></div>
      </div>

      <Routes>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/logged' element={<Logged />}></Route> {/* Route for Logged component */}
      </Routes>
    </>
  );
}

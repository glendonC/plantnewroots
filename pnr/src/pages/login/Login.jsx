import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Transition from "../../components/transition/Transition";
import './login.css';
import Swal from 'sweetalert2'; 

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        console.log('Login successful', data);

        // Store user data in local storage
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('userId', data.userId);
        login();
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Login successful',
          showConfirmButton: false,
          timer: 1000
        });
        navigate('/home');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Login error. Please check your credentials and try again.',
        });
        console.error('Login error:', data.message);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error during login. Please try again later.',
      });
      console.error('Error during login:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="hero-image-wrapper wrapper">
        <img className="front-img" src="./login.jpg" alt="" />
      </div>

      <div className="content-wrapper wrapper">
        <nav>
          <p>From tiny seedlings grow <a href="#">mighty trees.</a></p>
        </nav>
        <header>
        <h1>Login</h1>
          <div className="form-wrapper">
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">login</button>
            </form>
            <p>"Plant new roots with courage, for in the soil of change, opportunities bloom."</p>
            <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
            <p>Forgot your password? <Link to="/password-reset">Reset it</Link></p>
          </div>
        </header>
        <footer className="footer-typing">
          Plant your roots today.
        </footer>
      </div>
    </div>
  );
}

export default Transition(Login);

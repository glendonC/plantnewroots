import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Transition from "../../components/transition/Transition";
import './signup.css';
import signupImage from './signup.jpg';
import Swal from 'sweetalert2';

function SignUp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        //console.log('Sign up successful', data);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Sign up successful',
          showConfirmButton: false,
          timer: 2000
        });
        navigate('/login');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Sign up failed');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Sign up failed. Please try again.',
      });
      console.error('Error during sign up:', error.message);
    }
  };

  return (
    <div className="signup-container">
      <div className="hero-image-wrapper wrapper">
        <img className="front-img" src={signupImage} alt="" />
      </div>
      <div className="content-wrapper wrapper">
        <nav>
          <p>From tiny seedlings grow <a href="#">mighty trees.</a></p>
        </nav>
        <header>
          <h1>Signup</h1>
          <div className="form-wrapper">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
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
              <button type="submit">signup</button>
            </form>
            <p>"Plant new roots with courage, for in the soil of change, opportunities bloom."</p>
            <p>Already have an account? <Link to="/login">Login</Link></p>
          </div>
        </header>
        <footer className="footer-typing">
          <p>
            Plant your roots <span className="footer-span">today</span>.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default Transition(SignUp);

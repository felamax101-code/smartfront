//import useState hook-manages the form data
import { useState } from 'react';
//moving between pages
import { useNavigate, Link } from 'react-router-dom';
//import the api service
import { authApi } from '../services/api';
function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  //use navigate- facilitate redirect to other pages
  const navigate = useNavigate
  //handles form submitting
  const handleLogin = async (e) => {
    //prevent page from refeshing on form submit since html forms refresh on submitting
    e.preventDefault();
    //Basic Validation
    if (!phone || !password) {
      setError("Please fill in all the fields");
      return;
    }
    //start loading
    setIsLoading(true);
    setError(null);
    try {
      //call backend
      const response = await authApi.login(phone, password);
      //save tokens to lacal storage
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      //redirect to feed
      navigate('feed');
    } catch (err) {
      //Django returned an error
      setError('Invalid credentials')
    } finally {
      //Always stop loading
      setIsLoading(false);
    }
  
};
//UI
return (
  <div className="auth-container">
    {/*logo*/}
    <div className="auth-logo">
      <h1>Jamii</h1>
      <p>Connect with kenyans</p>
    </div>
    {/*form*/}
    <form onSubmit={handleLogin} className="auth-form">
      {/*Error message*/}
      {error &&(
      <div className="error-message">
        {error}
      </div>
        )}
        {/*phone input*/}
        <div classNmae="form-group">
          <lable>Phone number</lable>
          <input
          type="tell"
          placeholder="+25412345678"
          value={phone}
          onChange={(e)=>setPhone(e.target.value)}
          />
        </div>
        {/*password input*/}
        <div className ="form-group">
          <lable>Password</lable>
          <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}/>
        </div>
        {/*submit button*/}
        <button
        type="submit"
        disabled={isLoading}
        className="btn-primary">
          {isLoading? 'Logging in...':'login'}
        </button>
        {/*link to register*/}
        <p className="auth-link">
          Don't have an account?{' '}
          <Link to ="/register">Register here</Link>
        </p>
    </form>
  </div>
);
}
export default LoginPage
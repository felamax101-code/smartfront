import {useState} from 'react';
import {useNavigate,Link} from 'react-router-dom';
import {authApi} from '../services/api';

function RegisterPage(){
  const[username,setUsername]=useState('');
  const[email,setEmail]=useState('');
  const[phone,setPhone]=useState('');
  const[county,setCounty]=useState('');
  const[password,setPassword]=useState('');
  const[confirmPassword,setConfirmPassword]=useState('');
  const[isLoading,setIsLoading]=useState(false);
  const[errors,setErrors]=useState({});

  const navigate=useNavigate();
  const counties=[
    'Baringo','Bomet','Bungoma','Busia','Elgeyo Marakwet','Embu','Garissa','Homa Bay','Isiolo','Kajiado','Kakamega','Kericho','Kiambu','Kilifi','Kirinyaga','Kisii','Kisumu','Kitui','Kwale','Laikipia','Lamu','Machakos','Makueni','Mandera','Marsabit','Meru','Migori','Mombasa','Murang\'a','Nairobi','Nakuru','Nandi','Narok','Nyamira','Nyandarua','Nyeri','Samburu','Siaya','Taita Taveta','Tana River','Tharaka Nithi','Trans Nzoia','Turkana','Uasin Gishu','Vihiga','Wajir','West Pokot'
  ];

  const validate=()=>{
    const newErrors={};
    if (!username.trim()){
      newErrors.username='Username is required';
    }else if (username.length<3){
      newErrors.username="Username must be at least 3 characters";
    }else if (username.length>20){
      newErrors.username="Username must be less than 20 characters";
    }else if (!/^[a-zA-Z0-9_]+$/.test(username)){
      newErrors.username="Username can only contain letters, numbers, and underscores";
    }else if (username.includes(' ')){
      newErrors.username="Username cannot contain spaces";
    }
    if (!email.trim()){
      newErrors.email='Email is required';
    } else if (!email.includes('@')){
      newErrors.email='Please enter a valid email address';
    }
    const disposableDomains=['mailinator.com','10minutemail.com','tempmail.com','dispostable.com','fakeinbox.com','getnada.com','guerrillamail.com','maildrop.cc','trashmail.com','yopmail.com','disposablemail.com','temp-mail.org','throwawaymail.com','mailnesia.com','mytemp.email','spambog.com','mailcatch.com','temp-mail.io','fake-mail.net','trashmail.net','yopmail.net'];
    const emailDomain=email.split('@')[1];
    if (disposableDomains.includes(emailDomain)){
      newErrors.email='Disposable email addresses are not allowed';
    }
    if (!phone.trim()){
      newErrors.phone='Phone number is required';
    } else if (!/^\d{10}$/.test(phone)){
      newErrors.phone='Please enter a valid 10-digit phone number starting with 0';
    }else if (!phone.startsWith('0')){
      newErrors.phone='Phone number must start with 0';
    }
    if (!password){
      newErrors.password='Password is required';
    }else if (password.length<8){
      newErrors.password='Password must be at least 8 characters';
    }else if (!password.match(/[A-Z]/)){
      newErrors.password='Password must contain at least one uppercase letter';
    }else if (!password.match(/[a-z]/)){
      newErrors.password='Password must contain at least one lowercase letter';
    }else if (!password.match(/[0-9]/)){
      newErrors.password='Password must contain at least one number';
    }else if (!password.match(/[@$!%*?&]/)){
      newErrors.password='Password must contain at least one special character';
    }
    if (!confirmPassword){
      newErrors.confirmPassword='Please confirm your password';
    }else if (password !== confirmPassword){
      newErrors.confirmPassword='Passwords do not match';
    }
    return newErrors;
  };

  const handleRegister=async(e)=>{
    e.preventDefault();
   
    const validationErrors=validate();
    if (Object.keys(validationErrors).length>0){
      setErrors(validationErrors);
      return;
    }
    setIsLoading(true);
    setErrors({});
    try {
      const response=await authApi.register(username,email,phone,county||null,password,confirmPassword);
      localStorage.setItem('access_token',response.data.access);
      localStorage.setItem('refresh_token',response.data.refresh);
      localStorage.setItem('user',JSON.stringify(response.data.user));
      navigate('/feed');
    } catch (err){
      if (err.response?.data){
        setErrors(err.response.data);
      } else {
        setErrors({general:'An error occurred. Please try again.'});
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-logo">
        <h1>Jamii</h1>
        <p>Create account: Connect with Kenyans</p>
      </div>
      <form onSubmit={handleRegister} className="auth-form">
        {errors.general &&(
          <div className="error-message">
            {errors.general}
          </div>
        )}
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={errors.username ? 'input-error' : ''}
          />
          {errors.username && (<span className="field-error">{errors.username}</span>)}
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={errors.email ? 'input-error' : ''}
          />
          {errors.email &&( <span className="field-error">{errors.email}</span>)}
        </div>
        <div className="form-group">
          <label>Phone number</label>
          <input
            type="text"
            placeholder="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={errors.phone ? 'input-error' : ''}
          />
          {errors.phone &&( <span className="field-error">{errors.phone}</span>)}
        </div>
        <div className="form-group">
          <label>County (optional)</label>
          <select
            value={county}
            onChange={(e) => setCounty(e.target.value)}
            className="county-select"
          >
            <option value="">Select your county</option>
            {counties.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) =>setPassword(e.target.value)}
            className={errors.password ? 'input-error' : ''}
          />
          {errors.password &&( <span className="field-error">{errors.password}</span>)}
         
          {password && (
            <div className="password-strength">
              <div
                className={`strength-bar ${
                  password.length < 8 ? 'weak' :
                  password.length < 12 ? 'medium' : 'strong'
                }`}
              />
              <span>
                {password.length < 8 ? 'Weak' :
                 password.length < 12 ? 'Medium' : 'Strong'}
              </span>
            </div>
          )}
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={errors.confirmPassword ? 'input-error' : ''}
          />
          {errors.confirmPassword && (
            <span className="field-error">{errors.confirmPassword}</span>
          )}
        </div>
        {confirmPassword && (
          <span className={`match-indicator ${password === confirmPassword ? 'match' : 'no-match'}`}>
            {password === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
          </span>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary">
          {isLoading ? 'Registering...' : 'Register'}
        </button>
        <p className="auth-link">
          Already have an account?{' '}
          <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;

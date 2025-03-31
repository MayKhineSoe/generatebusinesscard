import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate()

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) setError(error.message);
    else alert('Check your email for confirmation!');
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) setError(error.message);
    else {
        alert('Signed in successfully!');
        navigate('/admin');  // Redirect to dashboard
      }
  };

  
  return (
    <div className="flex flex-col items-center mt-20 h-screen">
      <h2 className='font-semibold text-2xl text-blue-400'>Generate Business Card</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form className="flex flex-col mt-5 w-[27%]">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='border-blue-300 border-2 rounded-lg p-2 mb-4 focus:border-green-300 outline-none'
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='border-2 border-blue-300 rounded-lg p-2 mb-4 focus:border-green-300 outline-none'
          required
        />
        <button onClick={handleSignUp} className="bg-blue-500 rounded-lg text-white px-4 py-2 mt-2">Sign Up</button>
        <button onClick={handleSignIn} className="bg-green-500 rounded-lg text-white px-4 py-2 mt-2">Sign In</button>
      </form>
    </div>
  );
};

export default Auth;

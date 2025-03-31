import React, {useEffect} from 'react'
import {supabase} from '../utils/supabaseClient'
import { useNavigate } from 'react-router-dom'

const Login = () => {

    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
          const { data } = await supabase.auth.getUser();
          if (data.user) {
            navigate("/dashboard"); // Redirect if already logged in
          }
        };
    
        checkUser();
      }, [navigate]);

    const handleLogin= async() => {
        const {user, error} = await supabase.auth.signInWithOtp({
            email: "maykhinesoeyl@gmail.com",
        });

        if (error) {
            console.error("Login error:", error)
        }else {
            console.log("OTP sent to maykhinesoeyl@gmail.com")
        }

    }
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
        <h1 className='text-2xl text-teal-500 font-bold'>Admin Login</h1>
        <button onClick={handleLogin} className='mt-4 px-6 py-2 bg-teal-500 text-white rounded'>Login via Email OTP</button>
    </div>
  )
}

export default Login
import { Navigate } from 'react-router-dom';
import { supabase } from '../supabase';

const ProtectedRoute = ({ children }) => {
  const user = supabase.auth.getUser(); // Check if user is logged in

  if (!user) {
    return <Navigate to="/" replace />; // Redirect to login page if not authenticated
  }

  return children;
};

export default ProtectedRoute;

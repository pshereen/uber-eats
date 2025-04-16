import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../redux/store';

interface Props {
    children: React.ReactNode;
    allowedRoles?: ('restaurant' | 'customer')[];
}

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { token, role } = useSelector((state: RootState) => state.auth);

  if (!token && window.location.pathname.startsWith('/dashboard')) {
    return <Navigate to="/login" replace />;
  }
    if (allowedRoles && !allowedRoles.includes(role!)) {
    return <Navigate to="/" replace />; 
  }

  return children;
}

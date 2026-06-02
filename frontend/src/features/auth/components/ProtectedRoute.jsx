

import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');
const user = location.state?.user || JSON.parse(localStorage.getItem('user'));
console.log("--- PROTECTED ROUTE DEBUGGER ---");
  console.log("1. Raw User Object:", user);
  console.log("2. Extracted Role:", user?.role);
  console.log("3. Allowed Roles for this route:", allowedRoles);
  console.log("4. Does it match?:", allowedRoles.includes(user?.role));
  console.log("---------------------------------");
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Logged in, but trying to look at a page they don't own
    return <Navigate to="/unauthorized" replace />;
  }

  // Permission granted: render child dashboard views
  return <Outlet />;
};

export default ProtectedRoute;
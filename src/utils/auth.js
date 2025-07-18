import { jwtDecode } from 'jwt-decode';

const getUserFromToken = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const decoded = jwtDecode(token);
    return decoded;
  } catch (err) {
    return null;
  }
};

export default getUserFromToken

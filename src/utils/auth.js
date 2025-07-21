import { jwtDecode } from 'jwt-decode';  // fixed import

const getUsersFromTokens = () => {
  const roles = ['Admin', 'Customer', 'Manager', 'Employee', 'Supplier'];
  const users = {};

  try {
    roles.forEach(role => {
      const token = localStorage.getItem(`${role}Token`);
      if (token) {
        const decoded = jwtDecode(token);
        users[role] = decoded;
      }
    });

    if (Object.keys(users).length === 0) {
      return null;
    }
    return users;
  } catch (err) {
    console.error('Error decoding tokens:', err);
    return null;
  }
};

export default getUsersFromTokens;

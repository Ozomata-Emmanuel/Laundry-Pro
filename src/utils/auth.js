import { jwtDecode } from 'jwt-decode';

const getUserFromToken = () => {
  try {
    const AdminToken = localStorage.getItem('AdminToken');
    const CustomerToken = localStorage.getItem('CustomerToken');
    const ManagerToken = localStorage.getItem('ManagerToken');
    const EmployeeToken = localStorage.getItem('EmployeeToken');
    const SupplierToken = localStorage.getItem('SupplierToken');
    if (!CustomerToken) return null;
    const decoded = jwtDecode(CustomerToken);
    return decoded;
  } catch (err) {
    return null;
  }
};

export default getUserFromToken

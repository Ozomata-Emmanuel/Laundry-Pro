import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { ToastContainer } from 'react-toastify';
import Home from './pages/UserPages/Home';
import NavigationBar from './components/NavigationBar';
import Footer from './components/Footer';
import UserAuth from './pages/userAuthentication/UserAuth';
import Contact from './pages/UserPages/Contact';
import About from './pages/UserPages/About';
import Prices from './pages/UserPages/Prices';
import Services from './pages/UserPages/Services';
import Order from './pages/UserPages/Order';
import UserDashboard from './pages/UserPages/UserDashboard';
import Profile from './pages/UserPages/Profile';
import DataProvider from './context/DataContext';
import ResetPassword from './components/ResetPassword';
import ForgotPassword from './components/ForgotPassword';
import ResendVerification from './components/ResendVerification';
import SupplierDashboardPage from './pages/SupplierDashboardPages/SupplierDashboardPage';
import SupplierDashboardOverview from './pages/SupplierDashboardPages/SupplierDashboardOverview';
import SupplierInventoryManagement from './pages/SupplierDashboardPages/SupplierInventoryManagement';
import SupplierOrderManagement from './pages/SupplierDashboardPages/SupplierOrderManagement';
import SupplierDeliveryTracking from './pages/SupplierDashboardPages/SupplierDeliveryTracking';
import SupplierInvoiceManagement from './pages/SupplierDashboardPages/SupplierInvoiceManagement';
import SupplierSettings from './pages/SupplierDashboardPages/SupplierSettings';
import SupplierDashboardLogin from './pages/SupplierDashboardPages/SupplierDashboardLogin';
import AdminDashboardPage from './pages/AdminDashboardPages/AdminDashboardPage';
import AdminDashboardOverview from './pages/AdminDashboardPages/AdminDashboardOverview';
import AdminRegisterSupplier from './pages/AdminDashboardPages/AdminRegisterSupplier';
import AdminRegisterEmployee from './pages/AdminDashboardPages/AdminRegisterEmployee';
import AdminManageSuppliers from './pages/AdminDashboardPages/AdminManageSuppliers';
import AdminManageEmployees from './pages/AdminDashboardPages/AdminManageEmployees';
import AdminInventoryDashboard from './pages/AdminDashboardPages/AdminInventoryDashboard';
import AdminReports from './pages/AdminDashboardPages/AdminReports';
import LocationManagement from './pages/AdminDashboardPages/LocationManagement';
import AddBranch from './pages/AdminDashboardPages/AddBranch';
import ManagerDashboardPage from './pages/ManagerDashboardPages/ManagerDashboardPage';
import ManagerDashboardOverview from './pages/ManagerDashboardPages/ManagerDashboardOverview';
import ManagerDashboardEmployees from './pages/ManagerDashboardPages/ManagerDashboardEmployees';
import ManagerDashboardReports from './pages/ManagerDashboardPages/ManagerDashboardReports';
import ManagerDashboardOrders from './pages/ManagerDashboardPages/ManagerDashboardOrders';
import ManagerDashboardInventory from './pages/ManagerDashboardPages/ManagerDashboardInventory';
import ManagerDashboardApproveRequest from './pages/ManagerDashboardPages/ManagerDashboardApproveRequest';
import EmployeeDashboardPages from './pages/EmployeeDashboardPages/EmployeeDashboardPages';
import EmployeeDashboardOveriew from './pages/EmployeeDashboardPages/EmployeeDashboardOveriew';
import EmployeeDashboardLeave from './pages/EmployeeDashboardPages/EmployeeDashboardLeave';
import EmployeeDashboardOrder from './pages/EmployeeDashboardPages/EmployeeDashboardOrder';
import EmployeeDashboardInventory from './pages/EmployeeDashboardPages/EmployeeDashboardInventory';
import AdminOrderManagement from './pages/AdminDashboardPages/AdminOrderManagement';
import VerifyEmail from './components/verifyEmail';
import NotFound from './components/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import NotAuthorized from './components/NotAuthorized';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import AdminFulfillmentDashboard from './pages/AdminDashboardPages/AdminFulfillmentDashboard';
import ManagerDashboardIssues from './pages/ManagerDashboardPages/ManagerDashboardIssues';

function App() {
  const location = useLocation();

  const isDashboardRoute = () => {
    return location.pathname.includes('dashboard');
  };

  return (
    <div>
      <div className="sticky top-0 z-50">{!isDashboardRoute() && <NavigationBar />}</div>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<UserAuth />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/prices" element={<Prices />} />
        <Route path="/services" element={<Services />} />
        <Route path="/order" element={<Order />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/resend-verification-code" element={<ResendVerification />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/not-authorized" element={<NotAuthorized />} />
        <Route path="/order" element={ <Order />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/supplier-dashboard/login" element={<SupplierDashboardLogin />} />

          <Route path="/supplier-dashboard" element={<SupplierDashboardPage />}>
            <Route index element={<SupplierDashboardOverview />} />
            <Route path="overview" element={<SupplierDashboardOverview />} />
            <Route path="inventory" element={<SupplierInventoryManagement />} />
            <Route path="order" element={<SupplierOrderManagement />} />
            <Route path="delivery" element={<SupplierDeliveryTracking />} />
            <Route path="invoice" element={<SupplierInvoiceManagement />} />
            <Route path="setting" element={<SupplierSettings />} />
          </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin-dashboard" element={<AdminDashboardPage />}>
            <Route index element={<AdminDashboardOverview />} />
            <Route path="overview" element={<AdminDashboardOverview />} />
            <Route path="inventory" element={<AdminInventoryDashboard />} />
            <Route path="order-management" element={<AdminOrderManagement />} />
            <Route path="register-supplier" element={<AdminRegisterSupplier />} />
            <Route path="register-employee" element={<AdminRegisterEmployee />} />
            <Route path="manage-suppliers" element={<AdminManageSuppliers />} />
            <Route path="manage-employees" element={<AdminManageEmployees />} />
            <Route path="manage-locations" element={<LocationManagement />} />
            <Route path="add-branch" element={<AddBranch />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="employee-requests" element={<AdminFulfillmentDashboard />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['manager']} />}>
          <Route path="/manager-dashboard" element={<ManagerDashboardPage />}>
            <Route index element={<ManagerDashboardOverview />} />
            <Route path="overview" element={<ManagerDashboardOverview />} />
            <Route path="inventory" element={<ManagerDashboardInventory />} />
            <Route path="manage-employees" element={<ManagerDashboardEmployees />} />
            <Route path="orders" element={<ManagerDashboardOrders />} />
            <Route path="reports" element={<ManagerDashboardReports />} />
            <Route path="manage-requests" element={<ManagerDashboardApproveRequest />} />
            <Route path="order-issues" element={<ManagerDashboardIssues />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin', 'employee']} />}>
          <Route path="/employee-dashboard" element={<EmployeeDashboardPages />}>
            <Route index element={<EmployeeDashboardOveriew />} />
            <Route path="overview" element={<EmployeeDashboardOveriew />} />
            <Route path="leave" element={<EmployeeDashboardLeave />} />
            <Route path="assigned-orders" element={<EmployeeDashboardOrder />} />
            <Route path="inventory" element={<EmployeeDashboardInventory />} />
          </Route>
        </Route>

      </Routes>
      <ToastContainer />
      {!isDashboardRoute() && <Footer />}
    </div>
  );
}

function AppMain() {
  return (
    <DataProvider>
      <Router>
        <App />
      </Router>
    </DataProvider>
  );
}

export default AppMain;
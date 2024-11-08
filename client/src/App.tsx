import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CustomerDashboard from "./pages/CustomerDashboard";
import CustomerPaymentForm from "./pages/CustomerPaymentForm";
import EmployeeLogin from "./pages/EmployeeLogin";
import Transactions from "./pages/Transactions";
import EmployeeDashboard from "./pages/EmployeeDashboard";

/**
 * The main application component that sets up the routing for the app.
 * It conditionally renders the `Navbar` component based on the current path.
 *
 * @returns {JSX.Element} The rendered application component.
 */
function App(): JSX.Element {
  const location = useLocation();

  return (
    <>
      {/* Conditionally render Navbar */}
      {location.pathname !== "/customer-dashboard" &&
        location.pathname !== "/customer-payment-form" &&
        location.pathname !== "/transactions" && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route
          path="/customer-payment-form"
          element={<CustomerPaymentForm />}
        />
        <Route path="/employee-login" element={<EmployeeLogin />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
      </Routes>
    </>
  );
}

export default App;

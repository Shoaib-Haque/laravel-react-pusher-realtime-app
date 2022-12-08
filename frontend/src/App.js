import "./App.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/Auth/Index.component";
import Dashboard from "./components/Dashboard/Index.component";

function App() {
  return (
    <Router>
      <Container fluid className="p-0">
        <Row>
          <Col>
            <Routes>
              <Route path="/" element={<Navigate replace to="/login" />} />
              {/* Auth */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              {/* Dashboard */}
              <Route
                path="/dashboard"
                element={
                  <UserProtectedRoute>
                    <Dashboard />
                  </UserProtectedRoute>
                }
              />
            </Routes>
          </Col>
        </Row>
      </Container>
    </Router>
  );
}
function PublicRoute({ children }) {
  let isAuthenticated = getAuth();
  if (isAuthenticated) {
    if (getRole() === "admin") return <Navigate to="/accounts" />;
    else if (getRole() === "account") return <Navigate to="/statements" />;
    else if (getRole() === "user") return <Navigate to="/dashboard" />;
  } else {
    return children;
  }
}

function AdminProtectedRoute({ children }) {
  let isAuthenticated = getAuth();
  return isAuthenticated ? (
    getRole() === "admin" ? (
      children
    ) : (
      <Navigate to="/statements" />
    )
  ) : (
    <Navigate to="/login" />
  );
}

function UserProtectedRoute({ children }) {
  let isAuthenticated = getAuth();
  return isAuthenticated ? (
    getRole() === "user" ? (
      children
    ) : (
      <Navigate to="/dashboard" />
    )
  ) : (
    <Navigate to="/login" />
  );
}

function getAuth() {
  let token = localStorage.getItem("authToken");
  return token;
}

function getRole() {
  let role = localStorage.getItem("role");
  return role;
}

export default App;

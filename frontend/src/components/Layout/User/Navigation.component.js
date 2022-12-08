import axios from "axios";
import { useNavigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const Navigation = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  const logout = async () => {
    const formData = new FormData();
    formData.append("token", token);
    await axios
      .post(`${process.env.REACT_APP_API_BASE_URL}user/logout`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.status === 200) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("role");
          navigate("/login");
        } else {
          console.log(response);
        }
      })
      .catch(({ response }) => {
        console.log(response);
      });
  };

  return (
    <Navbar bg="light" expand="lg" sticky="top" className="mb-2">
      <Container fluid>
        <Navbar.Brand href="/">Home</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavDropdown title="Action" id="basic-nav-dropdown">
              <NavDropdown.Item href="/dashboard">Dashboard</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Form inline>
            <Button
              variant=""
              className=""
              size="sm"
              block="block"
              type="button"
              onClick={logout}
            >
              Logout
            </Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;

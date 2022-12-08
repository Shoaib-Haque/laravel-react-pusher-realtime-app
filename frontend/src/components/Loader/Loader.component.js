import Container from "react-bootstrap/Container";
import Css from "./Loader.css";

const Loader = () => {
    return (
        <Container className="centered">
            <Container className="loader"></Container>
        </Container>
    );
  };
  
  export default Loader;
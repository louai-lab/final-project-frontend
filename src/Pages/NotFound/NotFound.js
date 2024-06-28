import { useNavigate } from "react-router-dom";
import StyleNotFound from "./NotFound.module.css";
import notFound from "../../Assets/icons/_c656405a-58fc-4cf1-ae16-650624075164.jpeg";

function NotFound() {
  const navigate = useNavigate();
  return (
    <div className={StyleNotFound.notFoundContainer}>
      <img src={notFound} alt="notFound" />

      <p>Sorry, the page you are looking for is not found!</p>
      <button onClick={() => navigate("/home", { replace: true })}>
        Take me Back
      </button>
    </div>
  );
}

export default NotFound;

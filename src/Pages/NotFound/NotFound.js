import { useNavigate } from "react-router-dom";
// import Button from "../../Components/Button/Button";
import StyleNotFound from "./NotFound.module.css";

function NotFound() {
  const navigate = useNavigate();
  return (
    <div className={StyleNotFound.notFoundContainer}>
      <h1>404</h1>
      <h2>Not Found!</h2>
      <p>Sorry, the page you are looking for is not found!</p>
      <button
        action="Take me back"
        onClick={() => navigate("/", { replace: true })}
      />
      {/* <button onClick={() => navigate("/", { replace: true })}>
        Take me Back
      </button> */}
    </div>
  );
}

export default NotFound;

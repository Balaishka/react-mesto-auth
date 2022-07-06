import { Route, Redirect } from "react-router-dom";

function ProtectedRoute({ children, loggedIn }) {
  return <Route>{loggedIn ? children : <Redirect to="/sign-up" />}</Route>;
}

export default ProtectedRoute;

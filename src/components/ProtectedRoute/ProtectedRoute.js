import { Route, Redirect } from "react-router-dom";

function ProtectedRoute({children, ...props}) {
    return (
        <Route>
            {
                () => props.loggedIn === true ? children : <Redirect to="/sign-up" />
            }
        </Route>
    );
}

export default ProtectedRoute;
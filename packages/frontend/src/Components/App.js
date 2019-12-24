import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import history from "./history";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Editor from "./EditorUI";
import LandingPage from "./LandingPage";
import NavBar from "./NavBar";
import ViewTasks from "./ViewTasks";
import Services from "./Services";

const App = () => {
    return (
        <Router history={history}>
            <NavBar />
            <Switch>
                <Route path="/" exact component={Login} />
                <Route path="/login" exact component={Login} />
                <Route path="/register" exact component={Register} />
                <Route path="/landing" exct component={LandingPage} />
                <Route path="/editor" exact component={Editor} />
                <Route path="/tasks" exact component={ViewTasks} />
                <Route path="/services" exact component={Services} />
            </Switch>
        </Router>
    );
};

export default App;

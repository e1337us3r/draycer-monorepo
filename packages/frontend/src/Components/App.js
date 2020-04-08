import React from "react";
import { BrowserRouter, Route, Switch, withRouter } from "react-router-dom";
import history from "./history";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Editor from "./EditorUI";
import ConsoleLanding from "./ConsoleLanding";
import Landing from "./Landing";
import NavBar from "./NavBar";
import ViewTasks from "./ViewTasks";
import Services from "./Services";
import ViewTask from "./ViewTask";

const App = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Landing} />
                <Route path="/login" exact>
                    <NavBar />
                    <Login />
                </Route>
                <Route path="/register">
                    <NavBar />
                    <Register />
                </Route>

                <Route path="/console">
                    <NavBar />
                    <ConsoleLanding />
                </Route>
                <Route path="/editor">
                    <NavBar />
                    <Editor />
                </Route>
                <Route path="/tasks">
                    <NavBar />
                    <ViewTasks />
                </Route>
                <Route path="/services">
                    <NavBar />
                    <Services />
                </Route>
                <Route path="/task/:id">
                    <NavBar />
                    <ViewTask />
                </Route>
            </Switch>
        </BrowserRouter>
    );
};

export default App;

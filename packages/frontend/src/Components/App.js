import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Editor from "./EditorUI";
import ConsoleLanding from "./ConsoleLanding";
import Landing from "./Landing";
import NavBar from "./NavBar";
import ViewTasks from "./ViewTasks";
import Services from "./Services";
import ViewTask from "./ViewTask";
import AuthedRoute from "./auth/AuthedRoute";
import AuthProvider from "./auth/Auth";
import UserWorkRecord from "./UserWorkRecord";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core";

const THEME = createMuiTheme({
  typography: {
    fontFamily: `"Balsamiq Sans", sans-serif`,
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
  },
});

function App() {
  return (
    <MuiThemeProvider theme={THEME}>
      <AuthProvider>
        <BrowserRouter>
          <Switch>
            <Route path="/" exact component={Landing} />
            <Route path="/login" exact>
              <Login />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
            <Route>
              <NavBar />
              <AuthedRoute
                exact
                component={ConsoleLanding}
                path="/console"
              ></AuthedRoute>
              <AuthedRoute
                exact
                component={Editor}
                path="/editor"
              ></AuthedRoute>
              <AuthedRoute
                exact
                component={ViewTasks}
                path="/tasks"
              ></AuthedRoute>
              <AuthedRoute
                exact
                component={UserWorkRecord}
                path="/work_record"
              ></AuthedRoute>
              <AuthedRoute
                exact
                component={Services}
                path="/services"
              ></AuthedRoute>
              <AuthedRoute
                exact
                component={ViewTask}
                path="/task/:id"
              ></AuthedRoute>
            </Route>
          </Switch>
        </BrowserRouter>
      </AuthProvider>
    </MuiThemeProvider>
  );
}

export default App;

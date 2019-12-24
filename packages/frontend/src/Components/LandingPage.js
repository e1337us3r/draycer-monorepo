import React from "react";
import firebase from "./auth/firebase";
import history from "./history";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
const LandingPage = () => {
    if (!firebase.auth().currentUser) history.push("/login");
    return (
        <div className="landing">
            <Link to="/editor">
                <Button variant="contained" color="primary">
                    New Task
                </Button>
            </Link>
            <br />
            <Link to="/tasks">
                <Button variant="contained" color="primary">
                    View Tasks
                </Button>
            </Link>
            <br />
            <Link to="/services">
                <Button variant="contained" color="primary">
                    My Services
                </Button>
            </Link>
        </div>
    );
};

export default LandingPage;

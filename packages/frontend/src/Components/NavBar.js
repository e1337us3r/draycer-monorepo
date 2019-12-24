import React, { useState } from "react";
import firebase from "./auth/firebase";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Button
} from "@material-ui/core";
const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1
    },
    menuButton: {
        marginRight: theme.spacing(2)
    },
    title: {
        flexGrow: 1
    }
}));
export default function NavBar() {
    const [isLogged, setIsLogged] = useState(false);
    const classes = useStyles();
    console.log(firebase.auth().currentUser);

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        className={classes.menuButton}
                    ></IconButton>
                    <Typography variant="h6" className={classes.title}>
                        <Link
                            to="/landing"
                            style={{
                                color: "white",
                                textDecoration: "none"
                            }}
                        >
                            Raycer
                        </Link>
                    </Typography>
                    {firebase.auth().currentUser ? (
                        <Button
                            onClick={() => {
                                firebase.auth().signOut();
                            }}
                        >
                            Logout
                        </Button>
                    ) : (
                        <Link
                            to="/login"
                            style={{
                                color: "white",
                                textDecoration: "none"
                            }}
                        >
                            Login
                        </Link>
                    )}
                </Toolbar>
            </AppBar>
        </div>
    );
}

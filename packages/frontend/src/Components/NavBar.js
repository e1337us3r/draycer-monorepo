import React, { useContext } from "react";
import firebase from "./auth/firebase";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
} from "@material-ui/core";
import { AuthContext } from "./auth/Auth";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));
export default function NavBar(props) {
  const { currentUser } = useContext(AuthContext);
  const classes = useStyles();
  console.log(props)
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
              to="/"
              style={{
                color: "white",
                textDecoration: "none",
              }}
            >
              DRaycer
            </Link>
          </Typography>
          {currentUser ? (
            <Button
              onClick={() => {
                firebase.auth().signOut();
              }}
              variant="contained"
              color="secondary"
            >
              Logout
            </Button>
          ) : (
              <Link
                to="/login"
                style={{
                  color: "white",
                  textDecoration: "none",
                }}
              >
                <Button variant="contained" color="primary">Login</Button>
              </Link>
            )}
        </Toolbar>
      </AppBar>
    </div>
  );
}

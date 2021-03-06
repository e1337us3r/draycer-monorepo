import React, { useState } from "react";
import firebase from "./auth/firebase";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";

const Register = () => {
  const [email, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [emailErrorHelper, setEmailErrorHelper] = useState("");
  const [passErrorHelper, setPassErrorHelper] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const history = useHistory();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email !== "" && password.length >= 6) {
      setEmailErrorHelper("");
      setPassErrorHelper("");
      setEmailError(false);
      setPasswordError(false);
      try {
        await firebase.auth().createUserWithEmailAndPassword(email, password);
      } catch (error) {
        setErrorMessage(error.message);
      }

      if (firebase.auth().currentUser) {
        history.push("/console");
      }
    } else {
      if (email === "") {
        setEmailError(true);
        setEmailErrorHelper("Email cannot be empty!");
      }
      if (password.length < 6) {
        setPasswordError(true);
        setPassErrorHelper("Password cannot be lower than 6 characters!");
      }
    }
  };

  return (
    <div style={{ width: "250px", margin: "10% auto" }}>
      <Card>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <h5>Register!</h5>
            <TextField
              id="email"
              label="Email"
              type="email"
              autoComplete="email"
              margin="normal"
              variant="outlined"
              value={email}
              onChange={(e) => setMail(e.target.value)}
              error={emailError}
              helperText={emailErrorHelper}
            />

            <br />
            <TextField
              id="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              margin="normal"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={passwordError}
              helperText={passErrorHelper}
            />
            <br />
            {errorMessage ? (
              <span style={{ fontSize: "0.7rem", color: "red" }}>
                {errorMessage}
              </span>
            ) : (
              ""
            )}
          </CardContent>
          <CardActions style={{ display: "flex", justifyContent: "center" }}>
            <Button variant="contained" color="primary" type="submit">
              Register
            </Button>
            <Link to="/login">
              <Button variant="contained" color="secondary">
                Login
              </Button>
            </Link>
          </CardActions>
        </form>
      </Card>
    </div>
  );
};

export default Register;

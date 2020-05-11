import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
const LandingPage = () => {
  return (
    <div
      style={{
        width: "300px",
        margin: "10% auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Link to="/editor">
        <Button style={{ width: "100%" }} variant="contained" color="secondary">
          New Task
        </Button>
      </Link>
      <br />
      <Link to="/tasks">
        <Button
          style={{ width: "100%", marginTop: "10px" }}
          variant="contained"
          color="secondary"
        >
          View Tasks
        </Button>
      </Link>
      <br />
      <Link to="/services">
        <Button
          style={{ width: "100%", marginTop: "10px" }}
          variant="contained"
          color="secondary"
        >
          My Services
        </Button>
      </Link>
    </div>
  );
};

export default LandingPage;

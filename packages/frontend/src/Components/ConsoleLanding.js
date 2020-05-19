import React from "react";
import { Link } from "react-router-dom";
import { Button, Tooltip } from "@material-ui/core";
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
        <Tooltip title="Create a new scene" arrow>
          <Button
            style={{ width: "100%" }}
            variant="contained"
            color="secondary"
          >
            New Task
          </Button>
        </Tooltip>
      </Link>
      <Link to="/tasks">
        <Tooltip title="View your render tasks" arrow>
          <Button
            style={{ width: "100%", marginTop: "10px" }}
            variant="contained"
            color="secondary"
          >
            View Tasks
          </Button>
        </Tooltip>
      </Link>
      <Link to="/services">
        <Tooltip title="Become a worker!" arrow>
          <Button
            style={{ width: "100%", marginTop: "10px" }}
            variant="contained"
            color="secondary"
          >
            My Services
          </Button>
        </Tooltip>
      </Link>
      <Link to="/work_record">
        <Tooltip title="View your worker history" arrow>
          <Button
            style={{ width: "100%", marginTop: "10px" }}
            variant="contained"
            color="secondary"
          >
            Work Record
          </Button>
        </Tooltip>
      </Link>
    </div>
  );
};

export default LandingPage;

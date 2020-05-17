import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import * as axios from "axios";
import CONFIG from "../config";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { continueTask, pauseTask } from "../api/client";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function TaskList(props) {
  const history = useHistory();

  const resolveRenderStatus = (status, id) => {
    switch (status) {
      case "completed":
        return (
          <TableCell align="right">
            <Button
              onClick={() => {
                history.push(`/task/${id}`);
              }}
              variant="contained"
              color="primary"
            >
              View
            </Button>
          </TableCell>
        );
      case "rendering":
        return (
          <TableCell align="right">
            <Button variant="contained" color="primary">
              Rendering
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => pauseTask(id)}
            ></Button>
          </TableCell>
        );
      case "waiting_workers":
        return (
          <TableCell align="right">
            <Button variant="contained" color="secondary">
              Waiting workers
            </Button>
          </TableCell>
        );
      case "paused":
        return (
          <TableCell align="right">
            <Button
              onClick={() => continueTask(id)}
              variant="contained"
              color="secondary"
            >
              Continue
            </Button>
          </TableCell>
        );

      default:
    }
  };

  return (
    <TableBody>
      {props.tasks.map((item, index) => {
        const endDate =
          item.ended_at !== null ? new Date(item.ended_at) : new Date();
        const timePastMin = item.started_at
          ? endDate.getTime() / 60000 -
            new Date(item.started_at).getTime() / 60000
          : 0;
        let percentage = "";
        if (item.status === "rendering")
          percentage = (
            (item.metadata.rendered_pixel_count / item.metadata.pixel_count) *
            100
          ).toFixed(1);
        return (
          <TableRow key={item.id}>
            <TableCell component="th" scope="row">
              {item.id}
            </TableCell>
            <TableCell align="right">Unknown</TableCell>
            <TableCell align="right">{item.created_at}</TableCell>
            <TableCell align="right">{Math.floor(timePastMin)} Min</TableCell>
            <TableCell align="right">
              {item.status.toUpperCase()}{" "}
              {item.status === "rendering" ? `${percentage}%` : ""}{" "}
            </TableCell>
            {resolveRenderStatus(item.status, item.id)}
          </TableRow>
        );
      })}
    </TableBody>
  );
}

export default function ViewTasks() {
  const classes = useStyles();
  const [tasks, setTasks] = useState([]);
  const [err, setErr] = useState("");
  useEffect(() => {
    axios // send a request when component is mounted
      .get(CONFIG.serverUrl + "/scene")
      .then((res) => setTasks(res.data.results))
      .catch((err) => setErr(err));
    // request every 3 seconds after component is mounted
    const fetchTasksInterval = setInterval(() => {
      axios
        .get(CONFIG.serverUrl + "/scene")
        .then((res) => setTasks(res.data.results))
        .catch((err) => setErr(err));
    }, 3000);

    return () => clearInterval(fetchTasksInterval);
  }, []);
  return (
    <TableContainer component={Paper} style={{ marginTop: "5%" }}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell align="right">Name</TableCell>
            <TableCell align="right">Date</TableCell>
            <TableCell align="right">Duration</TableCell>
            <TableCell align="right">Status</TableCell>
          </TableRow>
        </TableHead>
        <TaskList tasks={tasks} />
        {err && <span>{err.message}</span>}
      </Table>
    </TableContainer>
  );
}

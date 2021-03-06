import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import socketIOClient from "socket.io-client";
import CONFIG from "../config";
import { RayTracer, SceneLoader } from "draycer";
import API from "../api/client";
import firebase from "../Components/auth/firebase";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function TaskList(props) {
  const tasks = Object.values(props.tasks);
  console.log(props.tasks);
  return (
    <TableBody>
      {tasks.map((item, index) => {
        return (
          <TableRow key={item.jobId}>
            <TableCell
              align="right"
              component="th"
              scope="row"
            >{`Work #${index + 1}`}</TableCell>
            <TableCell align="right">{item.jobId}</TableCell>
            <TableCell align="right">{item.latestBlockId}</TableCell>
            <TableCell align="right">{item.renderedBlockCount}</TableCell>
            <TableCell align="right">{props.complete}</TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  );
}

export default function Services() {
  const classes = useStyles();
  const [tasks, setTasks] = useState({});
  const [lastJob, setLastJob] = useState({});
  const [complete, setComplete] = useState();
  useEffect(() => {
    const socket = socketIOClient(CONFIG.serverSocketUrl);
    const renderers = {};
    console.log("SOCKET CONNECTED");

    socket.emit("join", {
      userId: localStorage.getItem("userId")
    });
    socket.on("RENDER_BLOCK", async (job) => {
      setLastJob(job);
      setComplete("rendering");
      const { block, jobId, blockId, width, height } = job;
      let renderer = renderers[jobId];
      if (renderer == undefined) {
        const scene = (await API.scene.get(jobId, true)).scene;

        const parsedScene = await SceneLoader.load(scene);

        renderer = new RayTracer(parsedScene, width, height);
        await renderer.loadTextures();

        renderers[job.jobId] = renderer;
      }

      const renders = [];

      for (let y = block[1]; y < block[3]; y++) {
        for (let x = block[0]; x < block[2]; x++) {
          const color = renderer.tracedValueAtPixel(x, y);
          renders.push([x, y, color.r, color.g, color.b]);
        }
      }
      socket.emit("BLOCK_RENDERED", {
        jobId,
        renders,
        blockId,
      });
      console.log(
        `EVENT: BLOCK_RENDERED | id= ${job.jobId}| blockId=${blockId}`
      );
      setComplete("completed");
    });
    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const job = lastJob;
    let temp;
    if (Object.keys(job).length > 0) {
      let task = tasks[job.jobId];
      if (task) {
        temp = task;
        temp.latestBlockId = job.blockId;
        temp.renderedBlockCount += 1;
      } else {
        temp = {
          jobId: job.jobId,
          renderedBlockCount: 0,
          latestBlockId: job.blockId,
          status: "rendering",
        };
      }
      if (tasks[job.jobId] !== temp) {
        setTasks({ ...tasks, [job.jobId]: temp });
      }
    }
  }, [lastJob, tasks]);

  return (
    <div style={{ marginTop: "3%", padding: "10px" }}>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right">Work</TableCell>
              <TableCell align="right">Job Id</TableCell>
              <TableCell align="right">Latest Block Id</TableCell>
              <TableCell align="right">Rendered Block Count</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TaskList tasks={tasks} complete={complete} />
        </Table>
      </TableContainer>
      <Button
        style={{ marginTop: "5px" }}
        variant="contained"
        color="secondary"
      >
        STOP ALL
      </Button>
    </div>
  );
}

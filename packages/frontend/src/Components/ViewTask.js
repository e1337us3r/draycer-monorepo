import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import TableBody from "@material-ui/core/TableBody";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { makeStyles } from "@material-ui/core/styles";
import API from "../api/client";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function ViewTask() {
  let { id } = useParams();
  const [render, setRender] = useState([]);
  const [workerRecord, setWorkerRecord] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    API.scene.get(id).then((data) => {
      setRender(data.render);
    });
    API.scene.getWorkRecords(id).then((data) => {
      setWorkerRecord(data.results);
    });
    const fetchSceneAndWorkers = setInterval(() => {
      API.scene.get(id).then((data) => {
        setRender(data.render);
      });
      API.scene.getWorkRecords(id).then((data) => {
        setWorkerRecord(data.results);
      });
    }, 3000);

    return () => clearInterval(fetchSceneAndWorkers);
  }, [id]);

  return (
    <div
      style={{ display: "flex", flexDirection: "row wrap", padding: "10px" }}
      elevation={3}
    >
      <img style={{ flex: "0 0 50%" }} src={render} alt="" />
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Worker</TableCell>
              <TableCell align="right">JobID</TableCell>
              <TableCell align="right">UserID</TableCell>
              <TableCell align="right">Last Render At</TableCell>
              <TableCell align="right">Rendered Block Count</TableCell>
            </TableRow>
          </TableHead>
          {console.log(workerRecord)}
          <RecordList records={workerRecord} />
        </Table>
      </TableContainer>
    </div>
  );
}

const RecordList = ({ records }) => {
  return (
    <TableBody>
      {records.map((record, ind) => (
        <TableRow key={record.job_id}>
          <TableCell component="th" scope="row">
            #{ind + 1}
          </TableCell>
          <TableCell align="right">{record.job_id}</TableCell>
          <TableCell align="right">{record.user_id}</TableCell>
          <TableCell align="right">
            {new Date(record.last_render_at).toLocaleDateString("tr-TR")}
          </TableCell>
          <TableCell align="right">{record.rendered_block_count}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

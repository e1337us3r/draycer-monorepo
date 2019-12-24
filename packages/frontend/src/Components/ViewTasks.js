import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles({
    table: {
        minWidth: 650
    }
});
export default function ViewTasks() {
    const classes = useStyles();
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
                <TableBody>
                    <TableRow>
                        <TableCell component="th" scope="row">
                            8382934
                        </TableCell>
                        <TableCell align="right">Movie #1</TableCell>
                        <TableCell align="right">11.09.2019</TableCell>
                        <TableCell align="right">3 days</TableCell>
                        <TableCell align="right">Progress</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell component="th" scope="row">
                            7712123
                        </TableCell>
                        <TableCell align="right">Kitchen</TableCell>
                        <TableCell align="right">09.09.2019</TableCell>
                        <TableCell align="right">7 days</TableCell>
                        <TableCell align="right">Completed</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}

import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles({
    table: {
        minWidth: 650
    }
});
export default function Services() {
    const classes = useStyles();
    return (
        <div>
            <TableContainer component={Paper} style={{ marginTop: "5%" }}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell align="right">Owner</TableCell>
                            <TableCell align="right">Task</TableCell>
                            <TableCell align="right">Completed</TableCell>
                            <TableCell align="right">Assigned</TableCell>
                            <TableCell align="right">Status</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                1552346
                            </TableCell>
                            <TableCell align="right">SuperRenderer23</TableCell>
                            <TableCell align="right">Movie #1</TableCell>
                            <TableCell align="right">5345/5563</TableCell>
                            <TableCell align="right">15</TableCell>
                            <TableCell align="right">In Progress</TableCell>
                            <TableCell align="right">
                                <Button variant="contained" color="secondary">
                                    PAUSE
                                </Button>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                1552346
                            </TableCell>
                            <TableCell align="right">Disney</TableCell>
                            <TableCell align="right">
                                The Cute Prince & Princess
                            </TableCell>
                            <TableCell align="right">24311/345145</TableCell>
                            <TableCell align="right">5623</TableCell>
                            <TableCell align="right">In Progress</TableCell>
                            <TableCell align="right">
                                <Button variant="contained" color="secondary">
                                    PAUSE
                                </Button>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                1552346
                            </TableCell>
                            <TableCell align="right">Marvel</TableCell>
                            <TableCell align="right">Batman Animated</TableCell>
                            <TableCell align="right">2301/98855</TableCell>
                            <TableCell align="right">853</TableCell>
                            <TableCell align="right">In Progress</TableCell>
                            <TableCell align="right">
                                <Button variant="contained" color="secondary">
                                    PAUSE
                                </Button>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                1552346
                            </TableCell>
                            <TableCell align="right">Pixar</TableCell>
                            <TableCell align="right">
                                Star Wars: Sith Warrior
                            </TableCell>
                            <TableCell align="right">455123/455123</TableCell>
                            <TableCell align="right">-</TableCell>
                            <TableCell align="right">Completed</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                9882834
                            </TableCell>
                            <TableCell align="right">MikeJackson</TableCell>
                            <TableCell align="right">Kitchen</TableCell>
                            <TableCell align="right">15345</TableCell>
                            <TableCell align="right">-</TableCell>
                            <TableCell align="right">Completed</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <Button variant="contained" color="secondary">
                STOP ALL
            </Button>
        </div>
    );
}

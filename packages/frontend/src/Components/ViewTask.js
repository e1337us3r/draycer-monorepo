import React, {useEffect, useState} from "react";
import * as axios from "axios";
import CONFIG from "../config";
import {useParams} from "react-router-dom";
import Paper from "@material-ui/core/Paper";

export default function ViewTask() {

  let { id } = useParams();
  const [render, setRender] = useState([]);

  useEffect(()=>{
    axios.get(CONFIG.serverUrl + "/scene/" + id).then(res => {
      console.log(res.data);
      setRender(res.data.render)
    });
  }, [id]);

  return (
    <Paper elevation={3}>
      <img style={{margin: "0 auto"}} src={render} alt=""/>
    </Paper>
  )
}
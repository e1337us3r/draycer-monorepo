import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import API from "../api/client";

export default function ViewTask() {

  let { id } = useParams();
  const [render, setRender] = useState([]);

  useEffect(()=>{
    API.scene.get(id).then(data => {
      setRender(data.render)
    });
  }, [id]);

  return (
    <Paper elevation={3}>
      <img style={{margin: "0 auto"}} src={render} alt=""/>
    </Paper>
  )
}
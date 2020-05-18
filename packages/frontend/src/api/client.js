import config from "../config";
import axios from 'axios'

export const getScene = async (id) => {

  const response = await axios(`${config.serverUrl}/scene/${id}`)
  return response.data
}

export const pauseTask = async (id) => {
  const response = await axios.post(`${config.serverUrl}/scene/${id}/pause`);
  return response.status;
};

export const continueTask = async (id) => {
  const response = await axios.post(`${config.serverUrl}/scene/${id}/continue`);
  return response.status;
};

export const getWorkerRecord = async () => {
  const response = await axios(`${config.serverUrl}/user/work_record`);

  return response.data;
}


export const getSceneWorkRecord = async (id) => {
  const response = await axios(`${config.serverUrl}/scene/${id}/work_record`)

  return response.data;
}
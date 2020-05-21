import * as axios from "axios";
import CONFIG from "../config";

const getConfig = async () => {
  return {
    headers:
      { authorization: `Bearer ${localStorage.getItem("token")}` }
  }
}

const API = {
  userId: "",
  token: "",
  user: {
    baseUrl: CONFIG.serverUrl + "/user",
    getWorkRecords: async () => {
      return (await axios.get(API.user.baseUrl + "/work_record", await getConfig())).data
    }
  },
  scene: {
    baseUrl: CONFIG.serverUrl + "/scene",
    get: async (id, getRawScene) => {
      return (await axios.get(API.scene.baseUrl + `/${id}?raw=${getRawScene === true}`, await getConfig())).data
    },
    getAll: async () => {
      return (await axios.get(API.scene.baseUrl, await getConfig())).data
    },
    create: async (scene) => {
      return (await axios.post(API.scene.baseUrl, { scene }, await getConfig())).data
    },
    pause: async (id) => {
      return (await axios.post(API.scene.baseUrl + `/${id}/pause`, {}, await getConfig())).status
    },
    continue: async (id) => {
      return (await axios.post(API.scene.baseUrl + `/${id}/continue`, {}, await getConfig())).status
    },
    getWorkRecords: async (id) => {
      return (await axios.get(API.scene.baseUrl + `/${id}/work_record`, await getConfig())).data
    }
  }
};



export default API;

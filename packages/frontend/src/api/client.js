import config from "../config";

export const pauseTask = async (id) => {
  const response = await fetch(`${config.serverUrl}/scene/${id}/pause`, {
    method: "POST",
  });
  return response.status;
};

export const continueTask = async (id) => {
  const response = await fetch(`${config.serverUrl}/scene/${id}/continue`, {
    method: "POST",
  });

  return response.status;
};

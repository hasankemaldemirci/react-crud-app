import axios from "axios";

const apiURL = process.env.REACT_APP_REQRES_API;

function getUsers() {
  const response = axios.get(`${apiURL}/users`);

  return response;
}

export { getUsers };

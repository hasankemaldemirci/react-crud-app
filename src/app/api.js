import axios from "axios";

const apiURL = process.env.REACT_APP_REQRES_API;

function getUsers() {
  const response = axios.get(`${apiURL}/users`);

  return response;
}

function postUser({ first_name, last_name, email }) {
  const response = axios.post(`${apiURL}/users`, {
    email,
    first_name,
    last_name
  });

  return response;
}

function patchUser(id, user) {
  const response = axios.patch(`${apiURL}/users/${id}`, {
    avatar: user.avatar,
    id: id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name
  });

  return response;
}

export { getUsers, postUser, patchUser };

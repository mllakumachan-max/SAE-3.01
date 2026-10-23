import { postRequest } from "../lib/api-request.js";

let AuthData = {};

AuthData.login = async function (login, mdp) {
  return postRequest("login", { login, mdp });
};

AuthData.register = async function (login, mdp, mdpConfirmation) {
  return postRequest("register", { login, mdp, mdp_confirmation: mdpConfirmation });
};

AuthData.logout = async function () {
  return postRequest("logout");
};

export { AuthData };

import axios from "axios";

const setAuthToken = jwtToken => {
  if (jwtToken) {
    // Apply to every req
    axios.defaults.headers.common["Authorization"] = jwtToken;
  } else {
    // delete if not available
    delete axios.defaults.headers.common["Authorization"];
  }
};

export default setAuthToken;

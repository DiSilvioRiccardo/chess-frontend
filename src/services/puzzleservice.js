import axios from "axios";

const API_URL = "http://localhost:8000/puzzles/";

const config = {
  headers: {
    Authorization: "Token " + JSON.parse(localStorage.getItem("token")),
  },
};

const getProfile = () => {
  return axios
    .get("http://localhost:8000/auth/profile", config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
};

const getPuzzle = () => {
  return axios
    .get(API_URL, config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
};

const SendChessPuzzleResult = (result) => {
  return axios
    .post(API_URL + "solution", result, config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
};

const submitForm = () => {
  const profile = getProfile();

  if (!profile.did_initial_form) {
    const type = { type: 0 };
    return axios
      .post(API_URL + "form_report", type, config)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
  } else if (!profile.did_700_form) {
    const type = { type: 700 };
    return axios
      .post(API_URL + "form_report", type, config)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
  } else if (!profile.did_1500_form) {
    const type = { type: 1500 };
    return axios
      .post(API_URL + "form_report", type, config)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
  }
};

const sendLogicPuzzleResult = (result) => {
  return axios
    .post(API_URL + "logic_puzzle/solution", result, config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
};

const PuzzleService = {
  getProfile,
  getPuzzle,
  submitForm,
  SendChessPuzzleResult,
  sendLogicPuzzleResult,
};

export default PuzzleService;

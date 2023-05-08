import axios from "axios";

const API_URL = "http://localhost:8000/puzzles/";

const config = {
  headers: {
    Authorization: JSON.parse(localStorage.getItem("token")),
  },
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

const SendPuzzleResult = (result) => {
  return axios
    .post(API_URL, config, {
      result,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
};

const PuzzleService = {
  getPuzzle,
  SendPuzzleResult,
};

export default PuzzleService;

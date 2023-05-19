import { useState, useEffect } from "react";
import Box from "@mui/material/Box";

import { useAuth } from "../../common/authHook.js";
import { useNavigate } from "react-router-dom";
import PuzzleService from "../../services/puzzleservice";
import Backdrop from "@mui/material/Backdrop";
import { CircularProgress } from "@mui/material";

import Form from "./form";
import Chess from "./chess/chess.js";
import Quiz from "./quiz";

function Puzzle() {
  const { auth } = useAuth();

  const [loading, setLoading] = useState(true);
  const [puzzle, setPuzzle] = useState({});

  const [isLogic, setIsLogic] = useState(false);
  const [didForm, setDidForm] = useState(false);
  const [profile, setProfile] = useState({});

  const navigate = useNavigate();

  const requestPuzzle = async () => {
    const puzzle = await PuzzleService.getPuzzle();
    if (puzzle.type === "logic") {
      setIsLogic(true);
    } 
    setPuzzle(puzzle);
    setLoading(false);
  };

  const requestProfile = async () => {
    const response = await PuzzleService.getProfile();
    setProfile(response);
    if (response.did_initial_form && response.elo < 700) {
      setDidForm(true);
    } else if (response.did_700_form && response.elo < 1500) {
      setDidForm(true);
    } else if (response.did_1500_form) {
      setDidForm(true);
    }else{
      setLoading(false);
    }

  };

  const checkForm = () => {};

  const redirectToLogin = () => {
    navigate("/login");
  };

  useEffect(() => {
    requestProfile();
    checkForm();
    requestPuzzle();
  }, []);

  return (
    <>
      {auth ? (
        <>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          {loading ? null : (
            <Box>
              {didForm ? (
                <Box>
                  {isLogic ? (
                    <Box sx={{ padding: "30px" }}><Quiz puzzle={puzzle} profile={profile} /></Box>
                  ) : (
                    <Box sx={{ padding: "30px" }}><Chess fen={puzzle.fen} moves={puzzle.moves} puzzleId={puzzle.puzzleId} rating={puzzle.rating}/></Box>
                  )}
                </Box>
              ) : (
                <Box sx={{ padding: "30px" }}><Form /></Box>
              )}
            </Box>
          )}
        </>
      ) : (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
          onClick={redirectToLogin}
        >
          Necesitas estar logueado para ver esta pagina
        </Backdrop>
      )}
    </>
  );
}

export default Puzzle;

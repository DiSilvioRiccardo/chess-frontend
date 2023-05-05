import { useState } from "react";
import Question from "./question";
import data from "./data";
import './home.css';

import { useAuth } from "../../common/authHook";

function Home() {
  const [questions, setQuestions] = useState(data);
  const { auth } = useAuth();

  return (
    <div className="home">
      <div className="containerHome">
        {auth ? (
          questions.map((question) => (
            <Question key={question.id} {...question} />
          ))
        ) : (
          <p>You need to be authenticated to see the questions</p>
        )}
      </div>
    </div>
  );
}

export default Home;

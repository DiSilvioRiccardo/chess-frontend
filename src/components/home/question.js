import React, { useState } from "react";

const Question = ({ title, info }) => {
  const [showText, setShowText] = useState(false);
  const [readMore, setReadMore] = useState(false);

  return (
    <div className="question">
      <div>
        <h3>{title}</h3>
        <span onClick={() => setShowText(!showText)}>
          {!showText ? "+" : "-"}
        </span>
      </div>

      <p>
        {showText && (
          <>
            <p>{readMore ? info : `${info.substring(0, 100)}...`}<button className="read-more" onClick={() => setReadMore(!readMore)}>
              {readMore ? "show less" : "  read more"}
            </button></p>
            
          </>
        )}
      </p>
    </div>
  );
};

export default Question;

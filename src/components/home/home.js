import React, { useState } from "react";

function Accordion() {
  const [isExpanded, setIsExpanded] = useState(false);

  function handleToggle() {
    setIsExpanded(!isExpanded);
  }

  return (
    <div>
      <button onClick={handleToggle}>
        {isExpanded ? "Collapse" : "Expand"}
      </button>
      {isExpanded && (
        <div>
          <p>Menu Item 1</p>
          <p>Menu Item 2</p>
          <p>Menu Item 3</p>
        </div>
      )}
    </div>
  );

}

export default Accordion;
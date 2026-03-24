import { useState } from "react";

function Description({ text }:{text:string}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col">
      <p
        className={`text-sm text-gray-600 leading-relaxed ${
          expanded ? "" : "line-clamp-6"
        }`}
      >
        {text}
      </p>

      <button
        onClick={() => setExpanded(!expanded)}
        className="text-blue-500 text-sm font-medium self-end"
      >
        {expanded ? "Show less" : "Read more"}
      </button>
    </div>
  );
}

export default Description
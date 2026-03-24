import { useState, useRef, useEffect } from "react";

function Description({ text }:{text:string}) {
  const [expanded, setExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    // check if content is overflowing (more than 6 lines)
    setShowButton(el.scrollHeight > el.clientHeight);
  }, [text]);

  return (
    <div className="flex flex-col">
      <p
        ref={textRef}
        className={`text-sm text-gray-600 leading-relaxed ${
          expanded ? "" : "line-clamp-6"
        }`}
      >
        {text}
      </p>

      {showButton && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-blue-500 text-sm font-medium self-end"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}

export default Description

import { useEffect, useRef, useState } from "react";

interface prop {
  text: string;
  onClick: () => void
}

export default function V2_LineClamp({ text }: prop) {
  const textRef = useRef<HTMLParagraphElement>(null);


  return (
    <div className="max-w-sm">
      <p ref={textRef} className="line-clamp-2 text-sm">
        {text}
      </p>

      {/* {isClamped && (
        <input type="button"
          onClick={onClick}
          className="hover:pointer text-blue-500 text-sm font-medium p-0">
          Read more
        </input>
      )} */}
    </div>
  );
}

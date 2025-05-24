import React, { useState, useEffect } from "react";

export default function TopWilaya({ data }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const lastIndex = data.length - 1;
    if (index < 0) setIndex(lastIndex);
    if (index > lastIndex) setIndex(0);
  }, [index, data.length]);

  return (
    <div className="w-full h-full relative overflow-hidden">
      {data.map((item, itemIndex) => {
        let position = "next-slide";
        if (index === itemIndex) position = "active-slide";
        if (
          itemIndex === index - 1 ||
          (index === 0 && itemIndex === data.length - 1)
        )
          position = "last-slide";
        if (itemIndex === (index + 1) % data.length)
          position = "second-active-slide";

        return (
          <div
            key={itemIndex}
            className={`absolute  w-[20vw] h-[75%] py-4 px-6 bg-white shadow-lg rounded-xl border border-gray-200 transition-all duration-500 ease-in-out transform
              ${position === "active-slide" ? "left-4 opacity-100 translate-x-0" : ""}
              ${position === "second-active-slide" ? "left-8 opacity-100 translate-x-[125%]" : ""}
              ${position === "last-slide" ? "opacity-0 translate-x-[-100%]" : ""}
              ${position === "next-slide" ? "opacity-0 translate-x-[200%]" : ""}
            `}
          >
            <h2 className="text-xl font-semibold mb-4">{item.espece}</h2>
            <ol className="space-y-2">
              {item.topWilayas.map((w, i) => (
                <li key={i} className="flex justify-between">
                  <span className="font-medium">
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"} {w.wilaya}
                  </span>
                  <span className="text-gray-600">{w.production}</span>
                </li>
              ))}
            </ol>
          </div>
        );
      })}

      <button
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-indigo-500 text-white px-3 py-1 rounded-full"
        onClick={() => setIndex(index - 1)}
      >
        ‹
      </button>
      <button
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-indigo-500 text-white px-3 py-1 rounded-full"
        onClick={() => setIndex(index + 1)}
      >
        ›
      </button>
    </div>
  );
}

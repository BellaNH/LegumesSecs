import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../../context";
import axios from "axios";
import { MdOutlineNavigateNext } from "react-icons/md";
import { MdOutlineNavigateBefore } from "react-icons/md";
import Une from "../pics/Une.png";
import Deux from "../pics/Deux.png";
import Trois from "../pics/Trois.png";
export default function TopWilayaCopy() {
 const [topthreeWilaya,setTopThreeWilaya] = useState("")
 const {url,user}= useGlobalContext()

  const array = [
  {
    nom: "Smartphones",
    top_locations: [
      { label: "XPhone 12", sales: 1200 },
      { label: "XPhone 12 Pro", sales: 950 },
      { label: "XPhone 13", sales: 870 }
    ]
  },
  {
    nom: "Laptops",
    top_locations: [
      { label: "UltraBook Air", sales: 560 },
      { label: "UltraBook Pro", sales: 740 },
      { label: "UltraBook Max", sales: 430 }
    ]
  },
  {
    nom: "Accessoires",
    top_locations: [
      { label: "Casque Audio", sales: 320 },
      { label: "UltraRapide", sales: 280 },
      { label: "Antichoc", sales: 150 }
    ]
  },
  {
    nom: "Services",
    top_locations: [
      { label: "Cloud Basic", sales: 210 },
      { label: "Cloud Pro", sales: 170 },
      { label: "Cloud Entreprise", sales: 95 }
    ]
  }
];

const [index, setIndex] = useState(0);

useEffect(() => {
  const lastIndex = array.length - 1;
  if (index < 0) setIndex(lastIndex);
  if (index > lastIndex) setIndex(0);
}, [index]);

return (
  <div className="w-full h-full relative overflow-hidden">
    {array.map((item, itemIndex) => {
      let position = "next-slide";
      if (index === itemIndex) position = "active-slide";
      if (
        itemIndex === index - 1 ||
        (index === 0 && itemIndex === array.length - 1)
      )
        position = "last-slide";
      if (itemIndex === (index + 1) % array.length)
        position = "second-active-slide";

      return (
        <div
          key={itemIndex}
          className={`absolute w-[20vw] h-[85%] py-4 px-6 bg-white shadow-lg rounded-xl border border-gray-200 transition-all duration-500 ease-in-out transform
            ${position === "active-slide" ? "left-4 opacity-100 translate-x-0" : ""}
            ${position === "second-active-slide" ? "left-8 opacity-100 translate-x-[125%]" : ""}
            ${position === "last-slide" ? "opacity-0 translate-x-[-100%]" : ""}
            ${position === "next-slide" ? "opacity-0 translate-x-[200%]" : ""}
          `}
        >
          <h2 className="text-xl font-semibold mb-4">{item.nom}</h2>

          {item.top_locations.map((loc, i) => (
            <ol key={i} className="flex gap-4 align-center mt-2">
              {i === 0 && <img src={Une} alt="" className="w-7" />}
              {i === 1 && <img src={Deux} alt="" className="w-7" />}
              {i === 2 && <img src={Trois} alt="" className="w-7" />}
              <li className="flex justify-between w-full">
                <span className="font-medium">{loc.label}</span>
                <span className="absolute right-6">{loc.sales} unités</span>
              </li>
            </ol>
          ))}
        </div>
      );
    })}

    <button
      className=" absolute top-3/4 left-8 transform -translate-y-1/2 bg-[#1D4ED8] text-white px-3 py-2 rounded-full"
      onClick={() => setIndex(index - 1)}
    >
      <MdOutlineNavigateBefore size={20} />
    </button>
    <button
      className="absolute top-3/4 right-20 transform -translate-y-1/2 bg-[#1D4ED8] text-white px-3 py-2 rounded-full"
      onClick={() => setIndex(index + 1)}
    >
      <MdOutlineNavigateNext size={20} />
    </button>
  </div>
);

}


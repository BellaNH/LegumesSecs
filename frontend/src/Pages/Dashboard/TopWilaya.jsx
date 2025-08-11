import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../../context";
import axios from "axios";
import { MdOutlineNavigateNext } from "react-icons/md";
import { MdOutlineNavigateBefore } from "react-icons/md";
import Une from "../pics/Une.png";
import Deux from "../pics/Deux.png";
import Trois from "../pics/Trois.png";
export default function TopWilaya() {
 const [topthreeWilaya,setTopThreeWilaya] = useState("")
 const {url,user}= useGlobalContext()

  useEffect(()=>{
       const fetchTopThreeWilayas = async ()=>{
      console.log(user)
    if(user){
    try {
          const response =   await axios.get(
              `${url}/api/top_wilayas/`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            )
        console.log(response.data)
        setTopThreeWilaya(response.data)
         
          } catch (error) {
            console.error( error);
          }
        } 
  }
    fetchTopThreeWilayas()
  },[user])
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!Array.isArray(topthreeWilaya)) return;

    const lastIndex = topthreeWilaya.length - 1;
    if (index < 0) setIndex(lastIndex);
    if (index > lastIndex) setIndex(0);
  }, [index, topthreeWilaya]);

  if (!Array.isArray(topthreeWilaya) || topthreeWilaya.length === 0) {
    return <div className="text-center text-gray-500">Loading top wilayas...</div>;
  }

  return (
    <div className="w-full h-full relative overflow-hidden">
      {topthreeWilaya.map((item, itemIndex) => {
  let position = "next-slide";
  if (index === itemIndex) position = "active-slide";
  if (
    itemIndex === index - 1 ||
    (index === 0 && itemIndex === topthreeWilaya.length - 1)
  )
    position = "last-slide";
  if (itemIndex === (index + 1) % topthreeWilaya.length)
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
      <h2 className="text-xl font-semibold mb-4">{item.espece}</h2>
      <ol className="flex gap-4 align-center mt-2">
        <img src={Une} alt="" className="w-7"/>
        <li className="flex justify-between">
          <span className="font-medium"> {item.top_locations[0].label}</span>
          <span className="absolute right-6">{item.top_locations[0].total_production} </span>
        </li>
      </ol>
      {item.top_locations.length > 1 && 
      <ol className="flex gap-4 align-center mt-2">
        <img src={Deux} alt="" className="w-7"/>
        <li className="flex justify-between">
          <span className="font-medium"> {item?.top_locations[1]?.label}</span>
          <span className="absolute right-6">{item?.top_locations[1]?.total_production} </span>
        </li>
      </ol>}
      {item.top_locations.length > 2 && 
      <ol className="flex gap-4 align-center mt-2">
        <li className="flex justify-between">
          <span className="font-medium"> {item?.top_locations[2]?.label}</span>
          <span className="absolute right-6">{item?.top_locations[2]?.total_production} </span>
        </li>
      </ol>}
      
    </div>
  );
})}


      <button
        className=" absolute top-3/4 left-8 transform -translate-y-1/2 bg-green-600 text-white px-3 py-2 rounded-full"
        onClick={() => setIndex(index - 1)}
      >
        <MdOutlineNavigateBefore size={20} />
      </button>
      <button
        className="absolute top-3/4 right-20 transform -translate-y-1/2 bg-green-600 text-white px-3 py-2 rounded-full"
        onClick={() => setIndex(index + 1)}
      >
        <MdOutlineNavigateNext  size={20}/>
      </button>
    </div>
  );
}


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
    console.log("📊 [TOP_WILAYA] TopWilaya component mounted, user:", user);
    
       const fetchTopThreeWilayas = async ()=>{
    if(user){
      console.log("📡 [TOP_WILAYA] Fetching top wilayas...");
      console.log("🔗 [TOP_WILAYA] URL:", `${url}/api/top_wilayas/`);
    try {
          const response =   await axios.get(
              `${url}/api/top_wilayas/`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            )
          console.log("✅ [TOP_WILAYA] Top wilayas fetched successfully");
          console.log("📊 [TOP_WILAYA] Response data:", response.data);
          console.log("📊 [TOP_WILAYA] Data length:", Array.isArray(response.data) ? response.data.length : "Not an array");
        setTopThreeWilaya(response.data)
         
          } catch (error) {
            console.error("❌ [TOP_WILAYA] Error fetching top wilayas:", error);
            console.error("❌ [TOP_WILAYA] Error response:", error.response?.data);
            console.error("❌ [TOP_WILAYA] Error status:", error.response?.status);
            console.error("❌ [TOP_WILAYA] Full error:", error);
            setTopThreeWilaya("")
          }
        } else {
          console.log("ℹ️ [TOP_WILAYA] No user, skipping top wilayas fetch");
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
    <div className="w-full h-full flex flex-col relative  overflow-hidden">

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
              className={`absolute w-[100%] h-[100%] py-4 px-6 bg-white shadow-lg rounded-xl border border-gray-200 transition-all duration-500 ease-in-out transform
                ${position === "active-slide" ? "left-0 opacity-100 translate-x-0" : ""}
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
      
      <div className=" flex-shrink-0 z-10 mt-[65%] flex justify-between items-center py-2 px-4">
        <button
          className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors"
          onClick={() => setIndex(index - 1)}
          aria-label="Previous"
        >
          <MdOutlineNavigateBefore size={20} />
        </button>
        <button
          className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors"
          onClick={() => setIndex(index + 1)}
          aria-label="Next"
        >
          <MdOutlineNavigateNext size={20} />
        </button>
      </div>
    </div>
  );
}


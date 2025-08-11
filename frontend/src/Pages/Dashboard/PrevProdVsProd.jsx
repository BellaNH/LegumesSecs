import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../../context";
import axios from "axios";
import { MdOutlineNavigateNext } from "react-icons/md";
import { MdOutlineNavigateBefore } from "react-icons/md";



export default function PrevProdVsProd() {
const [prevProdVsProductionData,setPrevProdVsProductionData] = useState("")
 const {url,user}= useGlobalContext()

  useEffect(()=>{
       const fetchPrevVsProduction = async ()=>{
        console.log(user)
        if(user){
        try {
              const response =   await axios.get(
                  `${url}/api/prev_vs_prod/`,
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  }
                )
                console.log(response.data)
             setPrevProdVsProductionData(response.data)
             
              } catch (error) {
                console.error( error);
              }
            }  
      }
    fetchPrevVsProduction()
  },[user])
  const [index, setIndex] = useState(0);


  return (
    <div className="w-full h-full p-4 flex flex-col gap-2 text-sm">
 
      <div className="grid grid-cols-3 px-3 py-2 rounded-xl bg-green-600 text-[#14532d] font-semibold shadow-sm">
        <span className="text-white">Espèce</span>
        <span className="text-center text-white">Prévision</span>
        <span className="text-right text-white">Production</span>
      </div>

      <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-green-300 pr-1 max-h-[90%]">
        {prevProdVsProductionData && prevProdVsProductionData.length > 0 ? (
          prevProdVsProductionData.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-3 items-center px-3 py-2 rounded-lg mb-1 bg-white hover:bg-[#f0fdf4] text-gray-800 shadow transition duration-150 ease-in-out"
            >
              <span className="truncate">{item.espece}</span>
              <span className="text-center text-yellow-500 font-medium">
                {item.prev_de_production}
              </span>
              <span className="text-right text-green-700 font-semibold">
                {item.production}
              </span>
            </div>
          ))
        ) : (
          <div className="text-gray-500 italic text-center pt-4">
            Aucune donnée disponible
          </div>
        )}
      </div>
    </div>
  );
  
}
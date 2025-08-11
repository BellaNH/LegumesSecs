import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../../context";
import axios from "axios";
import { MdOutlineNavigateNext } from "react-icons/md";
import { MdOutlineNavigateBefore } from "react-icons/md";



export default function PrevProdVsProdCopy() {
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


const businessData = [
  {
    produit: "Phones",
    prev_de_ventes: 1500,
    ventes: 1320
  },
  {
    produit: "Laptops",
    prev_de_ventes: 900,
    ventes: 870
  },
  {
    produit: "Accessories",
    prev_de_ventes: 500,
    ventes: 430
  },
  {
    produit: "Services",
    prev_de_ventes: 300,
    ventes: 295
  }
];

return (
<div className="w-full h-full p-4 flex flex-col gap-2 text-sm">

  {/* Header */}
  <div className="grid grid-cols-3 px-3 py-2 rounded-xl bg-[#1D4ED8] text-white font-semibold shadow-sm">
    <span>Produit</span>
    <span className="text-center">Prévision</span>
    <span className="text-right">Ventes</span>
  </div>

  {/* Content */}
  <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-[#8B5CF6] pr-1 max-h-[90%]">
    {businessData && businessData.length > 0 ? (
      businessData.map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-3 items-center px-3 py-2 rounded-lg mb-1 bg-white hover:bg-[#EEF2FF] text-gray-800 shadow transition duration-150 ease-in-out"
        >
          <span className="truncate">{item.produit}</span>
          <span className="text-center text-[#3B82F6] font-medium">
            {item.prev_de_ventes}
          </span>
          <span className="text-right text-[#8B5CF6] font-semibold">
            {item.ventes}
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
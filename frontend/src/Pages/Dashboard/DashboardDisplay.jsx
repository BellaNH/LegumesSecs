import { FaDollarSign, FaTasks } from "react-icons/fa";
import { AiOutlineProject } from "react-icons/ai";
import EspeceSurfaceChart from "./EspeceSurfaceChart ";
import { useEffect } from 'react';
import React, { useState } from 'react'
import ProductionChart from "./ProductionChart.jsx";
import TopWilaya from "./TopWilaya.jsx";
import axios from "axios";
import { useGlobalContext } from "../../context";





export default function DashboardDisplay() {
  const {url,user}= useGlobalContext()
  const [totalAgri,setTotalAgri] = useState("")
  const [superficieData,setSuperficieData] = useState("")
  const [yearlyProduct,setYearlyProduct] = useState("")
 useEffect(()=>{
    const fetchTotalNumActiveAgri = async ()=>{
      console.log(user)
    if(user){
    try {
          const response =   await axios.get(
              `${url}/api/agriculteur/active_this_year/`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            )
            console.log(response.data)
          setTotalAgri(response.data)
          } catch (error) {
            console.error( error);
          }
        }
  }

  const fetchSuperficieData = async ()=>{
      console.log(user)
    if(user){
    try {
          const response =   await axios.get(
              `${url}/api/parcelle/aggregated-stats/`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            )
            console.log(response.data)
          setSuperficieData(response.data)
          } catch (error) {
            console.error( error);
          }
        }
  }
 

  const fetchYearlyProductionPerEspece = async ()=>{
      console.log(user)
    if(user){
    try {
          const response =   await axios.get(
              `${url}/api/parcelle/yearly-production/`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            )
            console.log(response.data)
         setYearlyProduct(response.data)
          } catch (error) {
            console.error( error);
          }
        }
  }

  fetchTotalNumActiveAgri()
  fetchSuperficieData()
  fetchYearlyProductionPerEspece()
 },[user])





  const topWilayaData = [
  {
    espece: "Harricot",
    topWilayas: [
      { wilaya: "Constantine", production: 1200 },
      { wilaya: "Sétif", production: 1100 },
      { wilaya: "Batna", production: 980 },
    ],
  },
  {
    espece: "Pois",
    topWilayas: [
      { wilaya: "Oran", production: 1000 },
      { wilaya: "Blida", production: 950 },
      { wilaya: "Mostaganem", production: 900 },
    ],
  },
  // etc...
];


  
 const [index, setIndex] = useState(0);
     useEffect(() => {
        let lastIndex = superficieData.length - 1;
        if (index < 0) {
          setIndex(lastIndex);
        }
        if (index > lastIndex) {
          setIndex(0);
        }
      }, [index, superficieData])
  
  return (
    <div className="w-[80%] flex flex-col min-h-screen  ">
      <div className="ml-8 mt-4 grid grid-cols-4 w-[62%] h-[15%] gap-4 ">
        <StatCard icon={<FaDollarSign />} title="Agriculteurs" value={totalAgri} />
        <StatCard icon={<FaTasks />} title="New Tasks" value="154" />
        <StatCard icon={<FaDollarSign />} title="Sales" value="$574.34" />
        <StatCard icon={<AiOutlineProject />} title="Total Projects" value="2935" />
      </div>
      <div className="absolute top-4 right-4 w-[25vw] h-[50vh]">
        <TopWilaya data={topWilayaData}/>
      </div>
      <div className="w-full flex ">
     <div className="w-full h-[70vh] overflow-hidden relative ">
      {superficieData && superficieData.map((chart,chartIndex)=>{
              let position = "next-slide";
                if (index === chartIndex) {
                  position = "active-slide";
                } else if (chartIndex === (index + 1) % superficieData.length) {
                  position = "second-active-slide";
                }
                if (
                  chartIndex === index - 1 ||
                  (index === 0 && chartIndex === superficieData.length - 1)
                ) {
                  position = "last-slide";
                }
            
    return (
      <div
        key={chartIndex}
        className={`absolute top-[7%]  w-[35vw] h-[70vh] py-4 px-4 flex flex-col transition-all duration-500 ease-in-out transform 
          ${position === "active-slide" ? "left-4 opacity-100 translate-x-0 " : ""}
          ${position === "second-active-slide" ? "left-8 opacity-100 translate-x-[125%]" : ""}
          ${position === "last-slide" ? "opacity-0 translate-x-[-100%]" : ""}
          ${position === "next-slide" ? "opacity-0 translate-x-[200%]" : ""}
        `}
      >
        <EspeceSurfaceChart data={[chart]} />
      </div>
    );
          
              
      })}
      <button
        onClick={() => setIndex(index - 1)}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-indigo-600 text-white px-3 py-1 rounded-full shadow"
      >
        ‹
      </button>
      <button
        onClick={() => setIndex(index + 1)}
        className="absolute top-1/2 right-28 transform -translate-y-1/2 bg-indigo-600 text-white px-3 py-1 rounded-full shadow"
      >
        ›
      </button>
    </div>
       <div className="relative w-[90vw] h-[60%] top-32 right-4">
        <ProductionChart data={yearlyProduct}/>
        </div>
    </div>
  
      
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="w-[100%] h-[80%] bg-white p-4 rounded-xl shadow-md flex items-center space-x-4">
      <div className="text-blue-500 text-3xl">{icon}</div>
      <div>
        <p className="text-gray-500 text-sm font-semibold">{title}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  );
}

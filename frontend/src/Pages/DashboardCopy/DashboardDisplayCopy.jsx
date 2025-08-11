import { FaDollarSign, FaTasks } from "react-icons/fa";
import { AiOutlineProject } from "react-icons/ai";
import EspeceSurfaceChartCopy from "./EspeceSurfaceChartCopy .jsx";
import { useEffect } from 'react';
import React, { useState } from 'react'
import ProductionChartCopy from "./ProductionChartCopy.jsx";
import TopWilayaCopy from "./TopWilayaCopy.jsx";
import axios from "axios";
import { useGlobalContext } from "../../context.jsx";
import { MdOutlineNavigateNext } from "react-icons/md";
import { MdOutlineNavigateBefore } from "react-icons/md";
import Agriculteur from "../pics/Agriculteur.png"
import Haricotsverts from "../pics/Haricotsverts.png"
import  BarChart  from "../pics/BarChart.png"
import  Plante  from "../pics/Plante.png"
import { FaArrowDown } from "react-icons/fa";
import PrevProdVsProdCopy from "./PrevProdVsProdCopy.jsx";
import Amande from "../pics/Amande.png"
import Feu from "../pics/Feu.png"
import Une from "../pics/Une.png"
import Deux from "../pics/Deux.png"
import Trois from "../pics/Trois.png"
import Jardinage from "../pics/Jardinage.png"
import Employees from "../pics/Employees.png"
import Alerte from "../pics/Alerte.png"
import Usine from "../pics/Usine.png"
import Graphique from "../pics/Graphique.png"

export default function DashboardDisplayCopy() {
  const {url,user}= useGlobalContext()
  const [totalAgri,setTotalAgri] = useState("")
  const [superficieData,setSuperficieData] = useState("")
  const [yearlyProduct,setYearlyProduct] = useState("")
  const [numEspeces,setNumEspeces] = useState("")
  const [totalProdction,setTotalProduction] = useState("")
  const [totalSupLabouree,setTotalSupLanouree] = useState("")

  const aggregatedSupStats = [
  { produit: "Phones", zoneProduction: 320, pannes: 25, productionTotale: 295 },
  { produit: "Laptops", zoneProduction: 340, pannes: 30, productionTotale: 310 },
  { produit: "Accessoires", zoneProduction: 310, pannes: 20, productionTotale: 290 },
  { produit: "Services", zoneProduction: 360, pannes: 40, productionTotale: 320 },
];


 useEffect(()=>{
    const fetchTotalNumActiveAgri = async ()=>{
      console.log(user)
    if(user){
    try {
          const response =   await axios.get(
              `${url}/api/active_this_year/`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            )
            console.log(response.data)
          setTotalAgri(response.data.count)
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
              `${url}/api/superficie_espece_comparaision/`,
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
              `${url}/api/yearly_production/`,
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

   const fetchSupLabSiniProduction = async ()=>{
    console.log(user)
    if(user){
    try {
          const response =   await axios.get(
              `${url}/api/sup_lab_sin_prod/`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            )
            console.log(response.data)
         setAggregatedSupStats(response.data)
         
          } catch (error) {
            console.error( error);
          }
        }  
  }



  fetchTotalNumActiveAgri()
  fetchSuperficieData()
  fetchYearlyProductionPerEspece()
  fetchSupLabSiniProduction()



 },[user])


const [transformedData, setTransformedData] = useState([]);
useEffect(() => {
    if (yearlyProduct && yearlyProduct.length > 0) {
      const years = yearlyProduct[0]?.yearly_production.map((entry) => entry.year) || [];

      const result = years.map((year, i) => {
        const entry = { year };
        yearlyProduct.forEach((especeData) => {
          entry[especeData.espece] = especeData.yearly_production[i].total_production;
        });
        return entry;
      });

      setTransformedData(result);
    }
  }, [yearlyProduct]);

  useEffect(() => {
    console.log(transformedData);
  }, [transformedData]);


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
  
   const [agrSupStatsIndex, setAgrSupStatsIndex] = useState(0);
  
  useEffect(() => {
        let lastIndex = aggregatedSupStats.length - 1;
        if (agrSupStatsIndex < 0) {
          setAgrSupStatsIndex(lastIndex);
        }
        if (agrSupStatsIndex > lastIndex) {
          setAgrSupStatsIndex(0);
        }
      }, [agrSupStatsIndex, aggregatedSupStats])



  return (
    <div className="w-[80%] flex overflow-hidden">
 <div className="ml-8 mt-4 flex flex-col w-[13%] h-[98%] gap-4 ">
  <StatCard 
    icon={<img src={Employees} className="w-8 mt-4" />} 
    title="Employés actifs" 
    value="250"
  />

  <div
  className="overflow-hidden relative h-[77%] flex flex-col gap-4 rounded-xl  py-4 border border-indigo-600  bg-gradient-to-b  shadow-md"
>


    {aggregatedSupStats && aggregatedSupStats.map((statCard, statCardIndex) => {
  let position = "next-slide";
  if (statCardIndex === agrSupStatsIndex) {
    position = "active-slide";
  } else if (statCardIndex === (agrSupStatsIndex + 1) % aggregatedSupStats.length) {
    position = "next-slide";
  } else if (statCardIndex === (agrSupStatsIndex - 1 + aggregatedSupStats.length) % aggregatedSupStats.length) {
    position = "last-slide";
  }

  return (
    <div 
      key={statCardIndex}
      className={` w-full h-fit pb-4 flex flex-col gap-4 transition-all duration-500 ease-in-out transform absolute
        ${position === "active-slide" ? "translate-y-0 opacity-100 z-30" : ""}
        ${position === "last-slide" ? "translate-y-[-100%] opacity-0 " : ""}
        ${position === "next-slide" ? "translate-y-[100%] opacity-0 " : "opacity-0"}
      `}
    >
      <StatCard
        icon={<img src={Usine} className="w-10 mt-4 " />}  
        title="Zone de production" 
        value={statCard.zoneProduction}
      />
      <StatCard
        icon={<img src={Alerte} className="w-10 mt-4" />}  
        title="Pannes" 
        value={statCard.pannes}
      />
      <StatCard
        icon={<img src={Graphique} className="w-10 h-8 mt-4" />}  
        title="Production totale" 
        value={statCard.productionTotale}
      />

      <div className="bg-gradient-to-b from-blue-700 to-[#6dd5ed] w-full h-12 py-1 absolute top-[100%] flex justify-center gap-4  text-white font-semibold text-xl rounded-b-xl">
        <span className="text-white font-semibold ">{statCard.produit}</span>
        <FaArrowDown  
          onClick={() =>
            setAgrSupStatsIndex((agrSupStatsIndex + 1) % aggregatedSupStats.length)
          }
          className="w-5 h-5 text-white ml-2 mt-1 cursor-pointer"
        />
      </div>
    </div>
  );
})}

  </div>
</div>


      <div className="absolute top-4 right-4 w-[25vw] h-[50vh]">
        <TopWilayaCopy/>
      </div>


     <div className="w-[40%] overflow-hidden h-[50vh] mt-2 rounded-xl shadow-lg mx-48 ml-56 absolute z-10">
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
        className={`absolute w-[35vw] h-[50vh] pb-4 flex flex-col transition-all duration-500 ease-in-out transform 
          ${position === "active-slide" ? "left-4 opacity-100 translate-x-0 " : ""}
          ${position === "second-active-slide" ? "left-8 opacity-0 translate-x-[125%]" : ""}
          ${position === "last-slide" ? "opacity-0 translate-x-[-100%]" : ""}
          ${position === "next-slide" ? "opacity-0 translate-x-[200%]" : ""}
        `}
      >
        <EspeceSurfaceChartCopy data={[chart]} />
      </div>
    );
          
              
      })}


<button
  onClick={() => setIndex(index + 1)}
  className="absolute top-[55%] right-8 -translate-y-1/2 bg-[#1D4ED8] text-white px-3 py-2 rounded-full shadow hover:bg-blue-600 transition"
>
  <MdOutlineNavigateNext size={16} />
</button>


    </div>

  
       <div
       style={{boxShadow:"rgba(0,0,0,0.16) 0px 1px 4px"}} 
       className="rounded-xl absolute w-[40vw] h-[40%] top-[55%] ml-56">
        <ProductionChartCopy data={transformedData}/>
        </div>
       <div className="absolute z-10 right-20 top-[48%] w-[43vh] shadow-lg h-[47vh] ">
        <PrevProdVsProdCopy/>
      </div>
  
      
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div 
    style={{
      boxShadow: "rgba(0,0,0,0.16) 0px 1px 4px "
    }}
    className="w-[90%] mx-auto h-[20vh] p-3 rounded-xl bg-white flex flex-col items-center justify-center space-y-2">
      <div>{icon}</div>
      <div className="text-center">
        <p className="text-gray-500 text-sm font-semibold">{title}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  );
}


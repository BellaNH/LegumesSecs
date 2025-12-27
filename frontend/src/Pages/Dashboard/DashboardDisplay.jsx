import { FaDollarSign, FaTasks } from "react-icons/fa";
import { AiOutlineProject } from "react-icons/ai";
import EspeceSurfaceChart from "./EspeceSurfaceChart ";
import { useEffect } from 'react';
import React, { useState } from 'react'
import ProductionChart from "./ProductionChart.jsx";
import TopWilaya from "./TopWilaya.jsx";
import axios from "axios";
import { useGlobalContext } from "../../context";
import { MdOutlineNavigateNext } from "react-icons/md";
import { MdOutlineNavigateBefore } from "react-icons/md";
import Agriculteur from "../pics/Agriculteur.png"
import Haricotsverts from "../pics/Haricotsverts.png"
import  BarChart  from "../pics/BarChart.png"
import  Plante  from "../pics/Plante.png"
import { FaArrowDown } from "react-icons/fa";
import PrevProdVsProd from "./PrevProdVsProd.jsx";
import Amande from "../pics/Amande.png"
import Feu from "../pics/Feu.png"
import Une from "../pics/Une.png"
import Deux from "../pics/Deux.png"
import Trois from "../pics/Trois.png"
import Jardinage from "../pics/Jardinage.png"

export default function DashboardDisplay() {
  const {url,user}= useGlobalContext()
  const [totalAgri,setTotalAgri] = useState(0)
  const [superficieData,setSuperficieData] = useState("")
  const [yearlyProduct,setYearlyProduct] = useState("")
  const [numEspeces,setNumEspeces] = useState("")
  const [totalProdction,setTotalProduction] = useState("")
  const [totalSupLabouree,setTotalSupLanouree] = useState("")
  const [aggregatedSupStats,setAggregatedSupStats] = useState("")


 useEffect(()=>{
    console.log("📊 [DASHBOARD] DashboardDisplay mounted, user:", user);
    
    const fetchTotalNumActiveAgri = async ()=>{
    if(user){
      console.log("📡 [DASHBOARD] Fetching active agriculteurs this year...");
      console.log("🔗 [DASHBOARD] URL:", `${url}/api/active_this_year/`);
    try {
          const response =   await axios.get(
              `${url}/api/active_this_year/`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            )
          console.log("✅ [DASHBOARD] Active agriculteurs fetched successfully");
          console.log("📊 [DASHBOARD] Response data:", response.data);
          console.log("👥 [DASHBOARD] Count:", response.data.count);
          setTotalAgri(response.data.count ?? 0)
          } catch (error) {
            console.error("❌ [DASHBOARD] Error fetching active agriculteurs:", error);
            console.error("❌ [DASHBOARD] Error response:", error.response?.data);
            console.error("❌ [DASHBOARD] Error status:", error.response?.status);
            console.error("❌ [DASHBOARD] Full error:", error);
            setTotalAgri(0)
          }
        } else {
          console.log("ℹ️ [DASHBOARD] No user, skipping active agriculteurs fetch");
        }
  }

  const fetchSuperficieData = async ()=>{
    if(user){
      console.log("📡 [DASHBOARD] Fetching superficie espece comparison...");
      console.log("🔗 [DASHBOARD] URL:", `${url}/api/superficie_espece_comparaision/`);
    try {
          const response =   await axios.get(
              `${url}/api/superficie_espece_comparaision/`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            )
          console.log("✅ [DASHBOARD] Superficie data fetched successfully");
          console.log("📊 [DASHBOARD] Response data:", response.data);
          console.log("📊 [DASHBOARD] Data length:", Array.isArray(response.data) ? response.data.length : "Not an array");
          setSuperficieData(response.data)
          } catch (error) {
            console.error("❌ [DASHBOARD] Error fetching superficie data:", error);
            console.error("❌ [DASHBOARD] Error response:", error.response?.data);
            console.error("❌ [DASHBOARD] Error status:", error.response?.status);
            console.error("❌ [DASHBOARD] Full error:", error);
            setSuperficieData("")
          }
        } else {
          console.log("ℹ️ [DASHBOARD] No user, skipping superficie fetch");
        }
  }


  const fetchYearlyProductionPerEspece = async ()=>{
    if(user){
      console.log("📡 [DASHBOARD] Fetching yearly production per espece...");
      console.log("🔗 [DASHBOARD] URL:", `${url}/api/yearly_production/`);
    try {
          const response =   await axios.get(
              `${url}/api/yearly_production/`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            )
          console.log("✅ [DASHBOARD] Yearly production fetched successfully");
          console.log("📊 [DASHBOARD] Response data:", response.data);
          console.log("📊 [DASHBOARD] Data length:", Array.isArray(response.data) ? response.data.length : "Not an array");
         setYearlyProduct(response.data)
          } catch (error) {
            console.error("❌ [DASHBOARD] Error fetching yearly production:", error);
            console.error("❌ [DASHBOARD] Error response:", error.response?.data);
            console.error("❌ [DASHBOARD] Error status:", error.response?.status);
            console.error("❌ [DASHBOARD] Full error:", error);
            setYearlyProduct("")
          }
        } else {
          console.log("ℹ️ [DASHBOARD] No user, skipping yearly production fetch");
        }  
  }

   const fetchSupLabSiniProduction = async ()=>{
    if(user){
      console.log("📡 [DASHBOARD] Fetching superficie labouree/sinistree/production...");
      console.log("🔗 [DASHBOARD] URL:", `${url}/api/sup_lab_sin_prod/`);
    try {
          const response =   await axios.get(
              `${url}/api/sup_lab_sin_prod/`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            )
          console.log("✅ [DASHBOARD] Sup lab/sin/prod fetched successfully");
          console.log("📊 [DASHBOARD] Response data:", response.data);
          console.log("📊 [DASHBOARD] Data length:", Array.isArray(response.data) ? response.data.length : "Not an array");
         setAggregatedSupStats(response.data)
          } catch (error) {
            console.error("❌ [DASHBOARD] Error fetching sup lab/sin/prod:", error);
            console.error("❌ [DASHBOARD] Error response:", error.response?.data);
            console.error("❌ [DASHBOARD] Error status:", error.response?.status);
            console.error("❌ [DASHBOARD] Full error:", error);
            setAggregatedSupStats("")
          }
        } else {
          console.log("ℹ️ [DASHBOARD] No user, skipping sup lab/sin/prod fetch");
        }  
  }

  console.log("🚀 [DASHBOARD] Starting all data fetches...");
  
  // Execute all fetches and log summary
  Promise.allSettled([
    fetchTotalNumActiveAgri(),
    fetchSuperficieData(),
    fetchYearlyProductionPerEspece(),
    fetchSupLabSiniProduction()
  ]).then((results) => {
    console.log("📊 [DASHBOARD] ===== FETCH SUMMARY =====");
    results.forEach((result, index) => {
      const endpoints = ['active_this_year', 'superficie_espece_comparaision', 'yearly_production', 'sup_lab_sin_prod'];
      if (result.status === 'fulfilled') {
        console.log(`✅ [DASHBOARD] ${endpoints[index]}: SUCCESS`);
      } else {
        console.error(`❌ [DASHBOARD] ${endpoints[index]}: FAILED -`, result.reason);
      }
    });
    console.log("📊 [DASHBOARD] ==========================");
  }).then(() => {
    console.log("📊 [DASHBOARD] ===== FETCH SUMMARY =====");
    console.log("📊 [DASHBOARD] Total agriculteurs:", totalAgri);
    console.log("📊 [DASHBOARD] Superficie data:", superficieData ? (Array.isArray(superficieData) ? `${superficieData.length} items` : "Set") : "Empty");
    console.log("📊 [DASHBOARD] Yearly product:", yearlyProduct ? (Array.isArray(yearlyProduct) ? `${yearlyProduct.length} items` : "Set") : "Empty");
    console.log("📊 [DASHBOARD] Aggregated stats:", aggregatedSupStats ? (Array.isArray(aggregatedSupStats) ? `${aggregatedSupStats.length} items` : "Set") : "Empty");
    console.log("📊 [DASHBOARD] ==========================");
  });

 },[user])


const [transformedData, setTransformedData] = useState([]);
useEffect(() => {
    console.log("🔄 [DASHBOARD] Transforming yearly production data...");
    console.log("📊 [DASHBOARD] Yearly product data:", yearlyProduct);
    
    if (yearlyProduct && yearlyProduct.length > 0) {
      console.log("✅ [DASHBOARD] Yearly product data is valid, transforming...");
      const years = yearlyProduct[0]?.yearly_production.map((entry) => entry.year) || [];
      console.log("📅 [DASHBOARD] Years extracted:", years);

      const result = years.map((year, i) => {
        const entry = { year };
        yearlyProduct.forEach((especeData) => {
          entry[especeData.espece] = especeData.yearly_production[i].total_production;
        });
        return entry;
      });

      console.log("✅ [DASHBOARD] Transformed data:", result);
      setTransformedData(result);
    } else {
      console.log("ℹ️ [DASHBOARD] Yearly product data is empty or invalid");
      console.log("📊 [DASHBOARD] Yearly product type:", typeof yearlyProduct);
      console.log("📊 [DASHBOARD] Yearly product value:", yearlyProduct);
    }
  }, [yearlyProduct]);



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
    icon={<img src={Agriculteur} className="w-8 mt-4" />} 
    title="Agriculteurs Active" 
    value={totalAgri} 
  />

  <div
  className="overflow-hidden relative h-[77%] flex flex-col gap-4 rounded-xl  py-4 border border-green-600  bg-gradient-to-b  shadow-md"
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
            icon={<img src={Jardinage} className="w-10 mt-4 " />}  
            title="Superficie labouree" 
            value={statCard.total_production} 

          />
          <StatCard
            icon={<img src={Feu} className="w-10 mt-4" />}  
            title="Superficie sinistree" 
            value={statCard.total_sup_labouree} 
          />
          <StatCard
            icon={<img src={Amande} className="w-10 mt-4" />}  
            title="Total production" 
            value={statCard.total_sup_sinistree} 
          />

           <div className="bg-green-600 w-full h-12 py-0 absolute top-[100%] flex justify-center items-center gap-4  text-white font-semibold text-xl rounded-b-xl">
              <span className="text-white font-semibold ">{statCard.espece}</span>
              <FaArrowDown  
                onClick={() =>
                  setAgrSupStatsIndex((agrSupStatsIndex + 1) % aggregatedSupStats.length)
                }
                className="w-5 h-5  text-white ml-2 cursor-pointer"
              />
            </div>
        </div>
      );
    })}
  </div>
</div>


      <div className="absolute top-4 right-4 w-[25vw] h-[50vh]">
        <TopWilaya/>
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
        <EspeceSurfaceChart data={[chart]} />
      </div>
    );
          
              
      })}


<button
  onClick={() => setIndex(index + 1)}
  className="absolute top-[55%] right-8 -translate-y-1/2 bg-green-600 text-white px-3 py-2 rounded-full shadow hover:bg-green-700 transition"
>
  <MdOutlineNavigateNext size={16} />
</button>


    </div>

  
       <div
       style={{boxShadow:"rgba(0,0,0,0.16) 0px 1px 4px"}} 
       className="rounded-xl absolute w-[40vw] h-[40%] top-[55%] ml-56">
        <ProductionChart data={transformedData}/>
        </div>
       <div className="absolute z-10 right-20 top-[48%] w-[43vh] shadow-lg h-[47vh] ">
        <PrevProdVsProd/>
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


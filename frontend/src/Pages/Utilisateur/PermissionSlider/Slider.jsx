import React, { useState } from 'react'
import { GrCaretNext } from "react-icons/gr";
import { GrCaretPrevious } from "react-icons/gr";
import Agriculteurs from '../../Agriculteur/Agriculteurs';
import { useEffect } from 'react';
import Checkbox from '@mui/material/Checkbox';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

function Slider({setFormData,resetPermissions,permissions,modelNames,showPermissionForn,setShowPermissionForm,handleChange,formData,onCancel}) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const handleCancel = ()=>{
        setFormData(prev => ({
          ...prev,
          permissions: permissions, 
          }));
  
     setShowPermissionForm(false)
     
  }
  useEffect(()=>{console.log(formData)},[formData])

  useEffect(() => {
    let lastIndex = modelNames.length - 1;
    if (index < 0) {
      setIndex(lastIndex);
    }
    if (index > lastIndex) {
      setIndex(0);
    }
  }, [index, modelNames]);
  useEffect(() => {
    if (isPaused) return;
    let slider = setInterval(() => {
      setIndex(index + 1);
    }, 5000);
    return () => {
      clearInterval(slider);
    };
  }, [isPaused, index]);


  const handlePause = () => setIsPaused(true);
  const handleresume = () => setIsPaused(false);
  return (
    <div style={{boxShadow:"rgba(0,0,0,0.16) 0px 1px 4px"}} className='relative left-20 px-12 mx-auto my-auto w-[60%] h-[75%] bg-white '>
        <GrCaretPrevious 
        onClick={() => {
          setIndex(index - 1);
        }}
         className="absolute left-4 top-[45%] cursor-pointer"
         />
        <div className="grid grid-cols-2 relative h-[100%] overflow-hidden"
        onMouseDown={handlePause}
        onMouseUp={handleresume}
        >
           {/*<p onClick={()=>setShowPermissionForm(false)}>cancel</p>*/}
          {modelNames && modelNames.map((Model, modelIndex) => {
          let position = "next-slide";
          if (index === modelIndex) {
            position = "active-slide";
          } else if (modelIndex === (index + 1) % modelNames.length) {
            position = "second-active-slide";
          }
          if (
            modelIndex === index - 1 ||
            (index === 0 && modelIndex === modelNames.length - 1)
          ) {
            position = "last-slide";
          }
          const permissionData = formData?.permissions?.find((p)=> p.model === Model)
          return (
            <div style={{boxShadow:"rgba(0,0,0,0.16) 0px 1px 4px"}}
             className={`absolute top-[7%] w-[20vw] h-[75%] py-4 px-8 flex flex-col transition-all duration-500 ease-in-out transform 
              ${position==="active-slide"?"left-4 opacity-100 translate-x-0 ml-8":""} 
              ${position==="second-active-slide"?"left-8 opacity-100 translate-x-[125%]":""} 
              ${position==="last-slide"?" opacity-0 translate-x-[-100%]":""}
              ${position==="next-slide"?"opacity-0 translate-x-[200%]":""}
              `} 
              key={modelIndex}>
              <p className="font-semibold mb-4" 
                        name="model" 
                        >{Model} </p>
                        <div className="flex flex-col gap-2 ">
                        <div className="flex">
                        <Checkbox
                          size="small"
                          name="retrieve"
                          color="primary"
                          checked={permissionData?.retrieve ?? false}
                          onChange={(e) => handleChange(e, Model)}
/>
                        <p className="my-auto">retrieve</p>
                        </div>
                        <div className="flex gap-1">
                        <Checkbox
                             {...label}     
                             size="small"
                             name='create'
                             checked={permissionData?.create ?? false}
                             onChange={(e) => handleChange(e, Model)}
                          />
                        <p className="my-auto">create</p>
                        </div>
                        <div className="flex gap-1 ">
                        <Checkbox
                             {...label}                  
                             size="small"
                             name='update'
                             checked={permissionData?.update ?? false}
                             onChange={(e) => handleChange(e, Model)}               
                          />
                        <p className="my-auto">update</p>
                        </div>
                        <div className="flex gap-1">
                        <Checkbox
                             {...label}                            
                             size="small"
                             name='destroy'
                             checked={permissionData?.destroy ?? false}
                             onChange={(e) => handleChange(e, Model)}   
                          />
                        <p className="my-auto">destroy</p>
                        </div>
                        </div>
            </div>
          );
        })}
        <div className='flex gap-4'>
        <button onClick={()=>handleCancel(false)} className='bg-red-700 text-md text-white px-8 h-8 absolute bottom-4 right-36'>Cancel</button>
        <button onClick={()=>setShowPermissionForm(false)} className='bg-green-600 text-md text-white px-8 h-8 absolute bottom-4 right-4'>Done</button>
        </div>
        </div>
        
        <GrCaretNext 
        onClick={() => {
          setIndex(index + 1);
        }}
        className="absolute right-4 top-[45%] cursor-pointer"
        />
        
    </div>
  )
}

export default Slider
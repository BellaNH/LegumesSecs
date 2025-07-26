import React, { useState } from 'react'
import { GrCaretNext } from "react-icons/gr";
import { GrCaretPrevious } from "react-icons/gr";
import Agriculteurs from '../../Agriculteur/Agriculteurs';
import { useEffect } from 'react';
import Checkbox from '@mui/material/Checkbox';
import { useGlobalContext } from '../../../context';
import {Snackbar, Alert } from "@mui/material";
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

function Slider({formData,setFormData,setShowPermissionForm}) {
  
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const {currentUserPermissions,setCurrentUserPermissions,defaultPermissions} = useGlobalContext()
  const [errorMessage,setErrorMessage] = useState("")
  const [successMessage,setSuccessMessage] = useState("")
  

  useEffect(() => {
    let lastIndex = currentUserPermissions.length - 1;
    if (index < 0) {
      setIndex(lastIndex);
    }
    if (index > lastIndex) {
      setIndex(0);
    }
  }, [index, currentUserPermissions]);
  useEffect(() => {
    if (isPaused) return;
    let slider = setInterval(() => {
      setIndex(index + 1);
    }, 5000);
    return () => {
      clearInterval(slider);
    };
  }, [isPaused, index]);

  const handleChange = (e,Model)=>{
    const {name,checked} = e.target
    setCurrentUserPermissions((prev)=>
    prev.map((perm)=>(
      perm.model===Model ? 
      {...perm,[name]:checked}
      :perm

    )))
  }

  const handleSubmitPermissions= ()=>{
    setFormData((prev)=>(
    {...prev,["permissions"]:currentUserPermissions
    }))
    if(JSON.stringify(currentUserPermissions)===JSON.stringify(defaultPermissions)){
      setErrorMessage("Vous devez saisir les permissions d'utilisateur")
    }else{
      setTimeout(()=>{
        setShowPermissionForm(false)
        },1500)
      setSuccessMessage("Permissions bien saisies")
      
    }
  

  }
  useEffect(()=>{console.log(currentUserPermissions)},[currentUserPermissions])
  console.log(defaultPermissions)
  const handlePause = () => setIsPaused(true);
  const handleresume = () => setIsPaused(false);
  return (
<div className="relative left-20 mx-auto my-auto w-[60%] h-[50vh] bg-white rounded-xl shadow-lg px-12 py-8 overflow-hidden">
  <GrCaretPrevious
    onClick={() => setIndex(index - 1)}
    className="absolute left-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-2xl text-gray-600 hover:text-green-600 transition"
  />

  <div
    className="grid grid-cols-2 relative h-full"
    onMouseDown={handlePause}
    onMouseUp={handleresume}
  >
    {currentUserPermissions && currentUserPermissions.map((Model, modelIndex) => {
      let position = "next-slide";
      if (index === modelIndex) position = "active-slide";
      else if (modelIndex === (index + 1) % currentUserPermissions.length) position = "second-active-slide";
      if (modelIndex === index - 1 || (index === 0 && modelIndex === currentUserPermissions.length - 1))
        position = "last-slide";

      return (
        <div
        style={{
      boxShadow: "rgba(0,0,0,0.16) 0px 1px 4px"
    }}
          className={`absolute top-[7%] w-[20vw] h-[90%] p-6 bg-white rounded-xl shadow-md transition-all duration-500 ease-in-out
          ${position === "active-slide" ? "left-4 opacity-100 translate-x-0 ml-8" : ""}
          ${position === "second-active-slide" ? "left-8 opacity-100 translate-x-[125%]" : ""}
          ${position === "last-slide" ? "opacity-0 translate-x-[-100%]" : ""}
          ${position === "next-slide" ? "opacity-0 translate-x-[200%]" : ""}
        `}
          key={modelIndex}
        >
          <p className="font-semibold text-green-700 text-lg mb-4">{Model.model}</p>
          <div  className="flex flex-col gap-3 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <Checkbox
                size="small"
                name="retrieve"
                color="primary"
                checked={Model.retrieve}
                onChange={(e) => handleChange(e, Model.model)}
              />
              <p>Lire</p>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                size="small"
                name="create"
                checked={Model.create}
                onChange={(e) => handleChange(e, Model.model)}
              />
              <p>Créer</p>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                size="small"
                name="update"
                checked={Model.update}
                onChange={(e) => handleChange(e, Model.model)}
              />
              <p>Modifier</p>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                size="small"
                name="destroy"
                checked={Model.destroy}
                onChange={(e) => handleChange(e, Model.model)}
              />
              <p>Supprimer</p>
            </div>
          </div>
        </div>
      );
    })}

      <button
        type="button"
        onClick={handleSubmitPermissions}
        className="absolute bottom-2 right-0 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm px-8 py-2 rounded-lg shadow-md transition"
      >
        Ok
      </button>
  
  </div>

  <GrCaretNext
    onClick={() => setIndex(index + 1)}
    className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-2xl text-gray-600 hover:text-green-600 transition"
  />

  {errorMessage && (
    <Snackbar open={true} autoHideDuration={4000} onClose={() => setErrorMessage("")}>
      <Alert onClose={() => setMessage("")} severity="error" sx={{ width: "100%" }}>
        {errorMessage}
      </Alert>
    </Snackbar>
  )}
  {successMessage && (
    <Snackbar open={true} autoHideDuration={4000} onClose={() => setSuccessMessage("")}>
      <Alert onClose={() => setMessage("")} severity="success" sx={{ width: "100%" }}>
        {successMessage}
      </Alert>
    </Snackbar>
  )}
</div>

  )
}

export default Slider
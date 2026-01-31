import { useEffect, useState } from "react"
import {MdDelete, MdEdit} from "react-icons/md"
import {BsThreeDotsVertical} from "react-icons/bs"
import TextField from '@mui/material/TextField';
import {IoMdInformationCircleOutline} from "react-icons/io"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import Select  from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import { useGlobalContext } from "../../context";
import AxiosInstance from "../../axios";
import { useNavigate } from "react-router-dom";
import CiblePic from "../pics/CiblePic.png"
import  { Snackbar, Alert} from "@mui/material";
import axios from "axios";
import Plus from "../pics/Plus.png"
import Modifier from "../pics/Modifier.png"

const FormObjectif = ({ setSelectedObjId, selectedObjId, setShowEditForm, onSuccess, onError })=>{

   const {wilayas,especes,url,fetchObjectifs} = useGlobalContext()
   const [selectedWilaya,setSelectedWilaya] = useState("")
   const [selectedEspece,setSelectedEspece] = useState("")
   const [openForm,setOpenForm] = useState(true)
   const navigate = useNavigate()
   const [errorMessage, setErrorMessage] = useState(""); 
   const [successMessage, setSuccessMessage] = useState(""); 
   const [openError, setOpenError] = useState(false);
   const [openSuccess, setOpenSuccess] = useState(false);
   const [data,setData] = useState({
    annee:"",
    wilaya_id:"",
    espece_id:"",
    objectif_production:""
   })  

   useEffect(() => {
    const fetchObjectif = async () => {
        if (selectedObjId) {
            try {
                const response = await axios.get(`${url}/api/objectif/${selectedObjId}/`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });

                console.log(response.data);

                setData({
                    annee: response.data.annee,
                    wilaya_id: response.data.wilaya.id,
                    espece_id: response.data.espece.id, 
                    objectif_production: response.data.objectif_production
                });

            } catch (error) {
                console.error("Erreur lors de la récupération de l'objectif :", error);
            }
        }
    };

    fetchObjectif();
}, [selectedObjId]);


 const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => ({
        ...prev,
        [name]: value
    }));
};


const handleModifyObj = async (e) => {
    e.preventDefault();
    if (selectedObjId) {
        try {
            const response = await axios.patch(`${url}/api/objectif/${selectedObjId}/`, data, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });

            console.log(response.data);
            fetchObjectifs();
            setSelectedObjId(null);
            setOpenForm(false);
            if (typeof setShowEditForm === "function") setShowEditForm(false);
            if (typeof onSuccess === "function") onSuccess();
        } catch (error) {
          const msg = error?.response?.data?.detail || error?.response?.data ? (typeof error.response.data === "string" ? error.response.data : "Erreur lors de la mise à jour") : "Erreur lors de la mise à jour";
          if (typeof onError === "function") onError(msg);
          else {
            setErrorMessage(msg);
            setOpenError(true);
          }
        }
    }
};

 const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post(`${url}/api/objectif/`, data, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setSuccessMessage(`Objectif ajouté avec succès ✅`);
        setOpenSuccess(true);
        await fetchObjectifs();
        navigate("/objectifs");
    } catch (error) {
      setErrorMessage("Erreur lors de la création");
      setOpenError(true);

    }
};
const handleCancel = () => {
    setOpenForm(false);
    setData({
        annee: "",
        wilaya_id: "",
        espece_id: "",
        objectif_production: ""
    });
    navigate("/objectifs");
};
       useEffect(()=>{console.log(data)},[data])

    return ( 
<div
  className={
    openForm
      ? "fixed top-0 left-0 w-full h-full bg-[#00000090] z-50 flex justify-center items-center"
      : ""
  }
>
  {openForm && (
    <form
      onSubmit={selectedObjId ? handleModifyObj : handleSubmit}
      className="relative left-16 w-[55%] h-[50vh] z-10 rounded-md grid grid-cols-2"
    >
      <div className="flex flex-col gap-4 px-4 rounded-l-md bg-white">
        {selectedObjId ? (
          <div className="flex gap-3">
            <img src={Modifier} alt="" className="w-6 h-6 mt-5" />
            <h3 className="font-semibold text-green-600 text-xl my-4">
              Modifier l'objectif
            </h3>
          </div>
        ) : (
          <div className="flex gap-3">
            <img src={Plus} alt="" className="w-6 h-6 mt-5" />
            <h3 className="font-semibold text-green-600 text-xl my-4">
              Ajouter un objectif
            </h3>
          </div>
        )}

        <TextField
          value={data.annee}
          name="annee"
          onChange={handleChange}
          label="Année"
          variant="standard"
          size="small"
          sx={{ width: "100%" }}
        />

        <TextField
          select
          label="Wilaya"
          name="wilaya_id"
          value={data.wilaya_id}
          fullWidth
          required
          onChange={handleChange}
          size="small"
          variant="standard"
          sx={{
            "& .MuiFilledInput-root": { backgroundColor: "#f7fafc" },
            width: "100%",
          }}
        >
          {wilayas.map((wilaya, index) => (
            <MenuItem value={wilaya.id} key={index}>
              {wilaya.nom}
            </MenuItem>
          ))}
        </TextField>
      </div>

      <div className="flex flex-col gap-4 bg-green-700 px-4 rounded-r-md backdrop-blur-md border border-white/20">
        <IoMdInformationCircleOutline className="text-white w-8 h-8 mt-4 ml-[85%] mb-3" />
                <TextField
          select
          label="Espèce"
          name="espece_id"
          value={data.espece_id}
          fullWidth
          required
          onChange={handleChange}
          size="small"
          InputProps={{
            sx: {
              color: "white",
              "&:before": { borderBottom: "1px solid white" },
              "&:after": { borderBottom: "1px solid white" },
            },
          }}
          variant="standard"
           sx={{
            width: "100%",
            "& > :not(style)": { color: "white" },
            boxShadow: "rgba(149,157,165,0.2) 0px 8px 24px",
            border: "none",
          }}
        >
          {especes.map((espece, index) => (
            <MenuItem value={espece.id} key={index}>
              {espece.nom}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          value={data.objectif_production}
          name="objectif_production"
          onChange={handleChange}
          label="Objectif de production"
          variant="standard"
          size="small"
          InputLabelProps={{
            sx: { color: "white", "&.Mui-focused": { color: "white" } },
          }}
          InputProps={{
            sx: {
              color: "white",
              "&:before": { borderBottom: "1px solid white" },
              "&:after": { borderBottom: "1px solid white" },
            },
          }}
          sx={{
            width: "100%",
            "& > :not(style)": { color: "white" },
            boxShadow: "rgba(149,157,165,0.2) 0px 8px 24px",
            border: "none",
          }}
        />

        <div className="flex justify-center py-6 gap-6 w-[100%]">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-white rounded-md w-auto px-8 py-2 text-red-600 font-semibold"
          >
            Cancel
          </button>
          {selectedObjId ? (
            <button
              type="submit"
              className="font-semibold bg-lime-600 rounded-md w-auto px-8 py-2 text-white text-base"
            >
              Modifier
            </button>
          ) : (
            <button
              type="submit"
              className="font-semibold bg-green-600 rounded-md w-auto px-8 py-2 text-white text-base"
            >
              Ajouter
            </button>
          )}
        </div>
      </div>
    </form>
  )}


  <Snackbar
    open={openSuccess}
    autoHideDuration={4000}
    onClose={() => setOpenSuccess(false)}
  >
    <Alert
      onClose={() => setOpenSuccess(false)}
      severity="success"
      sx={{ width: "100%" }}
    >
      {successMessage}
    </Alert>
  </Snackbar>

  <Snackbar
    open={openError}
    autoHideDuration={4000}
    onClose={() => setOpenError(false)}
  >
    <Alert
      onClose={() => setOpenError(false)}
      severity="error"
      sx={{ width: "100%" }}
    >
      {errorMessage}
    </Alert>
  </Snackbar>
</div>
  
    
    )}
export default FormObjectif
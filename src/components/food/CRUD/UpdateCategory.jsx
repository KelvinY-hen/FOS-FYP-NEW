import React, { useState } from "react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import classes from "./CreateCategory.module.css";

import {
  MdFastfood,
  MdCloudUpload,
  MdDelete,
  MdFoodBank,
  MdAttachMoney,
  MdAbc,
  MdCategory
} from "react-icons/md";
import { useCTX } from "../../../context/Context";
import { Categories } from "../../../models";
import { DataStore,Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

function UpdateCategory() {
  const{id}= useParams();
  
  const {cartContext, restaurant} = useCTX();
  const navigation = useNavigate();

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] =useState();

  const [fields, setFields] = useState(false);
  const [alertStatus, setAlertStatus] = useState("danger");
  const [msg, setMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [user,setUser] = useState();
  useEffect(() => {
    Auth.currentAuthenticatedUser({bypassCache: true}).then(setUser)
  }, [])
  const sub = user?.attributes?.sub;

  useEffect(() => {
    DataStore.query(Categories, id).then(setCategory);
  }, [])

  useEffect(() => {
    if (category) {
      setName(category?.name);
    }
  }, [category]);

  const handleAdd = () => {
    
    setIsLoading(true);
    try {
      if (!name) {
        setFields(true);
        setMsg("Please fill out all required fields");
        setAlertStatus("danger");
        setTimeout(() => {
          setFields(false);
          setIsLoading(false);
        }, 4000);
      } else {
        DataStore.save(
          Categories.copyOf(category,(updated) =>
            {
              updated.name = name
              updated.param = name
            }
            )
        )
        setIsLoading(false);
        setFields(true);
        setMsg("Data Uploaded successfully 😊");
        setAlertStatus("success");
        setTimeout(() => {
          setFields(false);
        }, 4000);
      }
    } catch (error) {
      console.log(error);
      setFields(true);
      setMsg("Error while uploading : Try AGain 🙇");
      setAlertStatus("danger");
      setTimeout(() => {
        setFields(false);
        setIsLoading(false);
      }, 4000);
    }
  };

  const handleDelete = () => {
    DataStore.delete(category);

    setFields(true);
    setMsg("Data Deleted Succesfully");
    setAlertStatus("success");
    setTimeout(() => {
      setFields(false);
    }, 4000);
  };

return (
  <div className="w-full min-h-screen flex items-center justify-center">
    <div className={`w-[90%] md:w-[50%] border border-orange-300 rounded-lg p-4 flex flex-col items-center justify-center gap-4 bg-white ${classes.animation}`}>
      {fields && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`w-full p-2 rounded-lg text-center text-lg font-semibold ${
            alertStatus === "danger"
              ? "bg-red-400 text-red-800"
              : "bg-emerald-400 text-emerald-800"
          }`}
        >
          {msg}
        </motion.p>
      )}

      <div className="w-full py-2 border-b border-orange-200 flex items-center gap-2">
        <MdCategory className="text-xl text-orange-700" />
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Give me a name..."
          className="w-full h-full text-lg bg-transparent outline-none border-none placeholder:text-orange-400 text-textColor"
        />
      </div>
{/*         
        <div className="w-full py-2 border-b border-orange-300 flex items-center gap-2">
          <MdAttachMoney className="text-orange-700 text-2xl" />
          <input
            type="text"
            required
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Quantity /piece/kilogram/meter"
            className="w-full h-full text-lg bg-transparent outline-none border-none placeholder:text-orange-400 text-textColor"
          />
        </div> */}

      <div className="flex items-center w-full">
        <button
          type="button"
          className="mr-0 md:mr-auto w-full md:w-auto border-none outline-none bg-red-500 px-12 py-2 rounded-lg text-lg text-white font-semibold"
          onClick={handleDelete}
        >
          Delete
        </button>
        <button
          type="button"
          className="ml-0 md:ml-auto w-full md:w-auto border-none outline-none bg-orange-500 px-12 py-2 rounded-lg text-lg text-white font-semibold"
          onClick={handleAdd}
        >
          Save
        </button>
      </div>
    </div>
  </div>
);
}

export default UpdateCategory
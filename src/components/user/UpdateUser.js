import React, { useState } from "react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import classes from "./UpdateUser.module.css";

import {
  MdFastfood,
  MdCloudUpload,
  MdDelete,
  MdFoodBank,
  MdAttachMoney,
  MdAbc
} from "react-icons/md";
import { useCTX } from "../../context/Context";
import { User } from "../../models";
import { DataStore,Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";

function UpdateUser() {
  
  const {cartContext, restaurant} = useCTX();
  const navigation = useNavigate();

  var [name, setName] = useState("");
  const [number, setNumber] = useState(null);
  const [valid, setValid] = useState(true);
  var [adminRestaurant, setRestaurant] =useState();

  const [fields, setFields] = useState(false);
  const [alertStatus, setAlertStatus] = useState("danger");
  const [msg, setMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [user,setUser] = useState();
  const [dbUser,setDBUser] = useState();
  useEffect(() => {
    Auth.currentAuthenticatedUser({bypassCache: true}).then(setUser)
  }, [])
  const sub = user?.attributes?.sub;

  useEffect(() => {
    DataStore.query(User, (u) => u.sub.eq(sub)).then((u) => setDBUser(u[0]));
  }, [sub])

  useEffect(() => {
    if (dbUser) {
        setName(dbUser.name);
        setNumber(dbUser.contactNumber)
    }
    console.log(name)
  }, [dbUser]);
  
  // useEffect(() => {
    
  //   const fetchData = async () => {
  
  //     try {
  //       setRestaurant(
  //           await Promise.all([
  //           DataStore.query(Restaurant, (r) => r.adminSub.eq(sub)),
  //         ])
  //       )
        
  //       console.log(adminRestaurant)

  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   }
  //   fetchData();
  //   }, [restaurant]);


  const handleAdd = () => {
    
    setIsLoading(true);
    try {
      if (!name || !number || !valid) {
        setFields(true);
        setMsg("Required fields can't be empty");
        setAlertStatus("danger");
        setTimeout(() => {
          setFields(false);
          setIsLoading(false);
        }, 4000);
      } else {
        DataStore.save(
          User.copyOf(dbUser, (updated) =>
            {
              updated.name = name
              updated.contactNumber = number
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


  const handleNumber = (e) => {
    const num = e.target.value;
    const regex = /^\+?(60)?[1-9]\d{1,14}$/;
    console.log(regex.test(num))
    if (regex.test(num) === false){
      setValid(false)
      return
    }else{
      setValid(true)
    }
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
        <MdFastfood className="text-xl text-orange-700" />
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Give me a title..."
          className="w-full h-full text-lg bg-transparent outline-none border-none placeholder:text-orange-400 text-textColor"
        />
      </div>
      <div className="w-full py-2 border-b border-orange-200 flex items-center gap-2">
        <MdFastfood className="text-xl text-orange-700" />
        <input
          type="text"
          required
          value={number}
          onChange={(e)=>setNumber(e.target.value)}
          onBlur={(e) => handleNumber(e)}
          placeholder="Enter Contact Number (+xx) xxx-xxx-xx"
          className="w-full h-full text-lg bg-transparent outline-none border-none placeholder:text-orange-400 text-textColor"
        />
      </div>
      {!valid && <p className="text-red-500">Please enter a valid phone number in the AWS format.</p>}
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

export default UpdateUser
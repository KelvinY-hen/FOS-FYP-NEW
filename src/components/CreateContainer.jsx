import React, {useState} from 'react'
import {motion} from "framer-motion"




function CreateContainer() {
    
const [price,setPrice] =useState("")
const [category,setCategory] =useState(null)
const [imageAsset,setImageAsset] =useState(null)
const [fields,setFields] =useState(false)
const [alertStatus,setAlertStatus] =useState("danger")
const [msg,setMsg] =useState(null)
const [isLoading,setIsLoading] =useState(false)
  return (
    <div className='w-full min-h-screen flex items-center justify-center'>
        <div className=' w-[90%] md:w-[70%] border border-gray-400 rounded-lg p-4 flex flex-col items-center justify-center '>
           



        </div>
    </div>
  )
}

export default CreateContainer
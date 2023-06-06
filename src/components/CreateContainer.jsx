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
            {fields && (
                <motion.p
                intial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                className={'w-full p-2 rounded-lg text-center text-lg font-semibold ${ alertStatus ==="danger" ? "bg-red-400 text-red-500": "bg-green-400 text-emerald-800"}'}>
                    {msg    }
                </motion.p> 
            )}



        </div>
    </div>
  )
}

export default CreateContainer
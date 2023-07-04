import React, { useState } from "react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import classes from "./CreateFood.module.css";

import {
  MdFastfood,
  MdCloudUpload,
  MdDelete,
  MdFoodBank,
  MdAttachMoney,
  MdAbc
} from "react-icons/md";
import { useCTX } from "../../../context/Context";
import { actionType } from "../../../context/reducer";
import { Categories, Foods, Ingredient } from "../../../models";
import { DataStore } from "aws-amplify";
import { useNavigate } from "react-router-dom";
import { Button } from '@aws-amplify/ui-react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

function CreateFood() {
  
  const {cartContext, restaurant} = useCTX();
  const navigation = useNavigate();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] =useState();
  const [imageAsset, setImageAsset] = useState(null);
  const [fields, setFields] = useState(false);
  const [alertStatus, setAlertStatus] = useState("danger");
  const [msg, setMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [ingredientList, setIngredient] = useState();
  const [selectedRows, setSelectedRows] = useState([]);

  // useEffect(() => {
  //   DataStore.query(Categories).then(setCategories);
  // }, [])

  useEffect(() => {
    if (!restaurant) {
      return;
    } 
    DataStore.query(Categories, (c) => c?.restaurantID.eq(restaurant.id)).then(setCategories)
    DataStore.query(Ingredient).then(setIngredient)},
     [restaurant]);

  const tableColumns= [
  {
    headerName: "ID",
    field: "id",
    key: "id",
    width:150,
  },
  {
    headerName: "Name",
    field: "name",
    key: "name",
    width:150,
  },
  {
    headerName: "Quantity",
    field: "quantity",
    key: "quantity",
    width:150,
  },
  {
    headerName: "Date Modified",
    field: "updatedDate",
    width:300,
  },
  {
    headerName: "Time Modified",
    field: "updatedTime",
    width:300
  }
  ]  


  const handleAdd = () => {
    setIsLoading(true);
    try {
      if (!title || !price || !category) {
        setFields(true);
        setMsg("Required fields can't be empty");
        setAlertStatus("danger");
        setTimeout(() => {
          setFields(false);
          setIsLoading(false);
        }, 4000);
      } else {
        DataStore.save(
          new Foods(
            {
              name:title,
              description:description,
              price:parseFloat(price),
              categoriesID:category,
              restaurantID:restaurant.id
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
    console.log(selectedRows);
  };

return (
  <div className="">
            {/* {ingredientList && <DataGrid
            rows={ingredientList.map((ingredient) => ({
              
              id: ingredient.id,
              name: ingredient.name,
              quantity: ingredient.quantity,
              updatedDate: new Date(ingredient.updatedAt).toLocaleDateString(),
              updatedTime: new Date(ingredient.updatedAt).toLocaleTimeString()
            }))}
            columns={tableColumns}
            autoHeight
            rowHeight={40}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            onRowSelectionModelChange={(newRowSelectionModel) => {
              setSelectedRows(newRowSelectionModel);
            }}
            rowSelectionModel={selectedRows}
          />}
          <Button onClick={handleDelete}>Delete</Button> */}

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
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give me a title..."
          className="w-full h-full text-lg bg-transparent outline-none border-none placeholder:text-orange-400 text-textColor"
        />
      </div>
        
      <div className="w-full py-2 flex items-center gap-2">
        <div className="w-full">
            <select
              onChange={(e) =>{ setCategory(e.target.value)}}
              className="outline-none w-full text-base border-b-2 border-orange-200 text-orange-400 bg-transparent  p-2 rounded-md cursor-pointer"
            >
              <option value="other" className="bg-white">
                Select Category
              </option>
              {categories &&
                categories.map((item) => (
                  <option
                    key={item.id}
                    className="text-base border-0 outline-none capitalize bg-white text-headingColor"
                    value={item.id}
                  >
                    {item.name}
                  </option>
                ))}
            </select>
          </div>

        <div className="w-full py-2 border-b border-orange-300 flex items-center gap-2">
          <MdAttachMoney className="text-orange-700 text-2xl" />
          <input
            type="text"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
            className="w-full h-full text-lg bg-transparent outline-none border-none placeholder:text-orange-400 text-textColor"
          />
        </div>

        
      </div>
      
      <div className="w-full py-10 border-b border-orange-300 flex items-center gap-2">
          <MdAbc className=" text-3xl text-orange-700" />
          <input
            type="text"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Give me a description"
            className="w-full h-full text-lg bg-transparent outline-none border-none placeholder:text-orange-400 text-textColor"
          />
      </div>
 

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
      
  </div>
  
);
}

export default CreateFood
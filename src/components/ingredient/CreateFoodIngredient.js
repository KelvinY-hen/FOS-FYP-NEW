import React, { useState } from "react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import classes from "./CreateFoodIngredient.module.css";

import {
  MdFastfood,
  MdCloudUpload,
  MdNumbers,
  MdFoodBank,
  MdAttachMoney,
  MdAbc,
} from "react-icons/md";
import { useCTX } from "../../context/Context";
import { Foods, Ingredient } from "../../models";
import { DataStore } from "aws-amplify";
import { useNavigate } from "react-router-dom";
import Card from "../UI/Card";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@aws-amplify/ui-react";
import { FoodIngredient } from "../../models";
import { useParams } from "react-router-dom";
import FoodQuantityForm from "../food/FoodQuantityForm";

function CreateFoodIngredient() {
  const { id } = useParams();

  const {restaurant } = useCTX();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState("");
  const [ingredientList, setIngredient] = useState([]);
  const [foodIngredientList, setFoodIngredient] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRows2, setSelectedRows2] = useState([]);

  const [fields, setFields] = useState(false);
  const [alertStatus, setAlertStatus] = useState("danger");
  const [msg, setMsg] = useState(null);
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!restaurant) {
        return;
      }

      try {
        const [ingredients, foodIngredients] = await Promise.all([
          DataStore.query(Ingredient, (i) => i?.restaurantID.eq(restaurant.id)),
          DataStore.query(FoodIngredient, (f) => f.foodsID?.eq(id)),
        ]);

        const updatedFoodIngredients = foodIngredients.map(
          (foodIngredient) => ({
            ...foodIngredient,
            ingredientName:
              ingredients.find((ing) => ing.id === foodIngredient.ingredientID)
                ?.name || null,
          })
        );

        setIngredient(ingredients);
        setFoodIngredient(updatedFoodIngredients);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [restaurant, trigger]);

  useEffect(() => {
    foodIngredientList.forEach((foodIngredient) => {
      const ingredient = ingredientList.find(
        (ing) => ing.id === foodIngredient.ingredientID
      );
      D
      if (ingredient) {
        setIngredient((prevIngredients) =>
          prevIngredients.filter((ing) => ing.id !== ingredient.id)
        );
      }
    });

  }, [foodIngredientList]);

  const tableColumns = [
    {
      headerName: "ID",
      field: "id",
      key: "id",
      width: 150,
    },
    {
      headerName: "Name",
      field: "name",
      key: "name",
      width: 150,
    },
    {
      headerName: "Quantity",
      field: "quantity",
      key: "quantity",
      width: 150,
    },
    {
      headerName: "Date Modified",
      field: "updatedDate",
      width: 300,
    },
    {
      headerName: "Time Modified",
      field: "updatedTime",
      width: 300,
    },
  ];

  const tableIngredientColumns = [
    {
      headerName: "ID",
      field: "id",
      key: "id",
      width: 200,
    },
    {
      headerName: "Quantity",
      field: "quantity",
      key: "quantity",
      width: 150,
    },
    {
      headerName: "Ingredient ID",
      field: "ingredientName",
      width: 200,
    },
    {
      headerName: "Foods ID",
      field: "foodName",
      width: 200,
    },
    {
      headerName: "Date Modified",
      field: "updatedDate",
      width: 300,
    },
    {
      headerName: "Time Modified",
      field: "updatedTime",
      width: 300,
    },
  ];

  const handleAdd = () => {
    try {
      if (!selectedRows || !quantity) {
        setFields(true);
        setMsg("Please fill out all required fields");
        setAlertStatus("danger");
        setTimeout(() => {
          setFields(false);
        }, 4000);
      } else {
        DataStore.save(
          new FoodIngredient({
            recipeQuantity: parseInt(quantity),
            ingredientID: selectedRows[0],
            foodsID: id,
          })
        );
        setTrigger(!trigger);

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
      setMsg("Error while uploading");
      setAlertStatus("danger");
      setTimeout(() => {
        setFields(false);
      }, 4000);
    }
  };

  const handleDelete = () => {
    selectedRows2?.map((rowId) =>
      DataStore.delete(FoodIngredient, (item) => item.id.eq(rowId))
    );
    setTrigger(!trigger);

    setFields(true);
    setMsg("Data Deleted Succesfully");
    setAlertStatus("success");
    setTimeout(() => {
      setFields(false);
    }, 4000);
  };

  return (
    <motion.div className="w-full min-h-screen flex flex-col gap-5">
      <Card>
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

        {ingredientList && (
          <DataGrid
            rows={ingredientList?.map((ingredient) => ({
              id: ingredient.id,
              name: ingredient.name,
              quantity: ingredient.quantity,
              updatedDate: new Date(ingredient.updatedAt).toLocaleDateString(),
              updatedTime: new Date(ingredient.updatedAt).toLocaleTimeString(),
            }))}
            columns={tableColumns}
            autoHeight
            rowHeight={40}
            onRowClick={(params) =>
              navigate(`/Ingredient/Edit/${params.row.id}`)
            }
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            onRowSelectionModelChange={(newRowSelectionModel) => {
              // Get the first selected row
              const selectedRow =
                newRowSelectionModel.length > 0
                  ? [newRowSelectionModel[0]]
                  : [];

              setSelectedRows(selectedRow);
            }}
            rowSelectionModel={selectedRows}
          />
        )}
        <div className="w-full py-2 border-b border-orange-300 flex items-center gap-2">
          <MdNumbers className="text-orange-700 text-2xl" />
          <input
            type="text"
            required
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Quantity /piece/kilogram/meter"
            className="w-full h-full text-lg bg-transparent outline-none border-none placeholder:text-orange-400 text-textColor"
          />
        </div>
      </Card>

      <Card>
        {ingredientList && (
          <DataGrid
            rows={foodIngredientList?.map((ingredient) => ({
              id: ingredient.id,
              foodName: ingredient.foodName,
              ingredientName: ingredient.ingredientName,
              quantity: ingredient.recipeQuantity,
              updatedDate: new Date(ingredient.updatedAt).toLocaleDateString(),
              updatedTime: new Date(ingredient.updatedAt).toLocaleTimeString(),
            }))}
            columns={tableIngredientColumns}
            autoHeight
            rowHeight={40}
            onRowClick={(params) =>
              navigate(`/Ingredient/Edit/${params.row.id}`)
            }
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            onRowSelectionModelChange={(newRowSelectionModel) => {
              setSelectedRows2(newRowSelectionModel);
            }}
            rowSelectionModel={selectedRows2}
          />
        )}
      </Card>

      {selectedRows.length > 0 && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          type="button"
          className="ml-0 md:ml-auto w-full border-none outline-none bg-orange-500 px-12 py-2 rounded-lg text-lg text-white font-semibold"
          onClick={handleAdd}
        >
          Add To Recipe
        </motion.button>
      )}

      {selectedRows2.length > 0 && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          type="button"
          className="ml-0 md:ml-auto w-full border-none outline-none bg-red-500 px-12 py-2 rounded-lg text-lg text-white font-semibold"
          onClick={handleDelete}
        >
          Remove from Recipe
        </motion.button>
      )}
    </motion.div>
  );
}

export default CreateFoodIngredient;

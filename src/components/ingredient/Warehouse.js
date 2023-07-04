import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataStore } from "aws-amplify";
import { Table } from "@aws-amplify/ui-react";
import { useCTX } from "../../context/Context";
import { Ingredient } from "../../models";
import { Button } from "@aws-amplify/ui-react";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { motion } from "framer-motion";
import { Card } from "antd";

const Warehouse = () => {
  const [ingredientList, setIngredient] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const { restaurant } = useCTX();
  const navigate = useNavigate();

  const [fields, setFields] = useState(false);
  const [alertStatus, setAlertStatus] = useState("danger");
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (restaurant) {
      console.log(restaurant);
    }
    DataStore.query(Ingredient, (i) => i.restaurantID.eq(restaurant.id)).then(
      setIngredient
    );
  }, [restaurant]);

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

  const handleDelete = () => {
    selectedRows.map((rowId) =>
      DataStore.delete(Ingredient, (item) => item.id.eq(rowId))
    );
    const updatedIngredients = ingredientList.filter(
      (item) => !selectedRows.includes(item.id)
    );
    setIngredient(updatedIngredients);

    setFields(true);
    setMsg("Data Deleted Succesfully");
    setAlertStatus("success");
    setTimeout(() => {
      setFields(false);
    }, 4000);
    console.log(ingredientList);
  };

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 15 }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0, translateY: 15 }}
      className="w-full min-h-screen"
    >
      <Card className=" gap-8">
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
            rows={ingredientList.map((ingredient) => ({
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
              setSelectedRows(newRowSelectionModel);
            }}
            rowSelectionModel={selectedRows}
          />
        )}
      </Card>

      {selectedRows.length <= 0 && (
        <button
          type="button"
          className=" w-full  border-none outline-none bg-orange-500 px-12 py-2 rounded-lg text-lg text-white font-semibold"
          onClick={(params) => navigate(`/Ingredient/Create`)}
        >
          New
        </button>
      )}

      {selectedRows.length > 0 && (
        <button
          type="button"
          className="w-full  border-none outline-none bg-red-500 px-12 py-2 rounded-lg text-lg text-white font-semibold"
          onClick={handleDelete}
        >
          Delete
        </button>
      )}
    </motion.div>
  );
};

export default Warehouse;

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import classes from "./UpdateFood.module.css";

import {
  MdFastfood,
  MdCloudUpload,
  MdDelete,
  MdFoodBank,
  MdAttachMoney,
  MdAbc,
} from "react-icons/md";
import { useCTX } from "../../../context/Context";
import { actionType } from "../../../context/reducer";
import { Categories, Foods } from "../../../models";
import { DataStore, Storage } from "aws-amplify";
import { useNavigate, useParams } from "react-router-dom";

function UpdateFood() {
  const { id } = useParams();

  const { cartContext } = useCTX();
  const navigation = useNavigate();
  const [Food, setFood] = useState(null);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const [categories, setCategories] = useState();
  const [imageAsset, setImageAsset] = useState(null);
  const [fields, setFields] = useState(false);
  const [alertStatus, setAlertStatus] = useState("danger");
  const [msg, setMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [foodImage, setFoodImage] = useState({ file: null, url: "" });
  const [oldFoodImage, setOldFoodImage] = useState({ file: null, url: "" });
  const [hide, setHide] = useState(true);

  useEffect(() => {
    DataStore.query(Categories).then(setCategories);
  }, []);

  useEffect(() => {
    DataStore.query(Foods, id).then(setFood);
  }, [id]);

  useEffect(() => {
    const getImage = async () => {
      try {
        if (!Food?.Image) {
          console.log("memek");
          return;
        } else {
          console.log("kontol");
          const file = Food?.Image;
          const img = await Storage.get(file, { expires: 60 });
          console.log(img);
          setFoodImage({ file, url: img });
          setOldFoodImage({ file, url: img });
        }
      } catch (error) {
        // Handle the error, e.g., display an error message or log the error
        console.error("An error occurred:", error);
      }
    };

    if (Food) {
      setTitle(Food?.name);
      setPrice(Food?.price);
      setDescription(Food?.description);
      setCategory(Food?.categoriesID);
      setHide(Food?.hide);
      getImage();
    }
  }, [Food]);

  const handleAdd = async () => {
    setIsLoading(true);
    try {
      console.log(title, description, price, category);
      if (!title || !price || !category) {
        setFields(true);
        setMsg("Required fields can't be empty");
        setAlertStatus("danger");
        setTimeout(() => {
          setFields(false);
          setIsLoading(false);
        }, 4000);
      } else {
        var key = foodImage.file;
        if (oldFoodImage.url !== foodImage.url) {
          await Storage.remove(oldFoodImage.file);
          const name = `${Food.restaurantID}${title}${price}`;
          var { key } = await Storage.put(name, foodImage.file);
          console.log("penis");
        }
        console.log(key);
        DataStore.save(
          Foods.copyOf(Food, (updated) => {
            updated.name = title;
            updated.description = description;
            updated.price = parseFloat(price);
            updated.categoriesID = category;
            updated.Image = key;
            updated.hide = hide;
          })
        );
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

  const handleDelete = (food) => {
    DataStore.delete(food);

    setFields(true);
    setMsg("Data Deleted Succesfully");
    setAlertStatus("success");
    setTimeout(() => {
      setFields(false);
    }, 4000);
  };

  function addImage(e) {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setFoodImage({ file, url });
  }

  const deleteImage = () => {
    setFoodImage({ file: null, url: "" });
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div
        className={`w-[90%] md:w-[50%] border border-orange-300 rounded-lg p-4 flex flex-col items-center justify-center gap-4 bg-white ${classes.animation}`}
      >
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
              onChange={(e) => {
                setCategory(e.target.value);
              }}
              value={category}
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

        <div className="group flex justify-center items-center flex-col border-2 border-dotted border-gray-300 w-full h-225 md:h-340 cursor-pointer rounded-lg">
          {!foodImage.url ? (
            <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
              <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                <MdCloudUpload className="text-gray-500 text-3xl hover:text-gray-700" />
                <p className="text-gray-500 hover:text-gray-700">
                  Click here to upload
                </p>
              </div>
              <input
                type="file"
                name="uploadimage"
                accept="image/*"
                onChange={addImage}
                className="w-0 h-0"
              />
            </label>
          ) : (
            <div className="relative h-full">
              <img
                src={foodImage.url}
                alt="uploaded image"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md  duration-500 transition-all ease-in-out"
                onClick={deleteImage}
              >
                <MdDelete className="text-white" />
              </button>
            </div>
          )}
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

        <div className="flex gap-2">
          <p>Hide:</p>
          <input
            type="checkbox"
            checked={hide}
            onChange={(e) => setHide(e.target.checked)}
          />
        </div>

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

export default UpdateFood;

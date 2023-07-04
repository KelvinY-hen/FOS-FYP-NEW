import React from 'react'
import classes from "./RestaurantItems.module.css";
import { useNavigate } from 'react-router-dom';


const RestaurantItems = props => {
    const navigate = useNavigate();


    return (

        <li className={classes.food} onClick={() => navigate(`/Restaurant/${props.id} `)}>
            <div>
                <h3>{props.name}</h3>
                <div className={classes.price}>{props.rating}</div>
            </div>
        </li>
      
    )
}

export default RestaurantItems
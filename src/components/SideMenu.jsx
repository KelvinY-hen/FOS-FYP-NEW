import React from 'react'
import { Menu } from '@aws-amplify/ui-react'
import { useNavigate } from 'react-router-dom'
import { Auth } from 'aws-amplify'

const SideMenu =()=>{
    const navigate = useNavigate();

    const onClick = (menuItem)  => {
        if (menuItem.key === "signOut") {
            Auth.signOut();
        }else{
            navigate(menuItem.key)
        }

    }

    const sideMenuItems = [
        {
            key: "order history",
            label: "Order History"
        },
        {
            key:"signOut",
            label:"Sign Out",
            danger: "true"
        }
    ]


    return (
        <Menu items={sideMenuItems} onClick = {(menuItem) => navigate(menuItem.key)}/>
    )
}



export default SideMenu
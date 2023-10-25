import React from 'react';

import { Link } from "react-router-dom";
import "./Sidebar.css";


export default function Sidebar(props){

    const menus = [
        {name : "INFO" , path : "/"},
        {name : "TEXT" , path : "/text"},
        {name : "IMAGE" , path : "/image"},
        {name : "VOICE" , path : "/voice"}
    ]

    return(

        <div className = "sidebar">
            <div className = "sidebarWrapper">
                <div className = "sidebarMenu">
                    <h3 className = "sidebarTitle"> SPAM-FILTERING
                        <ul className = "sidebarList">
                            {menus.map((menu,index) => {
                                return (
                                    <Link to ={menu.path} key = {index} style={{ textDecoration: "none" }}>
                                        <li className = "sidebarListItem" >{menu.name}</li>
                                    </Link>
                                )
                            })}            
   
                        </ul>
                    </h3>                            
                </div>
            </div>
        </div>
    );
}
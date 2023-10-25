
import styled from "styled-components";
import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Sidebar from "../sidebar/Sidebar";


import "./MainPage.css"
import TextPage from "./TextPage/TextPage";
import ImagePage from "./ImagePage/ImagePage";
import VoicePage from "./VoicePage/VoicePage";
import InfoPage from "./InfoPage/InfoPage";



// import VoiceBox from "../ui/VoiceBox";
// import TextBox from "../ui/TextBox";

const Header = styled.div`
    background-color: white;
    border : 2px solid rgb(190, 190, 190);
    border-width: 0px 0px 2px 0px ;
    color: black;
    font-size: 1.5rem;
    padding: 1.2rem;
    text-align: left;
    font-weight: 600;
    display:flex;
    height : 5vh;
`;


export default function MainPage(props){

    return(
        <div>
            <Header>
                ⓒ 2023. Spam-Dosirak  <p style={{ fontSize:"0.5em"}}>.  All rights reserved.</p>
            </Header>
            <BrowserRouter>
                <div className="container">
                <Sidebar/> 
                <div className = "others" style = {{overflow: "scroll",}}>
                        <Routes>
                            <Route path="/"  element={<InfoPage />} />
                            <Route path="/text"  element={<TextPage/>} />
                            <Route path="/image" element = {<ImagePage/>} />
                            <Route path="/voice" element = {<VoicePage/>} />
                        </Routes>               
                    </div> 
                </div>
            </BrowserRouter>
        </div>
    );
}
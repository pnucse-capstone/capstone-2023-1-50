import React from "react";
import styled from "styled-components";
import { useState, useEffect } from "react";
import "../Page.css";

//이 순서대로 깔아주세용
//npm install --save react-native
//npm install --save react-native-safe-area-context
//npm install --save react-native-paper 
//npm install --save react-native-web


//그래프를 위한 import
//npm install --save react-chartjs-2 
//npm install --save chart.js
import { Bar  } from "react-chartjs-2";
import "chart.js/auto";


//npm install --save react-loader-spinner
import { Oval } from "react-loader-spinner";
import HighlightedText from "../../highlight/HightLighted";


const Div_txt = styled.div`
    width:50%;
    height:100%;
    float:left;

    
    align-items : center;

    
`;
const Div_txtShow = styled.div`
    width: 50%;
    height: 50%;
    float: left;
    border:1px solid rgb(212, 210, 224);
    margin: 0px 4px;
    display: flex;
`;

const Div_NB = styled.div`
    width:45%;
    height:50%;
  
    float: left;
    display: flex;
    flex-direction: column;

`;

const Div_SVM = styled.div`
    width:45%;
    height:50%;
    float:left;
    display: flex;
    flex-direction: column;
   
`;

export default function VoicePage(props) {
    const [conversionResult, setConversionResult] = useState('');
    const [NBResult, setNBResult] = useState('');
    const [SVMResult, setSVMResult] = useState('');
    const [selectedAudioFile, setSelectedAudioFile] = useState(null);
    const [NBgraph, setNBGraph] = useState({ category: [], value: [] });
    const [SVMgraph, setSVMGraph] = useState({ category: [], value: [] });
    const [selectedResultType, setSelectedResultType] = useState("NB");
    const [loading, setLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(false);


    const handleAudioFileChange = (event) => {
        setSelectedAudioFile(event.target.files[0]);
        setProgress(0);
        event.target.value = null;
    };
    const convertAudio = () => {
        if (progress === 0 && !selectedAudioFile) {
            alert('실시간 녹음 또는 음성 파일 선택을 해주세요'); // Display an error message if no image is selected
            return; // Exit the function early
        }
        const formData = new FormData();
        formData.append('audio', selectedAudioFile);
        setError(false);
        setLoading(true);
        setNBResult('');
        setSVMResult('');
        setNBGraph({ category: [], value: [] });
        setSVMGraph({ category: [], value: [] });
        setConversionResult('');
        setProgress(0);

        fetch('/convert/audio', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('No String'); // 예상치 못한 오류 응답 처리
                }
                return response.json();
            })
            .then(data => {
                setConversionResult(data.text);
                setNBResult(data.result1)
                setSVMResult(data.result2)
                setNBGraph(data.vocabs1);
                setSVMGraph(data.vocabs2);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
                setLoading(false);
                setError(true);
                if (error instanceof Error && error.message === 'No String') {
                    alert('음성에서 추출된 텍스트가 없습니다');
                }
                else {
                    alert("에러가 발생했습니다");
                }
            });
    };

    const handleStartRecording = () => {
        setNBGraph({ category: [], value: [] });
        setSVMGraph({ category: [], value: [] });
        setConversionResult('');
        setSelectedAudioFile(null);
        setNBResult("");
        setSVMResult("");
        setProgress(0);
        setIsRecording(true);
        fetch('/convert/start_record', { method: 'POST' })
            .then(response => {
                if (!response.ok) {
                    throw new Error('No String'); // 예상치 못한 오류 응답 처리
                }
                return response.json();
            })
            .then(data => {
                setLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
                setLoading(false);
                if (error instanceof Error && error.message === 'No String') {
                    alert('음성에서 추출된 텍스트가 없습니다');
                }
                else {
                    alert("에러가 발생했습니다");
                }
            });
    };

    const handleStopRecording = () => {
        setIsRecording(false);
        setSelectedAudioFile(null);
        fetch('/convert/stop_record', { method: 'POST' })
            .then(response => response.text())
            .then(data => console.log(data))
            .catch(error => {
                console.error(error);
                alert("에러가 발생했습니다");
            });
    };
    
    useEffect(() => {
        if (isRecording) {
            const startTime = new Date().getTime();
            const interval = setInterval(() => {
            const currentTime = new Date().getTime() - startTime;
            setProgress(currentTime);
          }, 100); // 100ms마다 업데이트, 원하는 간격으로 수정 가능
    
          return () => clearInterval(interval); // 녹음 중지 시 interval 정리
        }
    }, [isRecording]);

    const handleNBResult = () => {
        setSelectedResultType("NB");
    };
    
    const handleSVMResult = () => {
        setSelectedResultType("SVM");
    };

    const NBchartData = {

        labels: NBgraph.category.slice(0, 5),
        datasets: [
            {
                label: "NB : " + NBResult + " words",
                data: NBgraph.value.slice(0, 5),
                backgroundColor: "#1D976C",
                datalabels: {
                color: "black",
                backgroundColor: 'white',
                font: { size: 13, weight: 'bold' },
                },
            },
        ],
    };
    const SVMchartData = {
    
        labels: SVMgraph.category.slice(0, 5),
        datasets: [
            {
            label: "SVM : " + SVMResult + " words",
            data: SVMgraph.value.slice(0, 5),
            backgroundColor: "#93F9B9",
            datalabels: {
                color: "black",
                backgroundColor: 'white',
                font: { size: 13, weight: 'bold' },
                },  
            },
        ],
    };

    const options = {
        legend: {
            display: true,
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
            y: {
                grid: {
                    display: false,
                },
            },
        },
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
    };


    return (
        <div
            className='voiceContainer'

            style={{
                //alignItems : "center",
                textAlign: "center",
                // justifyContent : "center",
                //display : "flex",
                fontSize: "1vw",
                margin: "0.5vw",
                width: "80vw",
                height: "95%",
                // border:"1px solid #0400ff",
                // boxShadow : "0 0 10px 1px #0400ff",
            }}
        >
            <Div_txt>
                <div style={{display : "flex", margin: "30px 0px 20px 0px", justifyContent: "center"}}>
                    <span style={{
                        width : "45%"
                    }}>
                        <div className="input-section" 
                            style={ {
                                margin : "10px"
                            }}>
                            {!isRecording && <button style={{margin : "0px 5px"}} className="voiceRecBtn" onClick={handleStartRecording}> Start Recording </button>}
                            {isRecording && <button style={{margin : "0px 5px"}} className="voiceStopBtn" onClick={handleStopRecording}> Stop Recording </button>}
                        </div>
                        <div>
                        <progress 
                            className = "progress"
                            value={progress} 
                            max="60000" >
                        </progress>
                        </div>
                    </span>
                    
                    <span style={{
                        width : "45%"
                    }}>
                        <div className="input-section"
                            style={{
                                margin : "10px"
                            }}>
                            <div className="vfilebox">
                                <label for="vcfile" style={{ width: "100px", height: "100%" }}>
                                    UPLOAD FILE
                                </label>
                                <input type="file" id="vcfile" accept="audio/*" onChange={handleAudioFileChange} />
                            </div>
                        </div>
                        <div>
                            Selected File: {' '}
                            {selectedAudioFile && (
                                <strong>{selectedAudioFile.name}</strong>
                            )}  
                        </div>
                    </span>
                </div>
                <button className="voiceTestBtn" onClick={convertAudio}>VERIFY SPAM</button>

                <div style={{
                    margin: "20px 20px 5px 25px",
                    width: "90%",
                    height: "60%",
                    background: " #f8f8f8",
                    borderRadius: "32px",
                    boxShadow: "-6px -6px 10px rgba(255, 255, 255, 0.8), 6px 6px 10px rgba(0, 0, 0, 0.2)",

                }}>
                    <div style={{
                        //padding : "20px",
                        overflow: "scroll",
                        fontSize: "17px",
                        scrollbarColor: "black",
                        width: "83%",
                        height: "75%",
                        textAlign: "center",
                        lineHeight: "1.8",
                        padding: "2vw",
                    }}className="scrollBar">
                        {(selectedResultType === "NB") && (conversionResult) 
                            && (<HighlightedText text={conversionResult} queries={NBgraph.category} 
                                                    probs={NBgraph.value} result={NBResult} />)}
                        {(selectedResultType === "SVM") && (conversionResult) 
                            && (<HighlightedText text={conversionResult} queries={SVMgraph.category}
                                                    probs={SVMgraph.value} result={SVMResult} />)}
                    </div>
                    
                    <div>
                        <button
                        onClick={handleNBResult}
                        style={{
                            backgroundColor: selectedResultType === "NB" ? "#1D976C" : "",
                            padding : "5px 10px 5px 10px",
                            margin: "0px 5px 10px 0px",
                            borderRadius: "32px",
                            border : "none",
                            boxShadow: "-6px -6px 10px rgba(255, 255, 255, 0.8), 6px 6px 10px rgba(0, 0, 0, 0.2)",
                            color: "#6f6cd",
                            cursor: "pointer",
                        }}
                        >
                        NB
                        </button>
                        <button
                        onClick={handleSVMResult}
                        style={{
                            backgroundColor: selectedResultType === "SVM" ? "#93F9B9" : "",
                            padding : "5px 10px 5px 10px",
                            margin: "0px 0px 10px 5px",
                            borderRadius: "32px",
                            border : "none",
                            boxShadow: "-6px -6px 10px rgba(255, 255, 255, 0.8), 6px 6px 10px rgba(0, 0, 0, 0.2)",
                            color: "#6f6cd",
                            cursor: "pointer",
                        }}
                        >
                        SVM
                        </button>
                    </div>
                </div>

            </Div_txt>

            <Div_NB>
                <h3 style={{ lineHeight: "3", display: "flex", margin: "0vw 0vw 0vw 2vw", height: "2vw",
                borderBottom: "10px solid " ,borderImage:"linear-gradient(45deg,rgba(29,151,108,0.7),rgba(147,249,185,0.7)) 10"  }}> NB ( Naive Bayes ) :
                    {NBResult && (
                        <div style={{fontSize:"27px", lineHeight:"2", margin: "0px 10px 0 10px"}}>  { NBResult } </div>
                    )}
                </h3>
                <div className="section" style={{height:"85%",margin:"0vw 0vw 0vw 2vw", background: "#fbfbfb", display: "flex", justifyContent: "center" }}>
                    {loading ? (
                        <div style={{ display: "flex", justifyContent: "center", position: 'relative', top: '20%'}}>
                        <Oval
                            height={80}
                            width={80}
                            color="#12c2e9"
                            visible={loading}
                            ariaLabel="oval-loading"
                            secondaryColor="#12c2e9"
                            strokeWidth={2}
                            strokeWidthSecondary={2}
                        />
                        </div>
                    ) : null}

                    {NBgraph.category.length !== 0 && (
                        <div style={{ width: "100%", height: "120%" }}>
                            <div style={{ width: "33vw", height: "11vw", padding: "2.5vw 2vw 0vw 1.5vw" }}>
                                <Bar data={NBchartData} options={options} style={{}
                                } />
                            </div>
                        </div>
                    )}
                    {error && (
            <div style = {{ padding :"4vw" , color:"red"}}>
            {"Oops,"}
            <br/>
            {"Error Occured :("}
            </div>
          )}
                </div>
            </Div_NB>


            <Div_SVM>

                <h3 style={{ lineHeight: "3", display: "flex", margin: "0vw 0vw 0vw 2vw", height: "2vw",
                    borderBottom: "10px solid  ",borderImage:"linear-gradient(45deg,rgba(147,249,185,0.7),rgba(29,151,108,0.7)) 10" 
             }}> SVM ( Support Vector Machine ) :
                    {SVMResult && (
                        <div style={{fontSize:"27px", lineHeight:"2", margin: "0px 10px 0 10px"}}>  { SVMResult } </div>
                    )}
                </h3>
                <div className="section" style={{height:"85%",margin:"0vw 0vw 0vw 2vw", background: "#fbfbfb", display: "flex", justifyContent: "center" }}>
                    {loading ? (
                        <div style={{ display: "flex", justifyContent: "center", position: 'relative', top: '20%' }}>
                        <Oval
                            height={80}
                            width={80}
                            color="#c471ed"
                            visible={loading}
                            ariaLabel="oval-loading"
                            secondaryColor="#c471ed"
                            strokeWidth={2}
                            strokeWidthSecondary={2}
                        />
                        </div>
                    ) : null}

                    {SVMgraph.category.length !== 0 && (
                        <div style={{ width: "100%", height: "120%" }}>
                        <div style={{ width: "33vw", height: "11vw", padding: "2.5vw 2vw 0vw 1.5vw" }}>
                            <Bar data={SVMchartData} options={options} style={{}
                            } />
                        </div>
                        </div>
                    )}
                    {error && (
            <div style = {{ padding :"4vw" , color:"red"}}>
            {"Oops,"}
            <br/>
            {"Error Occured :("}
            </div>
          )}
                    </div>
            </Div_SVM>
        </div>

    );
}
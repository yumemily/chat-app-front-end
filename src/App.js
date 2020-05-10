import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import Header from "./components/Header";
import Sidebar from "./components/Sidebar"

import * as moment from 'moment'

// import socketIOClient from "socket.io-client";
// const socket = socketIOClient("http://localhost:5000");
import socket from "./utils/socket"

function App() {

    const [chat, setChat] = useState("")
    const [chatLog, setChatLog] = useState([])
    const [user, setUser] = useState(null)
    const chatLogRef = useRef([]) //create a ref to current value of chatlog
    const [oldChats, setOldChats] = useState([])

    useEffect(() => {
        askUserName()
        chatConnection(chatLog)
    }, []) //rmb empty array means trigger callback only after the first render and when one of the elemens in the array is changed

    const askUserName = () => {
        const userName = prompt("please enter ur name")
        if (!userName) return askUserName();

        socket.emit("login", userName, res => {  //trigger login event and send userName
            if (!res.ok) return alert("cannot login")
            else {
                setUser(res.data) //set user as an object with name: data
            }
        })
    }
    console.log("CHATLOG", chatLog)

    const chatConnection = () => {
        socket.on("messages", (msg) => {
            console.log(msg)
            chatLogRef.current.push(msg)
            setChatLog([...chatLogRef.current])
        })
    }


    const handleChange = (e) => {
        setChat(e.target.value)
    }

    const submitChat = (e) => {
        e.preventDefault()
        console.log(e)

        let chatObj = {
            text: chat,
            name: user.name,
            createdAt: new Date().toLocaleTimeString()
        }

        socket.emit("chat", chatObj, (res, err) => {
            console.log("RES", res)
            if (err) {
                console.log(err)
            } else {
                if (res && res.ok)
                    chatLogRef.current.push(res.data)
                setChatLog([...chatLogRef.current])
            }
        })
        setChat("")
        document.getElementById("input-text").reset()
    }

    const leaveRoom = (e) => {
        e.preventDefault()
        socket.emit("leaveRoom", null, res => {
            if (res && !res.ok) {
                console.log(res.error)
            }
        })
    }

    console.log("OLDCHATS", oldChats)

    return (
        <div>
            <div class="chat-container">
                <header class="chat-header">
                    <h1><i class="fas fa-comment-dots"></i> ChatCord</h1>
                    <a href="index.html" class="btn" onClick={(e) => leaveRoom(e)}>Leave Room</a>
                </header>
                <main class="chat-main">
                    <div class="chat-sidebar">
                        <h2><Header user={user} /></h2>
                        <Sidebar passOldChat={setOldChats} />
                    </div>
                    <div class="chat-messages">
                        
                        {oldChats.map(el =>
                            <div class="message">
                                <p class="meta">{el.user.name} <span>{moment(el.createdAt).calendar()}</span></p>
                                <p class="text">
                                    {el.text}
                                </p>
                            </div>
                        )}

                        {chatLog.map(el =>
                            <div class="message">
                                <p class="meta">{el.name} <span>{moment(el.createdAt).calendar()}</span></p>
                                <p class="text">
                                    {el.text}
                                </p>
                            </div>
                        )}
                    </div>
                </main>
                <div class="chat-form-container">
                    <form id="input-text" onChange={handleChange} onSubmit={(e) => submitChat(e)}>
                        <input
                            id="chat"
                            type="text"
                            placeholder="Enter Message"
                            required
                            autocomplete="off"
                        />
                        <button class="btn"><i class="fas fa-paper-plane"></i> Send</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default App;

//3000 is a node server and serves static files to browsers
//browser execs frontend js code (ex click button and send request) 
//and sends requests to backend (5000)
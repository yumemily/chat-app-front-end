import React, { useEffect, useState } from 'react'
import socket from "../utils/socket"

export default function Sidebar(props) {
    const [rooms, setRooms] = useState([]);
    const [room, setRoom] = useState("");
    
    //fetch api
    useEffect(()=>{
        socket.on("rooms", data => setRooms(data)) //data should be an array of rooms
        socket.on("selectedRoom", data => setRoom(data)) //data is a rooom object
        socket.on("oldChats", data => props.passOldChat(data))
    },[])

    //send roomId to backend
    const joinRoom = (id) => {
        socket.emit("joinRoom", id)
    }

    console.log(room)
    return (
        // <div>
        //     {rooms.map(el => <li key={el._id} onClick={()=> joinRoom(el._id)}> {el.name}({el.members.length})</li>)}
        // </div>
        <div>
            <h3><i class="fas fa-comments"></i> Room Name:</h3>
                        <h2 id="room-name">{room.name}</h2>
                        <h3><i class="fas fa-users"></i> Rooms</h3>
                        <ul id="users">
                        {rooms.map(el => <li key={el._id} onClick={()=> joinRoom(el._id)}> {el.name} ({el.members.length})</li>)}
                        </ul>
        </div>
    )
}

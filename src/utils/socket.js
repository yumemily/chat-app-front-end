import socketIOClient from "socket.io-client";
const socket = socketIOClient("https://chat-app-em.herokuapp.com/");

export default socket
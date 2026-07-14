const express = require("express");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");

const io = new Server({
    cors:true
})
const app = express()

app.use(bodyParser.json())


const emailToSocketMapping = new Map()


io.on("connection",socket =>{  
    console.log("New Connection")                   //signaling server (handling events on server)
    socket.on("join-room",(data) => {
        const {email, room_id} = data
        console.log("user",email,"joined room",room_id)
        emailToSocketMapping.set(email,socket.id)
        socket.join(room_id)
        socket.broadcast.to(room_id).emit("user-joined", {email})
    })
})   

app.listen(8000,() =>{console.log("Server is running on port 8000")})
io.listen(8001)
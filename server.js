const http=require("http");
const express=require("express");
const path = require("path");

const app=express();

const server=http.createServer(app);
const port=process.env.PORT||3000;

app.use(express.static('public')); 
app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html' );
})
const io=require("socket.io")(server);
var users={};
io.on("connection",(socket)=>{
 socket.on("new-user-joined",(username)=>{
    console.log("Got call");
    users[socket.id]=username;
    socket.broadcast.emit('user-connected',username);
    io.emit("user-list",users);
});
 socket.on("disconnect",()=>{
    console.log("got dis event");
    let user = users[socket.id];
    socket.broadcast.emit('user-disconnected',user);
delete users[socket.id] ;
io.emit("user-list",users);
 });
 socket.on('message',(data)=>{
    socket.broadcast.emit("message",{user:data.user,msg:data.msg});
 });
}) ;

server.listen(port,()=>{
    console.log("Server started at"+port);
})
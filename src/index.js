const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const {Generate,GenerateURL} = require('./utils/func')
const {addUser,removeUser,getUser,getUsersinRoom} = require('./utils/users')
const app = express()
const server = http.createServer(app)

const io = socketio(server)
const port = process.env.PORT || 3000

const dirPath = path.join(__dirname, '../public')

app.use(express.static(dirPath))

io.on('connection', (socket) => {
    user = getUser(socket.id)
    socket.on('updateAll', (message,callback) => {
    io.to(user.room).emit('message',Generate(user.username,message))
    callback()
 })

   socket.on('join', ({username,room},callback) => {
        const {error,user} = addUser({id : socket.id,username,room})
        if(error) {
            return callback(error)
        }
        socket.join(user.room)
        socket.emit('message', Generate('Admin','Welcome!'))
        socket.broadcast.to(user.room).emit('message', Generate('Admin',`${user.username} has Joined!!`))
        io.to(user.room).emit('roomData',{
            room : user.room,
            users : getUsersinRoom(user.room)
        })
        callback()
    })

    
    socket.on('disconnect',() => {
        const user = removeUser(socket.id)
        if(user){
            io.to(user.room).emit('message', Generate('Admin',`${user.username} has Left!`))
            io.to(user.room).emit('roomData',{
                room : user.room,
                users : getUsersinRoom(user.room)
            })
        }
        
    })

    socket.on('Loc',({latitude,longitude} = {},callback) => {
        user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', GenerateURL(user.username,`https://google.com/maps?q=${latitude},${longitude}`))
        callback()
    })

   

    
})


server.listen(port,() => {
    console.log('Server Up')
})
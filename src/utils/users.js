users = []

const addUser = ({id,username,room}) => {
    if(!username || !room){
        return  {error : 'Username and Room required'}
    }
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
    
    const existingUser = users.find((user) => {
        return user.username === username && user.room  === room
    })
    if(existingUser) {
        return {error : 'username already exists'}
    }
    user = {id,username,room}
    users.push(user)
    return {user}
}

const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })

    if(index !== -1) {
        return users.splice(index,1)[0]
    }
}

const getUser = (id) => {
    const user = users.find((user) => {
        return user.id === id
    })
    return user
}

const getUsersinRoom = (room) => {
    
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
    
}


module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersinRoom
}
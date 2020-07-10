const ChatForm = document.querySelector('form')
const chatButton = ChatForm.querySelector('button')
const MessageTemplate = document.querySelector('#message-template').innerHTML
const Messages = document.querySelector('#Message')
const Locations = document.querySelector('#Location')
const LocationTemplate = document.querySelector('#Location-Template').innerHTML
const SidebarTemplate = document.querySelector('#Sidebar-Template').innerHTML


const socket = io()

const {username,room} = Qs.parse(location.search,{ ignoreQueryPrefix: true })



socket.on('message', ({username,message,createdAt}) => {
    console.log(message)
    const html = Mustache.render(MessageTemplate, {
        username,
        text : message,
        createdAt : moment(createdAt).format('h:mm a')
    })
    Messages.insertAdjacentHTML('beforeend', html)
   
     
})

socket.on('locationMessage', ({username,url}) => {
    console.log(url)
    const html = Mustache.render(LocationTemplate, {
        username,
        url,
        createdAt : moment(url.createdAt).format('h:mm a')
    })
    Locations.insertAdjacentHTML('beforeend',html)
   
   
})





ChatForm.addEventListener('submit',(e) => {
    e.preventDefault()
    // console.log(inpText.value)
    chatButton.setAttribute('disabled','disabled')
    const message = e.target.elements.inputText.value
    socket.emit('updateAll', message, () => {
        chatButton.removeAttribute('disabled')
    })
})








const mess = document.querySelector('#loc')
mess.addEventListener('click',(e) => {
  
    if(!navigator.geolocation){
        return alert('No geo location support')
    }
    mess.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((current) => {
        
        socket.emit('Loc', {
            latitude : current.coords.latitude,
            longitude : current.coords.longitude
        }, () => {
            console.log('Location Shared')
            mess.removeAttribute('disabled')
            
        })

    })
})

socket.on('roomData', ({room,users}) => {
    const html = Mustache.render(SidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

socket.emit('join',{ username,room },(error) => {
    if(error) {
        alert(error)
        location.href = '/'
    }
})
// document.querySelector('#clicked').addEventListener('click', () => {
//     console.log('button clicked')
//     socket.emit('Increment')
// })
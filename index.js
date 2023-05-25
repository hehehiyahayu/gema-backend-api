const express = require("express")
const ngrok = require("ngrok")

const userRoutes = require("./src/routes/userRoutes")
const adRoutes = require("./src/routes/adRoutes")
const majorRoutes = require("./src/routes/majorRoutes")
const adTypeRoutes = require("./src/routes/adTypeRoutes")
const categoryRoutes = require("./src/routes/categoryRoutes")
const chatRoutes = require("./src/routes/chatRoutes")
const conditionRoutes = require("./src/routes/conditionRoutes")
const reviewRoutes = require("./src/routes/reviewRoutes")
const statusRoutes = require("./src/routes/statusRoutes")
const studyProgramRoutes = require("./src/routes/studyProgramRoutes")
const wishlistRoutes = require("./src/routes/wishlistRoutes")
const authRoutes = require("./src/routes/authRoutes")

const app = express()

// const router = express.Router({ mergeParams: true });

// app.get('/', (req, res) => {
//     res.send('Hello World')
// })

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.use('/api/user/', userRoutes.routes)

app.use('/api/ad/', adRoutes.routes)

app.use('/api/major/', majorRoutes.routes)

app.use('/api/adtype/', adTypeRoutes.routes)

app.use('/api/category/', categoryRoutes.routes)

app.use('/api/chat/', chatRoutes.routes)

app.use('/api/condition/', conditionRoutes.routes)

app.use('/api/review/', reviewRoutes.routes)

app.use('/api/status/', statusRoutes.routes)

app.use('/api/studyprogram/', studyProgramRoutes.routes)

app.use('/api/wishlist/', wishlistRoutes.routes)

app.use('/api/auth/', authRoutes.routes)

const PORT = process.env.PORT || 8080

const server = app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}.`)
})


const io = require('socket.io')(server)

let connectedUsers = [];

io.on('connection', (socket)=>{
    console.log("Connected Successfuly", socket.id)
    connectedUsers.push({
        socketId: socket.id,
    });
    console.log(connectedUsers);

    io.emit('connectedUsers', connectedUsers);

    socket.on('disconnect', ()=>{
        console.log("Disconnected Successfuly", socket.id)
        connectedUsers = connectedUsers.filter((user) => user.socketId !== socket.id);
        io.emit('connectedUsers', connectedUsers);
    })

    socket.on('message', (data)=>{
        console.log(data)
        socket.broadcast.emit('message-receive', data);
    })
})

ngrok.connect({
    proto : 'http',
    addr : process.env.PORT,
}, (err, url) => {
    if(err) {
        console.error('Error while connecting Ngrok',err);
        return new Error('Ngrok Failed');
    }
})

// taskkill /f /im ngrok.exe    : untuk melakukan restart server ngrok.
// ngrok http 8080              : untuk menjalankan server ngrok untuk aplikasi ini.
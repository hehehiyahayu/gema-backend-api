const express = require("express")

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
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}.`)
})
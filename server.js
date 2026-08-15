require("dotenv").config()

const app = require('./src/app')
const connectToDB = require("./src/config/db")

async function startServer() {
  try {
    await connectToDB()

    const PORT = process.env.PORT || 5000

    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use by another process.`)
      } else {
        console.error('Server error:', err)
      }
    })
  } catch (err) {
    console.error('Server startup failed:', err.message)
    process.exit(1)
  }
}

startServer()

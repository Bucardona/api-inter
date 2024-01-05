import express from 'express'
import { configServer } from './config'

const app = express()
const PORT = configServer.PORT

app.set('port', PORT)
app.use(express.json())

function onStart () {
  console.log(`Server running on port http://localhost:${PORT}`)
}

export {
  app,
  onStart
}

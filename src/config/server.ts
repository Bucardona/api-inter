import express from 'express'
import { configServer } from './config'

const app = express()
const PORT: number = configServer.PORT

app.set('port', PORT)
app.use(express.json())

function onStart (): void {
  console.log(`Server running on port ${PORT}`)
}

export { app, onStart }

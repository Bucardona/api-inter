import express from 'express'
import { configServer } from './config'

const app = express()
const PORT: number = configServer.PORT
const HOST: string = configServer.HOST

app.set('port', PORT)
app.set('host', HOST)
app.use(express.json())

function onStart (): void {
  console.log(`Server running on port http://${HOST}:${PORT}`)
}

export { app, onStart }

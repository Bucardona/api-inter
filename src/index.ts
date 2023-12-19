import express from 'express'
import { serverConfig } from './config/config'
import { routesDms } from './dms/routesDms'

const app = express()
const PORT = serverConfig.PORT

app.use(express.json())
app.use('/dms', routesDms)

function onStart () {
  console.log(`Server running on port ${PORT}`)
}

app.listen(PORT, onStart)

export {
  app
}

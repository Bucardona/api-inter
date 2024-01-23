import { Router } from 'express'
import { routesDmsV1 } from './v1/routes/routesDmsV1'

const routesDms = Router()

routesDms.use('/v1', routesDmsV1)

export { routesDms }

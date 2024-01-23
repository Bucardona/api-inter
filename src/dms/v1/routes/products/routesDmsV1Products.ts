import { Router } from 'express'
import { getDmsProductsPrices } from '../../controllers/controllerDmsV1Products'

const routesDmsV1Products = Router()

routesDmsV1Products.get('/', getDmsProductsPrices)

routesDmsV1Products.get('/:id', getDmsProductsPrices)

export { routesDmsV1Products }

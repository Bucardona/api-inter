import { Router } from 'express'
import { getDmsProductsInter, getDmsProductsPrices } from '../../controllers/controllerDmsV1Products'

const routesDmsV1Products = Router()

routesDmsV1Products.get('/', getDmsProductsPrices)

routesDmsV1Products.get('/inter', getDmsProductsInter)

routesDmsV1Products.get('/:id', getDmsProductsPrices)

export { routesDmsV1Products }

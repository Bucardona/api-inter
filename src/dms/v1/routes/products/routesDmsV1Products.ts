import { Router } from 'express'
import { getDmsProducts } from '../../controllers/controllerDmsV1Products'

const routesDmsV1Products = Router()

routesDmsV1Products.get('/', getDmsProducts)

routesDmsV1Products.get('/:id', getDmsProducts)

export { routesDmsV1Products }

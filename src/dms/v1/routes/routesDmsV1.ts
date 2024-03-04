import { Router } from 'express'
import { routesDmsV1Products } from './products/routesDmsV1Products'
import { routesDmsV1ProductsImages } from './products/routesDmsV1ProductsImages'

const routesDmsV1 = Router()

routesDmsV1.use('/products', routesDmsV1Products)
routesDmsV1.use('/images', routesDmsV1ProductsImages)

export { routesDmsV1 }

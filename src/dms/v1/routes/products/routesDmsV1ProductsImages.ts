import { Router } from 'express'
import { getDmsImagesBySku } from '../../controllers/controllerDmsV1ProductsImages'

const routesDmsV1ProductsImages = Router()

routesDmsV1ProductsImages.get('/:codigo', getDmsImagesBySku)

export { routesDmsV1ProductsImages }

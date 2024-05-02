import { Router } from 'express'
import { getDmsImageById, getDmsImagesFilteringSku } from '../../controllers/controllerDmsV1ProductsImages'

const routesDmsV1ProductsImages = Router()

routesDmsV1ProductsImages.get('/', getDmsImagesFilteringSku)

routesDmsV1ProductsImages.get('/:id', getDmsImageById)

export { routesDmsV1ProductsImages }

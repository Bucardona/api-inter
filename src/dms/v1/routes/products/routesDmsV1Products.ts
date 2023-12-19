import { Router } from "express"

const routesDmsV1Products = Router()

routesDmsV1Products.get("/", (req, res) => {
  res.send("Get method from products")
})

export {
  routesDmsV1Products
} 
import { Router } from "express";
import { routesDmsV1Products } from "./products/routesDmsV1Products";

const routesDmsV1 = Router();

routesDmsV1.use("/products", routesDmsV1Products );

export {
  routesDmsV1
}
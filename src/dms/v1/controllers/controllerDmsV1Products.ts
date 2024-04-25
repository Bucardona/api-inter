import type { RequestHandler } from 'express'
import { jsonResponseFormat } from '../utils/jsonResponseFormat'
import { execProcedureDms } from '@/dms/models/dmsDatabase'

/* export const getDmsProductsPrices: RequestHandler = (async (req, res) => {
  const { id = 0 } = req.params // id del producto: 0 = todos, int = para un producto

  const dateStart = new Date()
  console.log(
    `${dateStart.getHours()}:${dateStart.getMinutes()}:${dateStart.getSeconds()}`
  )

  const Bod: number[] = []
  let lista: number = -1

  const warehouses: Record<string, number> = {
    1111: 2, // Tesoro
    1121: 3, // Oviedo 1
    1125: 4, // Online
    1127: 5, // Oviedo 2
    1130: 6, // Jardines
    7100: 7, // Administrativo
    7114: 8, // Inventarios
    7116: 20 // Mercadeo
  }
  if (req.query.warehouse) {
    const warehouseQuery = String(req.query.warehouse).split(',')
    warehouseQuery.forEach((warehouse: string) => {
      if (warehouses[warehouse]) Bod.push(warehouses[warehouse])
    })
  }
  if (req.query.price) {
    lista = Number(req.query.price)
  }

  try {
    const result = await execProcedureDms('Get2554', [
      { name: 'Emp', value: 601 }, // int = empresa
      { name: 'gru', value: 0 },
      { name: 'sub', value: 0 },
      { name: 'Bod', value: Bod.join(',') }, // string vacio = todas, string(',') = para varias bodegas
      { name: 'stk', value: 1 },
      { name: 'lista', value: lista }, // lista de precios: 0 = todas, int = para una lista (codigo de lista = 1,2,3,4)
      { name: 'iditem', value: Number(id) }, // id del producto: 0 = todos, int = para un producto
      { name: 'cli', value: 0 }, // id del proveedor: 0 = todos, int = para un proveedor
      { name: 'solo_stock', value: 1 } // stock: 0 = todos, 1 = con stock
    ])

    if (result && result.recordset.length > 0) {
      let products: any[] = result.recordset

      if (req.query.sku) {
        const { sku } = req.query
        products = products.filter(
          (product) =>
            product.codigo.toLowerCase() === String(sku).toLowerCase()
        )
      }
      if (req.query.group) {
        const { group } = req.query
        products = products.filter(
          (product) =>
            product.grupo.toLowerCase() === String(group).toLowerCase()
        )
      }
      if (req.query.subgroup) {
        const { subgroup } = req.query
        products = products.filter(
          (product) =>
            product.subgrupo.toLowerCase() === String(subgroup).toLowerCase()
        )
      }

      // Transformar datos

      // .Transformar datos

      const dateEnd = new Date()
      console.log(
        `${dateEnd.getHours()}:${dateEnd.getMinutes()}:${dateEnd.getSeconds()}`
      )
      res.json(jsonResponseFormat(200, 'OK', products))
    } else res.json(jsonResponseFormat(400, 'Not Found'))
  } catch (error) {
    console.log(error)
  }
}) as RequestHandler */

export const getDmsProducts = (async (req, res) => {
  const defaultPageSize = '10'
  const defaultPage = '1'

  const { filter, populate, pageSize = defaultPageSize, page = defaultPage } = req.query

  const filters: Array<{ name: string, value: string }> | undefined = []
  const populates: Array<{ name: string, value: boolean }> | undefined = []
  const pagination: Array<{ name: string, value: number }> | undefined = []

  if (pageSize || page) {
    if (typeof pageSize === 'string') {
      const pageSizeValue = Number(pageSize) || Number(defaultPageSize)
      pagination.push({ name: 'PageSize', value: pageSizeValue })
    }
    if (typeof page === 'string') {
      const pageValue = Number(page) || Number(defaultPage)
      pagination.push({ name: 'Page', value: pageValue })
    }
  }
  if (filter) {
    for (let [name, value] of Object.entries(filter)) {
      if (name === 'groupsCode1') {
        if (value === 'store') {
          value = 'relojes,joyas,gafas,accesorios,varios'
        } else if (value === 'workshop') {
          value = 'servicios,repuestos relojeria,piedras,materia prima,repuestos joyeria'
        }
      }
      if (typeof value === 'string') {
        filters.push({
          name: name.slice(0, 1).toUpperCase() + name.slice(1),
          value
        })
      } else {
        continue
      }
    }
  }
  if (populate) {
    if (typeof populate === 'string') {
      const populateValues = populate.split(',')
      populateValues.forEach((value) => {
        populates.push({
          name: 'Populate' + value.slice(0, 1).toUpperCase() + value.slice(1),
          value: true
        })
      })
    } else {
      for (const [name, value] of Object.entries(populate)) {
        if (typeof value === 'string') {
          populates.push({
            name: 'Populate' + name.slice(0, 1).toUpperCase() + name.slice(1),
            value: value === 'true'
          })
        } else {
          continue
        }
      }
    }
  }
  /* if (Number(id) > 0) {
  } */
  console.log(filters, populates, pagination)
  try {
    const result = await execProcedureDms('JI_Inventario_Stock', [
      ...filters,
      ...populates,
      ...pagination
    ] /* [
      { name: 'PopulateStockDetails', value: false },
      { name: 'PopulateStock', value: false },
      { name: 'PopulateCost', value: false },
      { name: 'PopulatePrice', value: false },
      { name: 'PopulateGroup', value: false },
      { name: 'Id', value: '' },
      { name: 'Sku', value: '' },
      { name: 'ProductCategory', value: '' },
      { name: 'IsWebActive', value: '' },
      { name: 'HasImage', value: '' },
      { name: 'FilterGroup1', value: '' },
      { name: 'FilterGroup2', value: '' },
      { name: 'FilterGroup3', value: '' },
      { name: 'FilterGroup4', value: '' },
      { name: 'FilterGroup5', value: '' },
      { name: 'FilterGroup6', value: '' },
      { name: 'FilterGroup7', value: '' },
      { name: 'FilterProductType', value: '' }
    ] */)
    if (result && result.recordset.length > 0) {
      const products: object[] = JSON.parse(`${result.recordset[0].data}`)
      const metadata = {
        url: `${req.protocol}://${req.hostname}${req.hostname === 'localhost' ? ':' + process.env.PORT : ''}${req.originalUrl}`,
        total: Number(JSON.parse(`${result.recordset[0].totalRecords}`)),
        totalPage: products?.length,
        page: Number(page),
        pageSize: Number(pageSize)
      }
      res.json(jsonResponseFormat(200, 'OK', products, metadata))
    } else res.json(jsonResponseFormat(400, 'Not Found'))
  } catch (error) {
    console.log(error)
  }
}) as RequestHandler

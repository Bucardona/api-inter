import type { RequestHandler } from 'express'
import { jsonResponseFormat } from '../utils/jsonResponseFormat'
import { execProcedureDms } from '@/dms/models/dmsDatabase'

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
    const result = await execProcedureDms('JI_Products', [
      { name: 'Company', value: '601' },
      ...filters,
      ...populates,
      ...pagination
    ])
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

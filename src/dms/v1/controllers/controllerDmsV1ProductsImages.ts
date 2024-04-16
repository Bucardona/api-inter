import { type RequestHandler } from 'express'
import { jsonResponseFormat } from '../utils/jsonResponseFormat'
import { execQueryDms } from '@/dms/models/dmsDatabase'
import sharp from 'sharp'

export const getDmsImagesBySku = (async (req, res) => {
  const { codigo } = req.params // id del producto: 0 = todos, int = para un producto
  try {
    const result = await execQueryDms(`SELECT TOP 1
    data = (
      SELECT CAST(imagen AS varbinary(max))
      FOR XML PATH(''), BINARY BASE64
    )
  FROM cot_item WHERE codigo = '${String(codigo).toUpperCase()}'`)

    if (result && result.recordset.length > 0 && result.recordset[0].data) {
      const { data }: { data: string } = result.recordset[0]
      let img = Buffer.from(data, 'base64')

      if (
        req.query.size &&
        Number(req.query.size) > 0 &&
        Number(req.query.size) < 3000
      ) {
        img = await sharp(img).resize(Number(req.query.size)).toBuffer()
      }

      // res.contentType('text/html')
      // res.send(`<img src="data:img/png;base64,${data}">`)
      res.setHeader('Content-Length', img.length)
      res.contentType('image/jpg')
      res.send(img)
      // res.json( jsonResponseFormat({status: 200, message: 'OK', data}) )
    } else res.json(jsonResponseFormat(400, 'Not Found'))
  } catch (error) {
    res.json(jsonResponseFormat(500, 'Error'))
  }
}) as RequestHandler

export const getDmsImagesFilteringSku = (async (req, res) => {
  const { filter, modify } = req.query as { filter?: { sku?: string }, modify?: { imgSize?: string } }

  if (!filter) return res.json(jsonResponseFormat(400, 'Bad Request'))

  if (!filter.sku) return res.json(jsonResponseFormat(400, 'Bad Request'))

  const { sku } = filter

  try {
    const result = await execQueryDms(`SELECT TOP 1
    data = (
      SELECT CAST(imagen AS varbinary(max))
      FOR XML PATH(''), BINARY BASE64
    )
  FROM cot_item WHERE codigo = '${String(sku).toUpperCase()}'`)

    if (result && result.recordset.length > 0 && result.recordset[0].data) {
      const { data }: { data: string } = result.recordset[0]
      let img = Buffer.from(data, 'base64')

      if (
        modify?.imgSize &&
        Number(modify.imgSize) >= 50 &&
        Number(modify.imgSize) < 3000
      ) {
        img = await sharp(img).resize(Number(modify.imgSize)).toBuffer()
      }

      // res.contentType('text/html')
      // res.send(`<img src="data:img/png;base64,${data}">`)
      res.setHeader('Content-Length', img.length)
      res.contentType('image/jpg')
      res.send(img)
      // res.json( jsonResponseFormat({status: 200, message: 'OK', data}) )
    } else res.json(jsonResponseFormat(400, 'Not Found'))
  } catch (error) {
    res.json(jsonResponseFormat(500, 'Error'))
  }
}) as RequestHandler

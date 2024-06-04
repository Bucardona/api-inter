import { type RequestHandler } from 'express'
import { jsonResponseFormat } from '../utils/jsonResponseFormat'
import { execQueryDms } from '@/dms/models/dmsDatabase'
import sharp from 'sharp'

export const getDmsImageById = (async (req, res) => {
  const { id } = req.params // id del producto: 0 = todos, int = para un producto
  try {
    const result = await execQueryDms('SELECT TOP 1 imagen FROM cot_item WHERE id = @id', [{ name: 'id', type: 'number', value: Number(id) }])

    if (result && result.recordset.length > 0 && result.recordset[0].imagen) {
      const { imagen }: { imagen: string } = result.recordset[0]
      const { modify } = req.query as { modify?: { imgSize?: string } }
      let img = Buffer.from(imagen)

      if (
        modify?.imgSize &&
        Number(modify.imgSize) >= 50 &&
        Number(modify.imgSize) < 3000
      ) {
        img = await sharp(img).resize(Number(modify.imgSize)).toBuffer()
      }
      res.setHeader('Content-Length', img.length)
      res.contentType('image/jpg')
      res.send(img)
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

  try { /*
    const result = await execQueryDms(`SELECT TOP 1
    data = (
      SELECT CAST(imagen AS varbinary(max))
      FOR XML PATH(''), BINARY BASE64
    )
  FROM cot_item WHERE codigo = '${String(sku).toUpperCase()}'`) */
    const result = await execQueryDms('SELECT TOP 1 imagen FROM cot_item WHERE codigo = @sku', [{ name: 'sku', type: 'string', value: String(sku).toUpperCase() }])

    if (result && result.recordset.length > 0 && result.recordset[0].imagen) {
      const { imagen }: { imagen: string } = result.recordset[0]
      let img = Buffer.from(imagen)

      if (
        modify?.imgSize &&
        Number(modify.imgSize) >= 50 &&
        Number(modify.imgSize) < 3000
      ) {
        img = await sharp(img).resize(Number(modify.imgSize)).toBuffer()
      }
      res.setHeader('Content-Length', img.length)
      res.contentType('image/jpg')
      res.send(img)
    } else res.json(jsonResponseFormat(400, 'Not Found'))
  } catch (error) {
    res.json(jsonResponseFormat(500, 'Error'))
  }
}) as RequestHandler

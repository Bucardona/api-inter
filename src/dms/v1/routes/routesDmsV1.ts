import { Router } from 'express'
import { routesDmsV1Products } from './products/routesDmsV1Products'
import { execQueryDms } from '../../../dms/models/dmsDatabase'
import { jsonResponseFormat } from '../utils/jsonResponseFormat'

const routesDmsV1 = Router()

routesDmsV1.use('/products', routesDmsV1Products)

routesDmsV1.get('/images/:codigo', async (req, res) => {
  const { codigo } = req.params // id del producto: 0 = todos, int = para un producto

  try {
    const result = await execQueryDms(`SELECT TOP 1
    data = (
      SELECT CAST(imagen AS varbinary(max))
      FOR XML PATH(''), BINARY BASE64
    )
  FROM cot_item WHERE codigo = '${String(codigo).toUpperCase()}'`)

    if (result && result.recordset.length > 0) {
      const { data } = result.recordset[0]
      // const img = Buffer.from(data, 'base64');
      res.contentType('text/html')
      // res.setHeader('Content-Length', img.length);
      res.send(`<img src="data:img/png;base64,${data}">`)
      // res.json( jsonResponseFormat({status: 200, message: 'OK', data}) )
    } else res.json(jsonResponseFormat(400, 'Not Found'))
  } catch (error) {
    console.log(error)
  }
})

export { routesDmsV1 }

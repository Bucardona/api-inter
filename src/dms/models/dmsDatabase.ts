import sql from 'mssql'
import { configDms } from '@/config/config'

interface ConnectionOptions {
  requestTimeout: number | undefined
}
interface ProcedureParams {
  name: string
  value: number | string | boolean
}

const getConnectionDms = async ({
  requestTimeout = undefined
}: ConnectionOptions): Promise<sql.ConnectionPool | null> => {
  try {
    const pool = await sql.connect({
      server: configDms.SERVER,
      database: configDms.DATABASE,
      user: configDms.USER,
      password: configDms.PASSWORD,
      options: {
        encrypt: false,
        trustServerCertificate: true,
        requestTimeout
      }
    })
    return pool
  } catch (error) {
    return null
  }
}

export const execProcedureDms = async (
  procedure: string,
  params: Array<{ name: string, value: number | string | boolean }>
) => {
  try {
    const pool = await getConnectionDms({ requestTimeout: 60000 })
    if (!pool) return
    const request = pool.request()
    params.forEach((param: ProcedureParams) => {
      request.input(param.name, param.value)
    })
    const result = await request.execute(procedure)
    return result
  } catch (error) {
    console.log(error)
    return null
  }
}

export const execQueryDms = async (
  query: string,
  inputs: Array<{ name: string, type: 'number' | 'string' | 'boolean' | 'null', value: number | string | boolean | null }>
) => {
  try {
    const pool = await getConnectionDms({ requestTimeout: 15000 })
    if (!pool) return
    const request = pool.request()
    inputs.forEach((input) => {
      switch (input.type) {
        case 'number':
          if (typeof input.value === 'number') request.input(input.name, sql.Int, input.value)
          break
        case 'string':
          if (typeof input.value === 'string') request.input(input.name, sql.NVarChar, input.value)
          break
        case 'boolean':
          if (typeof input.value === 'boolean') request.input(input.name, sql.Bit, input.value)
          break
        case 'null':
          if (input.value === null) request.input(input.name, sql.NVarChar, null)
          break
        default:
          break
      }
    })
    const result = await request.query(query)
    return result
  } catch (error) {
    console.log(error)
    return null
  }
}

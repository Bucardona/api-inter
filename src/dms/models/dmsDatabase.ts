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
  requestTimeout = undefined,
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
        requestTimeout,
      },
    })
    return pool
  } catch (error) {
    return null
  }
}

export const execProcedureDms = async (
  procedure: string,
  params: Array<{ name: string; value: number | string | boolean }>,
) => {
  try {
    const pool = await getConnectionDms({ requestTimeout: 600000 })
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

export const execQueryDms = async (query: string) => {
  try {
    const pool = await getConnectionDms({ requestTimeout: 600000 })
    if (!pool) return
    const request = pool.request()
    const result = await request.query(query)
    pool.close()
    return result
  } catch (error) {
    console.log(error)
    return null
  }
}

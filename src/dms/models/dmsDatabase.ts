import { config } from "dotenv"
import sql from "mssql"
import { configDms } from "../../config/config"

const getConnectionDms = async () => {
  try {
    const pool = await sql.connect({
      server: configDms.SERVER,
      database: configDms.DATABASE,
      user: configDms.USER,
      password: configDms.PASSWORD,
      options: {
        encrypt: false, 
        trustServerCertificate: true
      }
    })
    return pool
  
  } catch (error) {
    console.log(error)
  }
}

export const execProcedureDms = async (procedure: string, params: { name: string, value: number | string | boolean }[]) => {
  try {
    const pool = await getConnectionDms()
    if (!pool) return
    const request = pool.request()
    params.forEach((param: any) => {
      request.input(param.name, param.value)
    })
    const result = await request.execute(procedure)
    return result
  } catch (error) {
    console.log(error)
  }
}
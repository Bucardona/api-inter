import { config } from 'dotenv'
config()

interface ConfigServer {
  PORT: number
  HOST: string
  /* jwt: {
    secret: string;
    expiresIn: string;
  }; */
}

interface ConfigDms {
  SERVER: string
  DATABASE: string
  USER: string
  PASSWORD: string
}

export const configServer: ConfigServer = {
  PORT: parseInt(process.env.PORT ?? '4000'),
  HOST: process.env.HOST ?? 'localhost'
  /* jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  }, */
}

export const configDms: ConfigDms = {
  SERVER: process.env.INTER_DMS_SERVER ?? 'localhost',
  DATABASE: process.env.INTER_DMS_DATABASE ?? 'local',
  USER: process.env.INTER_DMS_USER ?? 'root',
  PASSWORD: process.env.INTER_DMS_PASSWORD ?? ''
}

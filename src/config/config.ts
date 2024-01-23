import { config } from 'dotenv'
config()

interface ConfigServer {
  PORT: number
  HOST: string
  /* database: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  };
  jwt: {
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
  HOST: process.env.HOST ?? 'localhost',
  /* database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  }, */
}

export const configDms: ConfigDms = {
  SERVER: process.env.DMS_SERVER ?? 'localhost',
  DATABASE: process.env.DMS_DATABASE ?? 'local',
  USER: process.env.DMS_USER ?? 'root',
  PASSWORD: process.env.DMS_PASSWORD ?? '',
}

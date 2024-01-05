import { config } from 'dotenv';
config();

type configServer = {
  PORT: number;
  /*database: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };*/
};

export const configServer:configServer = {
    PORT: parseInt(process.env.PORT || '4000'),
    /*database: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
    },*/
}

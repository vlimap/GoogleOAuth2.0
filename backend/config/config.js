require('dotenv').config();

const baseConfig = {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false,
};

module.exports = {
  development: {
    ...baseConfig,
  },
  test: {
    ...baseConfig,
    database: process.env.DB_NAME_TEST || process.env.DB_NAME,
  },
  production: {
    ...baseConfig,
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? { require: true, rejectUnauthorized: false } : false,
    },
  },
};

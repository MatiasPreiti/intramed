export const initSql = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  account VARCHAR(20) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user'
);
CREATE TABLE IF NOT EXISTS movies (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) UNIQUE NOT NULL,
  director VARCHAR(255),
  release_date VARCHAR(50),
  description TEXT,
  properties JSON
);
`;

import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  jwt_secret_key: String(process.env.JWT_ACCESS_KEY),
  jwt_secretRe_key: String(process.env.JWT_REFRESH_KEY),
};

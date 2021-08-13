import client from '../database';
import bcrypt from 'bcrypt';

export interface User {
  user_name: string;
  user_type?: string;
  password: string;
}

const pepper = 'WHmEqa';
const saltRounds = '10';

export class UserStore {
  async authenticate(userLogin: User): Promise<User | null> {
    try {
      const connection = await client.connect();
      const query = 'SELECT * FROM users WHERE user_name=($1)';

      const result = await connection.query(query, [userLogin.user_name]);
      connection.release();

      const user = result.rows[0];

      if (user && bcrypt.compareSync(userLogin.password + pepper, user.password)) {
        return user;
      }

      return null;
    } catch (err) {
      throw new Error(`Sorry we had an issue logging in, error: ${err}`);
    }
  }

  async create(user: User): Promise<User> {
    try {
      const connection = await client.connect();
      const query =
        'INSERT INTO users (user_name, user_type, password) VALUES($1, $2, $3) RETURNING id, user_name, user_type';

      const hash = bcrypt.hashSync(user.password + pepper, parseInt(saltRounds));

      const result = await connection.query(query, [
        user.user_name,
        user.user_type,
        hash
      ]);
      connection.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Sorry we had an issue adding the user, error: ${err}`);
    }
  }
}

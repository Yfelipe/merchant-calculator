import client from '../database';
import fs from 'fs';
import readline from 'readline';
import format from 'pg-format';

export interface IndustryValues {
  industry: string;
  transaction_volume: number;
  transaction_count: number;
  price?: number;
}

export interface IndustryReturnValues {
  exact_type_price?: Array<number>;
  previous_type_price?: Array<number>;
  next_type_price?: Array<number>;
  price?: number;
}

export class MerchantCostStore {
  async addFile(): Promise<string> {
    let merchantCostArray: [string, string, number | null, number][] = [];

    const data = fs.readFileSync('/backend/uploads/merchant_cost.csv');

    const lineArray = data.toString().replace(/\r\n/g, '\n').split('\n');

    lineArray.map((line) => {
      if (line.length > 0) {
        const rowArray = line.split(',').map((item) => item.replace(' ', ''));

        //Set value to const to make it easier to understand the order
        const industry = rowArray[0];
        const type = rowArray[1];
        const value = rowArray[2] === '' ? null : (rowArray[2] as unknown as number);
        const price = rowArray[3] as unknown as number;

        merchantCostArray.push([industry, type, value, price]);
      }
    });

    //Open connection, clean table then add new lines
    const connection = await client.connect();

    //Check if our array has data before removing previous data and inserting new
    if (merchantCostArray.length > 0) {
      await connection.query('DELETE FROM merchant_cost').then(async () => {
        merchantCostArray.shift();

        const insertQuery = format(
          'INSERT INTO merchant_cost(industry, type, value, price) VALUES %L',
          merchantCostArray
        );

        await connection.query(insertQuery);
      });

      connection.release();

      return 'The file has been loaded successfully.';
    } else {
      //Throw an error if the file read comes back empty after processing
      throw new Error('Sorry we had an issues processing your file, please try again.');
    }
  }

  async getIndustryTypeValue(
    industry: string,
    type: string,
    value: number | null = null
  ): Promise<IndustryReturnValues> {
    try {
      const connection = await client.connect();

      let query: string = '';
      let params: Array<string | number> = [];

      //If value is provided also search with value field
      if (value) {
        //I use 3 sub queries to get exact_type_price or null, previous_type_price or null and next_type_price or null
        query =
          'SELECT (SELECT ARRAY[value, price] FROM merchant_cost s1 WHERE s1.value = ($3) AND industry LIKE ($1) AND type = ($2) LIMIT 1) AS exact_type_price,(SELECT  ARRAY[value, price] FROM merchant_cost s2 WHERE s2.value < ($3) AND industry LIKE ($1) AND type = ($2) ORDER BY value DESC LIMIT 1) AS previous_type_price, (SELECT ARRAY[value, price] FROM merchant_cost s3 WHERE s3.value > ($3) AND industry LIKE ($1) AND type = ($2) ORDER BY value ASC LIMIT 1) AS next_type_price FROM merchant_cost s WHERE industry LIKE ($1) AND type = ($2) LIMIT 1';
        params = [`%${industry}%`, type, value];
      } else {
        query =
          'SELECT price::float FROM merchant_cost WHERE industry LIKE ($1) AND type = ($2)';
        params = [`%${industry}%`, type];
      }

      const result = await connection.query(query, params);
      connection.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Sorry we had an issue getting industry data, error: ${err}`);
    }
  }

  async getIndustryNames(): Promise<Array<string>> {
    try {
      const connection = await client.connect();

      const query = 'SELECT DISTINCT industry FROM merchant_cost';

      const result = await connection.query(query);
      connection.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Sorry we had an issue getting industry names, error: ${err}`);
    }
  }
}

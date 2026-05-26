import { Client } from 'cassandra-driver';

let client: Client | null = null;

export const createConnection = async () => {
  if (!client) {
    client = new Client({
      contactPoints: [process.env.DATABASE_HOST || 'localhost'],
      localDataCenter: 'datacenter1', // default in Cassandra docker
      keyspace: process.env.DATABASE_KEYSPACE || 'myschool',
      credentials: { username: process.env.DATABASE_USERNAME || 'cassandra', password: process.env.DATABASE_PASSWORD || 'cassandra' }
    });
    await client.connect();
  }
  return client;
};

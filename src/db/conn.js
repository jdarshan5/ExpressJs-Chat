import { MongoClient } from 'mongodb';

const URI = process.env.MONGO_URI;

const client = new MongoClient(URI);

console.log('Connecting to mongo...');
let conn;
try {
    conn = await client.connect();
} catch(e) {
    console.error(e);
    process.exit();
}
console.log('Connection Successful with MongoDB...');

let db = conn.db('todo');

export default db;
import PouchDB from 'pouchdb';
import leveldb from 'pouchdb-adapter-leveldb';
import path from 'path';

export default class PouchdbExample {
  public static async example() {
    PouchDB.plugin(leveldb);

    const dbPath = path.join('./db', 'mydatabase');

    const db = new PouchDB(dbPath, { adapter: 'leveldb' });

    interface Item {
      _id?: string;
      name: string;
      price: number;
      _rev?: string;
    }

    async function createItem(item: Item) {
      try {
        const response = await db.put({
          _id: new Date().toISOString(),
          ...item,
        });
        console.log('Document created successfully', response);
      } catch (err) {
        console.error('Error creating document', err);
      }
    }

    createItem({ name: 'Test Item', price: 100 });
  }
}

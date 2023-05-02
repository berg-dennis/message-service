import jsonfile from 'jsonfile';

import { IUser } from '@src/models/User';
import { IMessage } from '@src/models/Message';

const DB_FILE_NAME = 'database.json';

interface IDb {
  users: IUser[];
  messages: IMessage[];
}

function openDb(): Promise<IDb> {
  return jsonfile.readFile(__dirname + '/' + DB_FILE_NAME) as Promise<IDb>;
}

function saveDb(db: IDb): Promise<void> {
  return jsonfile.writeFile(__dirname + '/' + DB_FILE_NAME, db);
}

export default {
  openDb,
  saveDb,
} as const;

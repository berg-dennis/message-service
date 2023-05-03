import orm from './MockOrm';
import { IMessage } from '@src/models/Message';

async function getAll(): Promise<IMessage[]> {
  const db = await orm.openDb();
  return db.messages;
}

async function add(message: IMessage): Promise<void> {
  const db = await orm.openDb();
  db.messages.push(message);
  return orm.saveDb(db);
}

async function delete_(id: string): Promise<void> {
  const db = await orm.openDb();
  for (let i = 0; i < db.messages.length; i++) {
    if (db.messages[i].id === id) {
      db.messages.splice(i, 1);
      return orm.saveDb(db);
    }
  }
}

async function fetchNewMessages(email: string): Promise<IMessage[]> {
  const db = await orm.openDb();
  const newMessages: IMessage[] = [];
  for (let i = 0; i < db.messages.length; i++) {
    if (db.messages[i].recipient.email === email && !db.messages[i].seen) {
      newMessages.push(db.messages[i]);
      db.messages[i].seen = true;
      orm.saveDb(db);
    }
  }
  return newMessages;
}

async function fetchOrderedPaginatedMessages(
  email: string,
  startIndex: number,
  pageSize: number,
): Promise<IMessage[]> {
  const db = await orm.openDb();
  const messagesToSort: IMessage[] = [];
  for (const message of db.messages) {
    if (message.recipient.email === email) {
      messagesToSort.push(message);
    }
  }
  const sortedAndPaginatedMessages = sortAndPaginateArray(
    messagesToSort,
    startIndex,
    pageSize,
  );
  return sortedAndPaginatedMessages;
}
function sortAndPaginateArray(
  arr: IMessage[],
  startIndex: number,
  limit: number,
): IMessage[] {
  const sortedArr = arr.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
  return sortedArr.slice(startIndex, startIndex + limit);
}

async function persists(id: string): Promise<boolean> {
  const db = await orm.openDb();
  for (const message of db.messages) {
    if (message.id === id) {
      return true;
    }
  }
  return false;
}

export default {
  getAll,
  add,
  delete: delete_,
  persists,
  fetchNewMessages,
  fetchOrderedPaginatedMessages,
} as const;

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
  for (const message of db.messages) {
    if (message.recipient.email === email && !message.seen) {
      message.seen = true;
      newMessages.push(message);
    }
  }
  return newMessages;
}

async function fetchMessageByPage(
  email: string,
  pageSize: number,
  page: number
): Promise<IMessage[]> {
  const db = await orm.openDb();
  const messagesToSort: IMessage[] = [];
  for (const message of db.messages) {
    if (message.recipient.email === email) {
      messagesToSort.push(message);
    }
  }
  const sortedMessages = messagesToSort.sort((a, b) => {
    return b.timestamp.getTime() - a.timestamp.getTime();
  });
  const start = pageSize * page;
  const end = pageSize * (page + 1);
  return sortedMessages.slice(start, end);
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
  fetchMessageByPage,
} as const;

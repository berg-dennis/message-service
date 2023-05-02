import { IUser } from '@src/models/User';
import orm from './MockOrm';

async function persists(id: string): Promise<boolean> {
  const db = await orm.openDb();
  for (const user of db.users) {
    if (user.id == id || user.email === id) {
      return true;
    }
  }
  return false;
}

async function getByEmailIdentifier(email: string): Promise<IUser | undefined> {
  const db = await orm.openDb();
  for (const user of db.users) {
    if (user.email === email) {
      return user;
    }
  }
  return undefined;
}

async function getAll(): Promise<IUser[]> {
  const db = await orm.openDb();
  return db.users;
}

async function add(user: IUser): Promise<void> {
  const db = await orm.openDb();
  db.users.push(user);
  return orm.saveDb(db);
}

async function delete_(id: string): Promise<void> {
  const db = await orm.openDb();
  for (let i = 0; i < db.users.length; i++) {
    if (db.users[i].id == id || db.users[i].email === id) {
      db.users.splice(i, 1);
      return orm.saveDb(db);
    }
  }
}

export default {
  persists,
  getAll,
  add,
  delete: delete_,
  getByEmailIdentifier,
} as const;

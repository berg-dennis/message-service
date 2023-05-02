export interface IUser {
  id: string;
  name: string;
  email: string;
}

function new_(name?: string, email?: string, id?: string): IUser {
  return {
    id: id ?? '',
    name: name ?? '',
    email: email ?? '',
  };
}

function isUser(arg: unknown | Omit<IUser, 'id'>): boolean {
  return !!arg && typeof arg === 'object' && 'email' in arg && 'name' in arg;
}

// **** Export default **** //

export default {
  new: new_,
  isUser,
} as const;

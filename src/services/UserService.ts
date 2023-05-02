import UserRepo from '@src/repos/UserRepo';
import { IUser } from '@src/models/User';
import { RouteError } from '@src/other/classes';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { getRandomUUID } from '@src/util/misc';

export const USER_NOT_FOUND_ERR = 'User not found';

function getAll(): Promise<IUser[]> {
  return UserRepo.getAll();
}

async function addOne(user: Omit<IUser, 'id'>): Promise<void> {
  const userExists = await UserRepo.persists(user.email);
  if (userExists) {
    throw new RouteError(
      HttpStatusCodes.CONFLICT,
      `User with email ${user.email} already exists`
    );
  }
  const newUser: IUser = {
    ...user,
    id: getRandomUUID(),
  };
  return UserRepo.add(newUser);
}
async function _delete(id: string): Promise<void> {
  const persists = await UserRepo.persists(id);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);
  }
  return UserRepo.delete(id);
}

export default {
  getAll,
  addOne,
  delete: _delete,
} as const;

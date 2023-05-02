import HttpStatusCodes from '@src/constants/HttpStatusCodes';

import UserService from '@src/services/UserService';
import { IUser } from '@src/models/User';
import { IReq, IUserRes as IRes } from './types/express/misc';

async function getAll(_: IReq, res: IRes) {
  const users = await UserService.getAll();
  return res.status(HttpStatusCodes.OK).json({ users });
}

async function add(req: IReq<IUser>, res: IRes) {
  await UserService.addOne(req.body);
  return res.status(HttpStatusCodes.CREATED).end();
}

async function delete_(req: IReq, res: IRes) {
  const id = req.params.id;
  await UserService.delete(id);
  return res.status(HttpStatusCodes.OK).end();
}

export default {
  getAll,
  add,
  delete: delete_,
} as const;

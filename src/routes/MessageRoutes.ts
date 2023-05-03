import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import MessageService from '@src/services/MessageService';
import { IReq, IMessageRes as IRes } from './types/express/misc';
import { IMessageReq } from '@src/models/Message';

async function getAll(_: IReq, res: IRes) {
  const messages = await MessageService.getAll();
  return res.status(HttpStatusCodes.OK).json({ messages });
}

// Submit a message
async function add(req: IReq<IMessageReq>, res: IRes) {
  await MessageService.submitMessage(req.body);
  return res.status(HttpStatusCodes.CREATED).end();
}

async function fetchOrderedPaginatedMessages(
  req: IReq<{ email: string; startIndex: number; pageSize: number }>,
  res: IRes
) {
  const messages = await MessageService.fetchOrderedPaginatedMessages(
    req.body.email,
    req.body.startIndex,
    req.body.pageSize
  );
  return res.status(HttpStatusCodes.OK).json({ messages });
}

async function fetchNewMessages(req: IReq<{ email: string }>, res: IRes) {
  const messages = await MessageService.fetchNewMessages(req.body.email);
  return res.status(HttpStatusCodes.OK).json({ messages });
}

// Delete one or more messages
async function deleteMessages(
  req: IReq<{ ids: string[] | string }>,
  res: IRes
) {
  await MessageService.deleteMessages(req.body.ids);
  return res.status(HttpStatusCodes.OK).end();
}
export default {
  getAll,
  add,
  fetchNewMessages,
  fetchOrderedPaginatedMessages,
  deleteMessages,
} as const;

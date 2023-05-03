import MessageRepo from '@src/repos/MessageRepo';
import { IMessage, IMessageReq } from '@src/models/Message';
import { RouteError } from '@src/other/classes';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { getRandomUUID } from '@src/util/misc';
import UserRepo from '@src/repos/UserRepo';

async function getAll(): Promise<IMessage[]> {
  const messages = await MessageRepo.getAll();
  return messages;
}

export const submitMessage = async (messageReq: IMessageReq): Promise<void> => {
  if (messageReq.sender === messageReq.recipient) {
    throw new RouteError(
      HttpStatusCodes.BAD_REQUEST,
      'Sender and receiver cannot be the same',
    );
  }
  const senderUser = await UserRepo.getByEmailIdentifier(messageReq.sender);
  const receiverUser = await UserRepo.getByEmailIdentifier(
    messageReq.recipient,
  );
  if (!senderUser || !receiverUser) {
    throw new RouteError(
      HttpStatusCodes.BAD_REQUEST,
      'Sender or receiver does not exist',
    );
  }
  const message: IMessage = {
    id: getRandomUUID(),
    timestamp: new Date(),
    seen: false,
    sender: senderUser,
    recipient: receiverUser,
    content: messageReq.content,
  };
  return MessageRepo.add(message);
};

async function fetchNewMessages(email: string): Promise<IMessage[]> {
  const userExists = await UserRepo.getByEmailIdentifier(email);
  if (!userExists) {
    throw new RouteError(
      HttpStatusCodes.BAD_REQUEST,
      `User with email ${email} does not exist`,
    );
  }
  const newMessages = await MessageRepo.fetchNewMessages(email);
  if (newMessages.length === 0) {
    throw new RouteError(
      HttpStatusCodes.NOT_FOUND,
      `No new messages for user with email ${email}`,
    );
  }
  return newMessages;
}

function fetchOrderedPaginatedMessages(
  email: string,
  startIndex: number,
  size: number,
): Promise<IMessage[]> {
  const userExists = UserRepo.getByEmailIdentifier(email);
  if (!userExists) {
    throw new RouteError(
      HttpStatusCodes.BAD_REQUEST,
      `User with email ${email} does not exist`,
    );
  }
  return MessageRepo.fetchOrderedPaginatedMessages(email, startIndex, size);
}

async function deleteMessage(id: string): Promise<void> {
  const persists = await MessageRepo.persists(id);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, 'Message not found');
  }
  return MessageRepo.delete(id);
}

async function deleteMessages(ids: string[] | string): Promise<void> {
  if (!ids) {
    throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'No message id provided');
  }
  if (typeof ids === 'string') {
    ids = [ids];
  }
  for (const id of ids) {
    await deleteMessage(id);
  }
}

export default {
  getAll,
  submitMessage,
  deleteMessages,
  fetchNewMessages,
  fetchOrderedPaginatedMessages,
} as const;

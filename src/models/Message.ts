import { randomUUID } from 'crypto';
import { IUser } from './User';

export interface IMessage {
  id: string;
  sender: IUser;
  recipient: IUser;
  content: string;
  timestamp: Date;
  seen: boolean;
}

function new_(sender: IUser, recipient: IUser, content: string): IMessage {
  return {
    id: randomUUID(),
    sender,
    recipient,
    content,
    timestamp: new Date(),
    seen: false,
  };
}

export interface IMessageReq {
  sender: string;
  recipient: string;
  content: string;
}

export default {
  new: new_,
} as const;

import { IMessage } from '@src/models/Message';
import { IUser } from '@src/models/User';
import * as e from 'express';

/*
These interfaces are used to extend the express Request and Response interfaces.
They are used to add custom properties to the Request and Response objects.
And ensure typesafety when using these properties.
*/
export interface IReq<T = void> extends e.Request {
  body: T;
}

export interface IUserRes extends e.Response {
  locals: {
    user?: IUser;
  };
}

export interface IMessageRes extends e.Response {
  locals: {
    message?: IMessage;
  };
}

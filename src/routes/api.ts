import { Router } from 'express';
import jetValidator from 'jet-validator';

import Paths from './constants/Paths';
import UserRoutes from './UserRoutes';
import MessageRoutes from './MessageRoutes';

const apiRouter = Router(),
  validate = jetValidator();

const userRouter = Router();

// Get all users
userRouter.get(Paths.Users.Get, UserRoutes.getAll);

// Add one user
userRouter.post(
  Paths.Users.Add,
  validate(['email', 'string', 'body'], ['name', 'string', 'body']),
  UserRoutes.add,
);

// Delete one user
userRouter.delete(
  Paths.Users.Delete,
  validate(['id', 'string', 'params']),
  UserRoutes.delete,
);

// Add UserRouter
apiRouter.use(Paths.Users.Base, userRouter);

const messageRouter = Router();

messageRouter.get(Paths.Messages.Get, MessageRoutes.getAll);

messageRouter.post(
  Paths.Messages.Add,
  validate(
    ['sender', 'string', 'body'],
    ['recipient', 'string', 'body'],
    ['content', 'string', 'body'],
  ),
  MessageRoutes.add,
);

messageRouter.get(
  Paths.Messages.Latest,
  validate(['email', 'string', 'body']),
  MessageRoutes.fetchNewMessages,
);

messageRouter.get(
  Paths.Messages.FetchOrdered,
  validate(
    ['email', 'string', 'body'],
    ['startIndex', 'number', 'body'],
    ['pageSize', 'number', 'body'],
  ),
  MessageRoutes.fetchOrderedPaginatedMessages,
);

messageRouter.delete(Paths.Messages.Delete, MessageRoutes.deleteMessages);

apiRouter.use(Paths.Messages.Base, messageRouter);

export default apiRouter;

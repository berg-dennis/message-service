import supertest, { SuperTest, Test, Response } from 'supertest';

import app from '@src/server';

import MessageRepo from '@src/repos/MessageRepo';
import { IMessage } from '@src/models/Message';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import FullPaths from '@src/routes/constants/FullPaths';

import { TReqBody } from 'spec/support/types';
import UserRepo from '@src/repos/UserRepo';

const { Get, Add, Delete } = FullPaths.Messages;

const { OK, CREATED, BAD_REQUEST, NOT_FOUND } = HttpStatusCodes;

const dummyUser1 = {
  id: '1',
  name: 'user1',
  email: 'user1@email.se',
};
const dummyUser2 = {
  id: '2',
  name: 'user2',
  email: 'user2@email.se',
};

const dummyMessage1: IMessage = {
  id: '1',
  sender: dummyUser1,
  recipient: dummyUser2,
  content: 'Hello',
  timestamp: new Date('2021-01-01T01:00:00.000Z'),
  seen: false,
};

const dummyMessage2: IMessage = {
  id: '1',
  sender: {
    id: '1',
    name: 'user1',
    email: 'user1@email.se',
  },
  recipient: {
    id: '2',
    name: 'user2',
    email: 'user2@email.se',
  },
  content: 'Hello back',
  timestamp: new Date('2021-01-01T02:00:00.000Z'),
  seen: false,
};

const dummyGetAllMessages = [dummyMessage1, dummyMessage2];

describe('MessageRouter', () => {
  let agent: SuperTest<Test>;

  // Run before all tests
  beforeAll((done) => {
    agent = supertest.agent(app);
    done();
  });

  describe(`"GET:${Get}"`, () => {
    const callApi = () => agent.get(Get);

    // Success
    it(
      'should return a JSON object with all the messages and a status code ' +
        `of "${OK}" if the request was successful.`,
      (done) => {
        // Add spy
        spyOn(MessageRepo, 'getAll').and.resolveTo([...dummyGetAllMessages]);
        // Call API
        callApi().end((_: Error, res: Response) => {
          expect(res.status).toBe(OK);
          expect(res.body.messages.length).toBe(2);
          done();
        });
      }
    );
  });

  // Test add message
  describe(`"POST:${Add}"`, () => {
    const callApi = (reqBody: TReqBody) =>
      agent.post(Add).type('form').send(reqBody);

    // Test add message success
    it(
      `should return a status code of "${CREATED}" if the request was ` +
        'successful.',
      (done) => {
        // Spy
        spyOn(MessageRepo, 'add').and.resolveTo();
        spyOn(UserRepo, 'getByEmailIdentifier').and.resolveTo(dummyUser1);
        // Call api
        callApi({ sender: 'a', recipient: 'b', content: '' }).end(
          (_: Error, res: Response) => {
            expect(res.status).toBe(CREATED);
            expect(res.body.error).toBeUndefined();
            done();
          }
        );
      }
    );

    it(
      `should return a status code of "${BAD_REQUEST}" if the request has ` +
        'same sender as reciever.',
      (done) => {
        // Spy
        spyOn(MessageRepo, 'add').and.resolveTo();
        // Call api
        callApi({
          sender: 'user2@email.se',
          recipient: 'user2@email.se',
          content: 'test',
        }).end((_: Error, res: Response) => {
          expect(res.status).toBe(BAD_REQUEST);
          expect(res.body.error).toBe('Sender and receiver cannot be the same');
          done();
        });
      }
    );
    // Missing param
    it(
      'should return a JSON object with an error message' +
        `and a status code of "${BAD_REQUEST}" if a required ` +
        'param was missing.',
      (done) => {
        // Call api
        callApi({}).end((_: Error, res: Response) => {
          expect(res.status).toBe(BAD_REQUEST);
          expect(res.body.error).toBe(
            'The following parameter was missing or invalid: "sender".'
          );
          done();
        });
      }
    );
  });

  // Test delete message
  describe(`"DELETE:${Delete}"`, () => {
    const callApi = (reqBody: TReqBody) =>
      agent.delete(Delete).type('form').send(reqBody);

    // Success
    it(`should return a status code of "${OK}"
        if the request was successful.`, (done) => {
      // Setup spies
      spyOn(MessageRepo, 'delete').and.resolveTo();
      spyOn(MessageRepo, 'persists').and.resolveTo(true);
      // Call api
      callApi({ ids: '5' }).end((_: Error, res: Response) => {
        expect(res.status).toBe(OK);
        expect(res.body.error).toBeUndefined();
        done();
      });
    });

    it(
      'should return a JSON object with the error message of ' +
        `"${NOT_FOUND}" if the id ` +
        'was not found.',
      (done) => {
        callApi({ ids: '-1' }).end((_: Error, res: Response) => {
          expect(res.status).toBe(NOT_FOUND);
          expect(res.body.error).toBe('Message not found');
          done();
        });
      }
    );
  });
});

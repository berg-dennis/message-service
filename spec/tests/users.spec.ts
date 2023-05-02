import supertest, { SuperTest, Test, Response } from 'supertest';
import insertUrlParams from 'inserturlparams';

import app from '@src/server';

import UserRepo from '@src/repos/UserRepo';
import User from '@src/models/User';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { USER_NOT_FOUND_ERR } from '@src/services/UserService';
import FullPaths from '@src/routes/constants/FullPaths';

import { TReqBody } from 'spec/support/types';

const { Get, Add, Delete } = FullPaths.Users;

const { OK, CREATED, NOT_FOUND, BAD_REQUEST } = HttpStatusCodes;

const DummyGetAllUsers = [
  User.new('Sean Banan', 'seanbanan@123.se', '1'),
  User.new('bamse', 'bamse@123.se', '2'),
  User.new('Gordan Freeman', 'gordan.freeman@gmail.com', '3'),
] as const;

describe('UserRouter', () => {
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
      'should return a JSON object with all the users and a status code ' +
        `of "${OK}" if the request was successful.`,
      (done) => {
        // Add spy
        spyOn(UserRepo, 'getAll').and.resolveTo([...DummyGetAllUsers]);
        // Call API
        callApi().end((_: Error, res: Response) => {
          expect(res.status).toBe(OK);
          for (let i = 0; i < res.body.users.length; i++) {
            const user = res.body.users[i];
            expect(user).toEqual(DummyGetAllUsers[i]);
          }
          done();
        });
      }
    );
  });

  // Test add user
  describe(`"POST:${Add}"`, () => {
    const callApi = (reqBody: TReqBody) =>
      agent.post(Add).type('form').send(reqBody);

    // Test add user success
    it(
      `should return a status code of "${CREATED}" if the request was ` +
        'successful.',
      (done) => {
        // Spy
        spyOn(UserRepo, 'add').and.resolveTo();
        // Call api
        callApi({ name: 'test', email: 'test@test.com' }).end(
          (_: Error, res: Response) => {
            expect(res.status).toBe(CREATED);
            expect(res.body.error).toBeUndefined();
            done();
          }
        );
      }
    );

    // Missing param
    it(
      'should return a JSON object with an error message' +
        `and a status code of "${BAD_REQUEST}" if the user ` +
        'param was missing.',
      (done) => {
        // Call api
        callApi({}).end((_: Error, res: Response) => {
          expect(res.status).toBe(BAD_REQUEST);
          expect(res.body.error).toBe(
            `The following parameter was missing or invalid: ${
              '"email"' || '"name"'
            }.`
          );
          done();
        });
      }
    );
  });

  describe(`"DELETE:${Delete}"`, () => {
    const callApi = (id: string) =>
      agent.delete(insertUrlParams(Delete, { id }));

    // Success
    it(`should return a status code of "${OK}"
      if the request was successful.`, (done) => {
      // Setup spies
      spyOn(UserRepo, 'delete').and.resolveTo();
      spyOn(UserRepo, 'persists').and.resolveTo(true);
      // Call api
      callApi('5').end((_: Error, res: Response) => {
        expect(res.status).toBe(OK);
        expect(res.body.error).toBeUndefined();
        done();
      });
    });

    // User not found
    it(
      'should return a JSON object with the error message of ' +
        `"${USER_NOT_FOUND_ERR}" and a status code of
        "${NOT_FOUND}" if the id ` +
        'was not found.',
      (done) => {
        callApi('-1').end((_: Error, res: Response) => {
          expect(res.status).toBe(NOT_FOUND);
          expect(res.body.error).toBe(USER_NOT_FOUND_ERR);
          done();
        });
      }
    );
  });
});

const auth = require('../../../middleware/auth');
const { User } = require('../../../models/user');
mongoose = require('mongoose');

describe('auth middleware', () => {
    it('should populate req.user with the payload of a valid JWT', () => {
        const mypayload = {
            _id: new mongoose.Types.ObjectId().toHexString(),
            isAdmin: true
        };
        const myuser = new User(mypayload);
        const mytoken = myuser.genrateAuthToken();
        const req = {
            header: jest.fn().mockReturnValue(mytoken)
        };
        const res = {};
        const next = jest.fn();

        auth(req, res, next);

        expect(req.user).toMatchObject(mypayload);
    });
});
// custom middleware authenticating
function authenticate(req, res, next)  {
    console.log('authenticating middleware....');
    next();
};

module.exports = authenticate;
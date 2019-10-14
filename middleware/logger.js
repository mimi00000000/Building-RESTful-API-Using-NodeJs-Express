
// custom middleware logging
function log(req, res, next)  {
    console.log('loggiing middleware....');
    next();
};
module.exports = log;
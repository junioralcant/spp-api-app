const jwt = require('jsonwebtoken');
const { promisify } = require('util'); // para poder usar o async await onde não é retornado uma promise

module.exports = async (req, resp, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return resp.status(401).json({ error: 'Token not provided' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(
      token,
      'sppapplication'
    );
    req.userId = decoded.id;

    return next();
  } catch (error) {
    return resp.status(401).json({ error: 'Token invalid' });
  }
};

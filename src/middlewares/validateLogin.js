const validate = (req, res, next) => {
  const { email, password } = req.body;
  const RANGE_PASSWORD = 6;
  const regex = /\S+@\S+\.\S+/;
  const verify = regex.test(email);
  if (!email) {
    return res.status(400).json({ message: 'O campo "email" é obrigatório' });
  }
  if (!verify) {
    return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
  if (!password) {
    return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  }
  if (password.length < RANGE_PASSWORD) {
    return res.status(400)
      .json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  next();
};

module.exports = {
  validate,
};

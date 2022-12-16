const validateRage = (req, res, next) => {
  const {
    talk: { rate },
  } = req.body;
  if (!rate) {
    return res.status(400).json({ message: 'O campo "rate" é obrigatório' });
  }

  next();
};
module.exports = validateRage;
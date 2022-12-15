const validateWatchedAt = (req, res, next) => {
  const {
    talk: { watchedAt },
  } = req.body;
  const regexOfData = /\d{2}\/\d{2}\/\d{4}/gm;
  if (!watchedAt || watchedAt === '') {
    return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
  }
  if (!regexOfData.test(watchedAt)) {
    return res
      .status(400)
      .json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  next();
};

module.exports = validateWatchedAt;
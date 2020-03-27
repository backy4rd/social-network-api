module.exports = (err, req, res, next) => {
  if (/Sequelize/.test(err.name)) {
    return res.status(400).json({
      status: 'fail',
      data: err.message.split(',\n'),
    });
  }

  if (!err.statusCode) {
    console.log(err.stack);
    return res.status(500).json({
      status: 'error',
      data: 'internal server error',
    });
  }

  res.status(err.statusCode).json({
    status: 'fail',
    data: err.message,
  });
};

/**
 * @param {Object} request http request
 * @param {Array} limitOpt [ defaultLimit, maxLimit ]
 */
module.exports.range = (req, limitOpt) => {
  req.query.limit = req.query.limit < 1 ? 1 : req.query.limit;
  req.query.from = req.query.from < 0 ? 0 : req.query.from;

  const from = req.query.from || 0;
  const limit =
    (req.query.limitOpt || limitOpt[0]) > limitOpt[1]
      ? limitOpt[1]
      : req.query.limit || limitOpt[0];

  return {
    from: parseInt(from, 10),
    limit: parseInt(limit, 10),
  };
};

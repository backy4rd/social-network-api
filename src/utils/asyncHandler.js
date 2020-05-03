module.exports = middleware => {
  return (req, res, next) => {
    Promise.resolve(middleware(req, res, next)).catch(next);
  };
};

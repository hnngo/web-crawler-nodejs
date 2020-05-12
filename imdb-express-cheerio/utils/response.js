const mapFunc = (o, func) => {
  const res = { ...o };
  Object.keys(res).forEach((k) => {
    res[k] = func(res[k]);
  });
  return res;
};

module.exports = {
  mapFunc,
};

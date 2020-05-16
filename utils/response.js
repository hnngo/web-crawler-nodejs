const mapFunc = (o, func) => {
  const res = { ...o };
  Object.keys(res).forEach((k) => {
    res[k] = func(res[k]);
  });
  return res;
};

const createObj = (listOfKeys, listOfValues) => {
  if (
    !Array.isArray(listOfKeys) ||
    !Array.isArray(listOfValues) ||
    listOfKeys.length !== listOfValues.length
  ) {
    return {};
  }

  const res = {};
  listOfKeys.forEach((k, i) => (res[k] = listOfValues[i]));
  return res;
};

module.exports = {
  mapFunc,
  createObj,
};

const trimNewLine = (s) => {
  return s.replace(/\n/g, "");
};

const trimWhiteSpaceHeadAndTail = (s) => {
  return s.trimLeft().trimRight();
};

module.exports = {
  trimNewLine,
  trimWhiteSpaceHeadAndTail,
};

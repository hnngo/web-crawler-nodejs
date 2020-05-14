const trimNewLine = (s) => {
  if (!s) return;
  return s.replace(/\n/g, "");
};

const trimWhiteSpaceHeadAndTail = (s) => {
  if (!s) return;
  return s.trimLeft().trimRight();
};

const trimParenthesis = (s) => {
  if (!s) return;
  return s.replace(/[^0-9\.]+/g, "");
};

module.exports = {
  trimNewLine,
  trimParenthesis,
  trimWhiteSpaceHeadAndTail,
};

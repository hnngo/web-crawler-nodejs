const findClassname = (e, classname) => {
  return !!(
    e &&
    e.attribs &&
    e.attribs.class &&
    e.attribs.class.includes(classname)
  );
};

const findName = (e, name) => {
  return !!(e && e.name === name);
};

const hasChildlength = (e, length) => {
  return !!(e && e.children.length === length);
};

module.exports = {
  findName,
  findClassname,
  hasChildlength,
};

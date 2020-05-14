const findClassname = (e, classname) => {
  return !!(e && e.attribs && e.attribs.class && e.attribs.class.includes(classname));
};

module.exports = {
  findClassname,
};

const dayjs = require('dayjs');

const isDate = (value) => {
  if (!value) {
    return false;
  }

  const fecha = dayjs(value);
  if (fecha.isValid()) {
    return true;
  } else {
    return false;
  }
};

module.exports = {
  isDate,
};

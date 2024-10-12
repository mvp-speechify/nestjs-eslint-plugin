// index.js
module.exports = {
  rules: {
    "no-insufficiently-typed-endpoints": require("./rules/no-insufficiently-typed-endpoints"),
    "no-missing-api-bearer-auth": require("./rules/no-missing-api-bearer-auth"),
  },
};

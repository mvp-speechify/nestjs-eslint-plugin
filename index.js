// index.js
module.exports = {
  rules: {
    "no-insufficiently-typed-endpoints": require("./rules/no-insufficiently-typed-endpoints"),
    "no-missing-api-bearer-auth": require("./rules/no-missing-api-bearer-auth"),
    "enforce-api-route-kebab-case": require("./rules/enforce-api-route-kebab-case"),
    "enforce-controller-api-tags": require("./rules/enforce-controller-api-tags"),
  },
  configs: {
    recommended: {
      rules: {
        "no-insufficiently-typed-endpoints": "error",
        "no-missing-api-bearer-auth": "error",
        "enforce-api-route-kebab-case": "error",
        "enforce-controller-api-tags": "error",
      },
    },
  },
};

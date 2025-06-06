// index.js
module.exports = {
  rules: {
    "no-insufficiently-typed-endpoints": require("./rules/no-insufficiently-typed-endpoints"),
    "no-missing-api-bearer-auth": require("./rules/no-missing-api-bearer-auth"),
    "enforce-api-route-kebab-case": require("./rules/enforce-api-route-kebab-case"),
    "enforce-controller-api-tags": require("./rules/enforce-controller-api-tags"),
    "enforce-route-param-snake-case": require("./rules/enforce-route-param-snake-case"),
    "enforce-dto-snake-case": require("./rules/enforce-dto-snake-case"),
    "prefer-api-property-optional": require("./rules/prefer-api-property-optional"),
    "prevent-mismatching-optional-type": require("./rules/prevent-mismatching-optional-type"),
    "check-exclude-transform": require("./rules/check-exclude-transform"),
  },
  configs: {
    recommended: {
      rules: {
        "speechify-nestjs/no-insufficiently-typed-endpoints": "error",
        "speechify-nestjs/no-missing-api-bearer-auth": "error",
        "speechify-nestjs/enforce-api-route-kebab-case": "error",
        "speechify-nestjs/enforce-controller-api-tags": "error",
        "speechify-nestjs/enforce-route-param-snake-case": "error",
        "speechify-nestjs/enforce-dto-snake-case": "warn",
        "speechify-nestjs/prefer-api-property-optional": "warn",
        "speechify-nestjs/prevent-mismatching-optional-type": "error",
        "speechify-nestjs/check-exclude-transform": "error",
      },
    },
  },
};

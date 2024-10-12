module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce kebab-case for controller paths",
      category: "Stylistic Issues",
      recommended: false,
    },
    messages: {
      kebabCase: "Controller path should be in kebab-case.",
    },
    schema: [], // no options
  },
  create(context) {
    return {
      Decorator(node) {
        if (
          node.callee &&
          node.callee.name === "Controller" &&
          node.arguments.length &&
          typeof node.arguments[0].value === "string"
        ) {
          const path = node.arguments[0].value;
          const kebabCasePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

          if (!kebabCasePattern.test(path)) {
            context.report({
              node: node.arguments[0],
              messageId: "kebabCase",
            });
          }
        }
      },
    };
  },
};

const { is } = require("thiis");

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
      ClassDeclaration(node) {
        const controllerDecorator = node.decorators.find((decorator) => {
          if (decorator.expression.callee.name === "Controller") {
            return decorator;
          }
        });

        if (controllerDecorator) {
          for (const arg of controllerDecorator.expression.arguments) {
            const path = arg.value;
            if (typeof path === "string" && !is.kebabCase(path)) {
              context.report({
                node: controllerDecorator,
                messageId: "kebabCase",
              });
            }
          }
        }
      },
    };
  },
};

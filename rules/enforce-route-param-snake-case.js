const Case = require("case");

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Enforce snake_case for route parameters",
      category: "Best Practices",
      recommended: false,
    },
    schema: [], // no options
  },
  create(context) {
    return {
      MethodDefinition(node) {
        const decorators = node.decorators;
        decorators?.forEach((decorator) => {
          const checkedDecoratorName = [
            "Put",
            "Get",
            "Post",
            "Delete",
            "Patch",
          ];

          const expression = decorator.expression;
          if (
            !expression.callee ||
            !checkedDecoratorName.includes(expression.callee.name)
          ) {
            return;
          }

          const routes = expression.arguments[0];
          if (!routes || routes.type !== "Literal") {
            return;
          }

          const route = routes.value;
          const routeParams = [...route.matchAll(/:([a-zA-Z0-9_]+)/g)];
          if (routeParams.length === 0) {
            return;
          }

          for (const routeParam of routeParams) {
            const paramValue = routeParam[1];
            const isSnakeCase = Case.of(paramValue) === "snake";
            const isLower = Case.of(paramValue) === "lower";
            if (!isSnakeCase && !isLower) {
              context.report({
                node: decorator,
                message: `Route parameters should be in snake_case, i.e. ${Case.snake(paramValue)}`,
              });
            }
          }
        });
      },
    };
  },
};

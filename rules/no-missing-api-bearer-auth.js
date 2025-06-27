module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Ensure HTTP endpoints using AuthGuard or OptionalAuthGuard are annotated with ApiBearerAuth decorator",
      category: "Best Practices",
      recommended: false,
    },
    messages: {
      missingApiBearerAuth:
        "Method using UseGuards with AuthGuard or OptionalAuthGuard must also have the ApiBearerAuth decorator.",
      unnecessaryApiBearerAuth:
        "Method with ApiBearerAuth decorator must use UseGuards with AuthGuard or OptionalAuthGuard.",
    },
    schema: [], // no options
  },
  create(context) {
    return {
      MethodDefinition(node) {
        const decorators = node.decorators;

        if (!decorators) return;

        const useGuardsDecorator = decorators.find(
          (decorator) =>
            decorator.expression.callee &&
            decorator.expression.callee.name === "UseGuards",
        );

        const hasApiBearerAuth = decorators.some(
          (decorator) =>
            decorator.expression.callee &&
            decorator.expression.callee.name === "ApiBearerAuth",
        );

        // Helper function to check if UseGuards arguments contain AuthGuard or OptionalAuthGuard
        const hasAuthGuard = (useGuardsDecorator) => {
          if (!useGuardsDecorator) return false;

          return useGuardsDecorator.expression.arguments.some((arg) => {
            // Handle direct references like AuthGuard, OptionalAuthGuard
            if (arg.type === "Identifier") {
              return (
                arg.name === "AuthGuard" || arg.name === "OptionalAuthGuard"
              );
            }
            // Handle function calls like AuthGuard('jwt')
            if (
              arg.type === "CallExpression" &&
              arg.callee.type === "Identifier"
            ) {
              return (
                arg.callee.name === "AuthGuard" ||
                arg.callee.name === "OptionalAuthGuard"
              );
            }
            return false;
          });
        };

        const hasAuthGuardInUseGuards = hasAuthGuard(useGuardsDecorator);

        // Case 1: UseGuards with AuthGuard/OptionalAuthGuard but missing ApiBearerAuth
        if (
          useGuardsDecorator &&
          hasAuthGuardInUseGuards &&
          !hasApiBearerAuth
        ) {
          context.report({
            node,
            messageId: "missingApiBearerAuth",
          });
        }

        // Case 2: ApiBearerAuth present but no UseGuards with AuthGuard/OptionalAuthGuard
        if (hasApiBearerAuth && !hasAuthGuardInUseGuards) {
          context.report({
            node,
            messageId: "unnecessaryApiBearerAuth",
          });
        }
      },
    };
  },
};

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Ensure every HTTP endpoints that require authentication (even if optional) is annotated with ApiBearerAuth decorator",
      category: "Best Practices",
      recommended: false,
    },
    messages: {
      missingApiBearerAuth:
        "Method using UseGuards must also have the ApiBearerAuth decorator.",
    },
    schema: [], // no options
  },
  create(context) {
    return {
      MethodDefinition(node) {
        const decorators = node.decorators;

        if (!decorators) return;

        const hasUseGuards = decorators.some(
          (decorator) => decorator.expression.callee.name === "UseGuards"
        );
        const hasApiBearerAuth = decorators.some(
          (decorator) => decorator.expression.callee.name === "ApiBearerAuth"
        );

        if (hasUseGuards && !hasApiBearerAuth) {
          context.report({
            node,
            messageId: "missingApiBearerAuth",
          });
        }
      },
    };
  },
};

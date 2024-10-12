module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforce the presence of @ApiTags decorator only if @Controller is used",
      category: "Best Practices",
      recommended: false,
    },
    messages: {
      missingApiTags: "Controller class is missing @ApiTags decorator.",
    },
    schema: [], // no options
  },
  create(context) {
    return {
      ClassDeclaration(node) {
        const hasControllerDecorator = node.decorators.some((decorator) => {
          return (
            decorator.expression.callee &&
            decorator.expression.callee.name === "Controller"
          );
        });

        const hasApiTagsDecorator = node.decorators.some((decorator) => {
          return (
            decorator.expression.callee &&
            decorator.expression.callee.name === "ApiTags"
          );
        });

        // Check if the class has @Controller and is missing @ApiTags
        if (hasControllerDecorator && !hasApiTagsDecorator) {
          context.report({
            node,
            messageId: "missingApiTags",
          });
        }
      },
    };
  },
};

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Require @ApiOperation and @ApiResponse for HTTP method decorators (@Get, @Post, @Put, @Patch, @Delete)",
      category: "Best Practices",
      recommended: true,
    },
    messages: {
      missingApiOperation: "Method is missing the @ApiOperation decorator.",
      missingApiResponse: "Method is missing the @ApiResponse decorator.",
    },
    schema: [], // no options
  },
  create(context) {
    const httpMethodDecorators = ["Get", "Post", "Put", "Patch", "Delete"];

    function checkDecorators(node) {
      const decorators = node.decorators || [];

      const hasHttpMethodDecorator = decorators.some((decorator) => {
        const decoratorName = decorator.expression.callee.name;
        return httpMethodDecorators.includes(decoratorName);
      });

      if (hasHttpMethodDecorator) {
        const hasApiOperation = decorators.some((decorator) => {
          return decorator.expression.callee.name === "ApiOperation";
        });

        const hasApiResponse = decorators.some((decorator) => {
          return decorator.expression.callee.name === "ApiResponse";
        });

        if (!hasApiOperation) {
          context.report({
            node,
            messageId: "missingApiOperation",
          });
        }

        if (!hasApiResponse) {
          context.report({
            node,
            messageId: "missingApiResponse",
          });
        }
      }
    }

    return {
      MethodDefinition(node) {
        checkDecorators(node);
      },
    };
  },
};

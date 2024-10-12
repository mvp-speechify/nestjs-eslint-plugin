module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Ensure every HTTP endpoint is properly annotated for API client generation",
      category: "Best Practices",
      recommended: true,
    },
    messages: {
      missingApiOperation: "Method is missing the @ApiOperation decorator.",
      missingApiResponse: "Method is missing the @ApiResponse decorator.",
      emptySummary: "@ApiOperation must have a non-empty summary.",
      emptyStatus: "@ApiResponse must have a non-empty status key.",
      emptyType: "@ApiResponse must have a non-empty type key.",
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
        const apiOperationDecorator = decorators.find((decorator) => {
          return decorator.expression.callee.name === "ApiOperation";
        });

        const apiResponseDecorator = decorators.find((decorator) => {
          return decorator.expression.callee.name === "ApiResponse";
        });

        if (!apiOperationDecorator) {
          context.report({
            node,
            messageId: "missingApiOperation",
          });
        } else {
          // Check if the summary exists and is non-empty
          const summaryProperty =
            apiOperationDecorator.expression.arguments[0]?.properties.find(
              (prop) => prop.key.name === "summary"
            );

          if (!summaryProperty || summaryProperty.value.value.trim() === "") {
            context.report({
              node: apiOperationDecorator,
              messageId: "emptySummary",
            });
          }
        }

        if (!apiResponseDecorator) {
          context.report({
            node,
            messageId: "missingApiResponse",
          });
        } else {
          // Check if the status exists and is non-empty
          const statusProperty =
            apiResponseDecorator.expression.arguments[0]?.properties.find(
              (prop) => prop.key.name === "status"
            );

          if (
            !statusProperty ||
            typeof statusProperty.value.value !== "number"
          ) {
            context.report({
              node: apiResponseDecorator,
              messageId: "emptyStatus",
            });
          }

          // Check if the type exists and is non-empty
          const typeProperty =
            apiResponseDecorator.expression.arguments[0]?.properties.find(
              (prop) => prop.key.name === "type"
            );

          if (!typeProperty || !typeProperty.value) {
            context.report({
              node: apiResponseDecorator,
              messageId: "emptyType",
            });
          }
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

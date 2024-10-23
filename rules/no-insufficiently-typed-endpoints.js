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
      missingEndpointResponse:
        "Method is missing the @EndpointResponse decorator.",
      emptySummary: "@ApiOperation must have a non-empty summary.",
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

        const endpointResponseDecorator = decorators.find((decorator) => {
          return decorator.expression.callee.name === "EndpointResponse";
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

          if (
            !summaryProperty ||
            (summaryProperty.value.type === "Literal" &&
              summaryProperty.value.value.trim() === "") ||
            (summaryProperty.value.type === "TemplateLiteral" &&
              summaryProperty.value.quasis.length > 0 &&
              summaryProperty.value.quasis[0].value.cooked.trim() === "")
          ) {
            context.report({
              node: apiOperationDecorator,
              messageId: "emptySummary",
            });
          }
        }

        if (!endpointResponseDecorator) {
          context.report({
            node,
            messageId: "missingEndpointResponse",
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

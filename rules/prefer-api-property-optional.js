module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Suggest using @ApiPropertyOptional instead of @ApiProperty({ required: false })",
      category: "Best Practices",
      recommended: false,
    },
    messages: {
      useApiPropertyOptional:
        "Use @ApiPropertyOptional instead of @ApiProperty({ required: false }) for optional properties.",
    },
    schema: [], // no options
  },
  create(context) {
    return {
      "ClassProperty,PropertyDefinition"(node) {
        if (!node.decorators) return;

        node.decorators.forEach((decorator) => {
          const expr = decorator.expression;
          if (
            expr &&
            expr.type === "CallExpression" &&
            expr.callee &&
            expr.callee.type === "Identifier" &&
            expr.callee.name === "ApiProperty" &&
            expr.arguments &&
            expr.arguments.length === 1
          ) {
            const arg = expr.arguments[0];
            if (
              arg &&
              arg.type === "ObjectExpression" &&
              arg.properties.some(
                (prop) =>
                  prop.type === "Property" &&
                  ((prop.key.type === "Identifier" &&
                    prop.key.name === "required") ||
                    (prop.key.type === "Literal" &&
                      prop.key.value === "required")) &&
                  ((prop.value.type === "Literal" &&
                    prop.value.value === false) ||
                    (prop.value.type === "Identifier" &&
                      prop.value.name === "false"))
              )
            ) {
              context.report({
                node: decorator,
                messageId: "useApiPropertyOptional",
              });
            }
          }
        });
      },
    };
  },
};

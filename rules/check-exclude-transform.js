module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow using @ApiProperty or @ApiPropertyOptional on properties decorated with @Exclude.",
      category: "Best Practices",
      recommended: false,
    },
    messages: {
      excludeWithApiProperty:
        "Property '{{propertyName}}' is not exposed but has @ApiProperty or @ApiPropertyOptional, which is not allowed.",
    },
    schema: [], // no options
  },
  create(context) {
    function hasDecorator(decorators, name) {
      return decorators.some((decorator) => {
        const expr = decorator.expression;
        if (!expr) return false;
        if (expr.type === "Identifier") {
          return expr.name === name;
        }
        if (expr.type === "CallExpression") {
          if (
            expr.callee &&
            expr.callee.type === "Identifier" &&
            expr.callee.name === name
          ) {
            return true;
          }
        }
        return false;
      });
    }

    return {
      "ClassProperty,PropertyDefinition"(node) {
        if (!node.decorators) return;

        const decorators = node.decorators;

        const hasExclude = hasDecorator(decorators, "Exclude");
        const hasApiProperty = hasDecorator(decorators, "ApiProperty");
        const hasApiPropertyOptional = hasDecorator(
          decorators,
          "ApiPropertyOptional"
        );

        if (hasExclude && (hasApiProperty || hasApiPropertyOptional)) {
          context.report({
            node: node,
            messageId: "excludeWithApiProperty",
            data: {
              propertyName:
                node.key && node.key.name ? node.key.name : "<unknown>",
            },
          });
        }
      },
    };
  },
};

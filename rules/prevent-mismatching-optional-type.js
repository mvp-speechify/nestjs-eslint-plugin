module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Detects properties with @ApiPropertyOptional or @ApiProperty({required: false}) but missing @IsOptional decorator, and vice versa.",
      category: "Best Practices",
      recommended: false,
    },
    messages: {
      missingIsOptional:
        "Property '{{propertyName}}' uses @ApiPropertyOptional or @ApiProperty({ required: false }) but is missing @IsOptional decorator.",
      missingApiPropertyOptional:
        "Property '{{propertyName}}' uses @IsOptional but is missing @ApiPropertyOptional or @ApiProperty({ required: false }).",
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

    function hasApiPropertyOptional(decorators) {
      return hasDecorator(decorators, "ApiPropertyOptional");
    }

    function hasApiPropertyRequiredFalse(decorators) {
      return decorators.some((decorator) => {
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

        // If property has @ApiHideProperty, skip all checks
        if (hasDecorator(decorators, "ApiHideProperty")) {
          return;
        }

        const isApiPropertyOptional = hasApiPropertyOptional(decorators);
        const isApiPropertyRequiredFalse =
          hasApiPropertyRequiredFalse(decorators);
        const hasIsOptional = hasDecorator(decorators, "IsOptional");

        // Case 1: Has ApiPropertyOptional or ApiProperty({required: false}) but missing IsOptional
        if (
          (isApiPropertyOptional || isApiPropertyRequiredFalse) &&
          !hasIsOptional
        ) {
          context.report({
            node: node,
            messageId: "missingIsOptional",
            data: {
              propertyName:
                node.key && node.key.name ? node.key.name : "<unknown>",
            },
          });
        }

        // Case 2: Has IsOptional but missing ApiPropertyOptional and ApiProperty({required: false})
        if (
          hasIsOptional &&
          !isApiPropertyOptional &&
          !isApiPropertyRequiredFalse
        ) {
          context.report({
            node: node,
            messageId: "missingApiPropertyOptional",
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

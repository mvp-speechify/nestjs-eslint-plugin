const Case = require("case");

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforce that properties of classes ending with 'Dto' or 'DTO' are in snake_case",
      category: "Best Practices",
      recommended: false,
    },
    messages: {
      notSnakeCase:
        "Property '{{name}}' in DTO class '{{className}}' should be in snake_case.",
    },
    schema: [], // no options
  },
  create(context) {
    function isSnakeCase(name) {
      const caseName = Case.of(name);
      return caseName === "snake" || caseName === "lower";
    }

    return {
      ClassDeclaration(node) {
        if (
          node.id &&
          typeof node.id.name === "string" &&
          /Dto$|DTO$/.test(node.id.name)
        ) {
          // Only check class properties (TypeScript: ClassProperty, ESTree: PropertyDefinition)
          const properties = node.body.body.filter(
            (member) =>
              (member.type === "ClassProperty" ||
                member.type === "PropertyDefinition") &&
              member.key &&
              member.key.type === "Identifier"
          );

          for (const prop of properties) {
            const propName = prop.key.name;
            if (!isSnakeCase(propName)) {
              context.report({
                node: prop.key,
                messageId: "notSnakeCase",
                data: {
                  name: propName,
                  className: node.id.name,
                },
              });
            }
          }
        }
      },
    };
  },
};

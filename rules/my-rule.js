module.exports = {
  meta: {
    type: "suggestion", // type of rule (problem, suggestion, layout)
    docs: {
      description: "Disallow console.log statements",
      category: "Best Practices",
      recommended: true,
    },
    fixable: "code", // can the rule be auto-fixed?
    schema: [], // options the rule can accept
  },
  create: function (context) {
    return {
      CallExpression(node) {
        if (
          node.callee.object &&
          node.callee.object.name === "console" &&
          node.callee.property.name === "log"
        ) {
          context.report({
            node,
            message: "Unexpected console.log statement.",
            fix: function (fixer) {
              return fixer.remove(node);
            },
          });
        }
      },
    };
  },
};

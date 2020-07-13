module.exports = function ({ types: t }) {
  return {
    visitor: {
      JSXElement(path) {
        const { node } = path;
        const xForAttr = node.openingElement.attributes.find((item) => {
          return item.type === "JSXAttribute" && item.name.name === "x-for";
        });
        if (!xForAttr) return;
        const xForExpression = xForAttr.value;
        const judgeArrayMemberExpression = t.MemberExpression(
          t.identifier("Array"),
          t.identifier("isArray")
        );
        const judgeArrayCallExpression = t.callExpression(
          judgeArrayMemberExpression,
          [t.identifier(xForExpression.expression.right.name)]
        );
        const xForArrMethodMemberExpression = t.MemberExpression(
          t.identifier(xForExpression.expression.right.name),
          t.identifier("map")
        );
        const xForOpenElement = t.jSXOpeningElement(
          node.openingElement.name,
          node.openingElement.attributes.filter((item) => {
            return item.name.name !== "x-for";
          })
        );
        const xForElement = t.JSXElement(
          xForOpenElement,
          node.closingElement,
          node.children,
          false
        );
        const xForReturnStatement = t.ReturnStatement(xForElement);
        // {}
        const xForInBlockStatement = t.BlockStatement([xForReturnStatement]);
        // item => {
        //   return <li key={item}>{item}</li>;
        // }
        // 要兼容（item）=> 和 （item, index）=> 两种情况
        const xForArrowFunctionExpression = t.arrowFunctionExpression(
          xForExpression.expression.left.type === "SequenceExpression"
            ? xForExpression.expression.left.expressions
            : [t.Identifier(xForExpression.expression.left.name)],
          xForInBlockStatement
        );
        // arr.map(item => {
        //   return <li key={item}>{item}</li>;
        // })
        const xForCallExpression = t.callExpression(
          xForArrMethodMemberExpression,
          [xForArrowFunctionExpression]
        );
        // Array.isArray(arr)
        const xForLogicalExpression = t.LogicalExpression(
          "&&",
          judgeArrayCallExpression,
          xForCallExpression
        );
        // Array.isArray(arr) && arr.map((item, index) => {
        //   return <li key={index}>{item.label}</li>;
        // });
        const xForExpressionStatement = t.ExpressionStatement(
          xForLogicalExpression
        );
        // {
        //   Array.isArray(arr) && arr.map((item, index) => {
        //     return <li key={index}>{item.label}</li>;
        //   });
        // }
        const xForOutBlockStatement = t.blockStatement([
          xForExpressionStatement,
        ]);
        path.replaceWith(xForOutBlockStatement);
      },
    },
  };
};

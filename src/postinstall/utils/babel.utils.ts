import * as recast from "recast";

import traverse from "@babel/traverse";
import * as t from "@babel/types";

export const stringToNode = (code: TemplateStringsArray) => {
  const result = recast.parse(code.join(""));
  return result.program.body;
};

export const addImports = (ast: t.File, statements: t.Statement[]) => {
  let inserted = false;

  traverse(ast, {
    Statement: (path) => {
      if (inserted) return;

      if (!path.isImportDeclaration()) {
        path.insertBefore(statements);
        inserted = true;
      }
    },
  });
};

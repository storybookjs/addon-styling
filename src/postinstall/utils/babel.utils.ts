import { babelParse } from "@storybook/csf-tools";

import traverse from "@babel/traverse";
import * as t from "@babel/types";

export const AddCommentBeforeBabelNode = (
  comment: string,
  node: any,
  line: boolean = false
) => {
  t.addComment(node, "leading", comment, line);
};

export const parseStringToBabelNode = (code: string) =>
  babelParse(code).program.body[0];

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

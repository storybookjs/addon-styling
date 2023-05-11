import path from "path";
import { expect } from "vitest";

const pathToRemove = path.resolve(__dirname, "../");

const redactProjectPathInUse = {
  serialize(val, config, indentation, depth, refs, printer) {
    const valAsString = JSON.stringify(val, null, 2);

    const sanitizedVal = valAsString.replaceAll(
      pathToRemove,
      "path/to/project"
    );

    return printer(JSON.parse(sanitizedVal), config, indentation, depth, refs);
  },
  test(val) {
    return (
      Array.isArray(val) && JSON.stringify(val, null, 2).includes(pathToRemove)
    );
  },
};

expect.addSnapshotSerializer(redactProjectPathInUse);

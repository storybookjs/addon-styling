import { spawn } from "child_process";

const automigrate = async () => {
  await spawn("pnpm", ["dlx", "@storybook/auto-config", "styling"], {
    stdio: "inherit",
    cwd: process.cwd(),
  });
};

export default automigrate;

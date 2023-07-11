const fs = require("node:fs");
const path = require("node:path");
const core = require("@actions/core");
const { exec } = require("@actions/exec");

const ARTILLERY_BINARY_PATH = "/home/node/artillery/bin/run";

function getInputs() {
  const test = core.getInput("test");
  const target = core.getInput("target");
  const environment = core.getInput("environment");
  const output = core.getInput("output");
  const config = core.getInput("config");

  return {
    test,
    target,
    environment,
    output,
    config,
  };
}

function inputsToFlags(inputs) {
  const flags = [];

  for (const optionName in inputs) {
    const optionValue = inputs[optionName];

    if (optionValue) {
      flags.push(`--${optionName}=${optionValue}`);
    }
  }

  return flags;
}

async function main() {
  core.debug(`running Artillery binary at "${ARTILLERY_BINARY_PATH}"...`);
  const { test, ...options } = getInputs();
  const flags = inputsToFlags(options);

  core.debug(`cli flags: ${JSON.stringify(flags, null, 2)}`);

  if (!fs.existsSync(ARTILLERY_BINARY_PATH)) {
    core.setFailed(
      `\
Failed to locate Artillery binary at "${ARTILLERY_BINARY_PATH}". Did you forget to use the Artillery Docker container?

Please make sure this job is using the following container:

  container: artilleryio/artillery:latest`
    );

    return;
  }

  // Run the tests.
  await exec(ARTILLERY_BINARY_PATH, ["run", test, ...flags], {
    stdio: "inherit",
  }).catch((error) => {
    core.setFailed(error.message);
  });

  // Set the generated report JSON as the action's output.
  const reportPath = path.resolve(process.cwd(), options.output);
  core.setOutput("report", reportPath);
}

main();

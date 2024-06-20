#!/bin/sh

# Respect custom "working-directory" input.
if [ -n "${CWD}" ]; then
  cd "${CWD}"
fi

if [ -n "${ARTILLERY_BINARY_PATH}" ]; then
  if [ ! -f "${ARTILLERY_BINARY_PATH}" ]; then
    echo "Failed to locate Artillery binary at custom path: ${ARTILLERY_BINARY_PATH}"
    exit 1
  fi

  ARTILLERY_BINARY="${ARTILLERY_BINARY_PATH}"
else
  ARTILLERY_BINARY="/usr/bin/artillery"
fi

# Run the tests.
$ARTILLERY_BINARY $1

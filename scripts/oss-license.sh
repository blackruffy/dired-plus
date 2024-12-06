#!/bin/bash

npm list --omit=dev --json | npx license-checker --json | jq -r 'to_entries[] | "- " + .key + ": " + .value.licenses + " License"'

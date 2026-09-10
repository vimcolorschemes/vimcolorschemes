#!/bin/sh

# vercel ignored build step.
# exit 1 = build, exit 0 = skip.
# set the vercel dashboard command to: bash scripts/vercel-ignore-build.sh

if [ "$VERCEL_ENV" = "production" ]; then exit 1; fi

if [ -n "$VERCEL_GIT_PULL_REQUEST_ID" ]; then
  if [ "$VERCEL_GIT_COMMIT_AUTHOR_LOGIN" = "reobin" ]; then exit 1; fi
  if [ "$VERCEL_GIT_COMMIT_AUTHOR_LOGIN" = "dependabot[bot]" ]; then exit 1; fi
  case "$VERCEL_GIT_COMMIT_REF" in dependabot/*) exit 1 ;; esac
  exit 0
fi

exit 0

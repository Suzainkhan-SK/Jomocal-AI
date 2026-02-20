#!/bin/bash
# Script to resolve git rebase conflict

# Stage the resolved package.json
git add package.json

# Continue the rebase
git rebase --continue

echo "Rebase completed successfully!"

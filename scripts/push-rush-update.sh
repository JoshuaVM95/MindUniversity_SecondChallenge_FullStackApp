#!/bin/sh

rush update
git config user.email "dependabot[bot]@users.noreply.github.com"
git config user.name "dependabot[bot]"
git add .
git commit -m "dependencies(dependabot): update shrinkwrap file"
git push "https://JoshuaVM95:$GH_TOKEN@github.com/JoshuaVM95/MindUniversity_SecondChallenge_FullStackApp.git" HEAD:"$GITHUB_HEAD_REF" --verbose
set -e
set -o pipefail

remote_repo="https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"

git config --global user.email "gh_page@law4tina.com"
git config --global user.name "github action"

mkdir .deploy
cd .deploy

git clone --depth 1 --branch master --single-branch ${remote_repo} . || (git init && git remote add -t master origin ${remote_repo})

rm -rf ./* 
cp -r ../public/* .

git add -A .
git commit -m 'Site updated'
git branch -m master
git push -q -u origin master
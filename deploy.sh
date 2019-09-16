set -e

if [[ -z "$GITHUB_TOKEN" ]]; then
    echo "Set the GITHUB_TOKEN env variable."
    exit 1
fi

remote_repo="https://${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"

echo ${remote_repo}

git config --global user.email "blandys@qq.com"
git config --global user.name "github action"

mkdir .deploy
cd .deploy
echo git clone --depth 1 --branch master --single-branch ${remote_repo} . || (git init && git remote add -t master origin ${remote_repo})

rm -rf ./* 
cp -r ../public/* .

git add -A .
git commit -m 'Site updated'
git branch -m master
git push -q -u origin master
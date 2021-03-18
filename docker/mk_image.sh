#!/usr/bin/env bash 

set -e

PROJECT_NAME="hj"
image_name="${PROJECT_NAME}:1.0"
if [ $1 == "prod" ];then
image_name="${PROJECT_NAME}:2.0"
fi
if [ $1 == "preprod" ];then
image_name="${PROJECT_NAME}:2.0"
fi
if [ $1 == "test" ];then
image_name="${PROJECT_NAME}:1.0"
fi

dockerConfigPath=$(pwd)

# pwd = ${PROJECT_NAME}/docker
repoRoot=${dockerConfigPath}/..

# 切换分支并打包
cd ${repoRoot}

yarn install --pure-lockfile
yarn build
# 复制 build

cd $dockerConfigPath

mkdir -p tmp

cp $repoRoot/package.json ./tmp
cp -r $repoRoot/bin ./tmp
cp -r $repoRoot/build ./tmp

cd tmp 
yarn install --pure-lockfile --prod

cd $dockerConfigPath

# 生成docker image
docker rmi -f $image_name
echo '正在生成docker镜像'
docker build -f ./Dockerfile -t $image_name ./

docker push $image_name

# 所有环境都要写入image name
echo ${image_name} > $3/${BUILD_TAG}
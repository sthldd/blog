docker start distracted_buck &&
cd /home/blog/app/blog &&
git pull &&
yarn install --production=false &&
yarn build &&
docker build -t mlx/node-web-app . &&
docker kill app && 
docker remove app && 
docker run --name app --network=host  -p 3000:3000 -d mlx/node-web-app &&
echo 'ok!' 
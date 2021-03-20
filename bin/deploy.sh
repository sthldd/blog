docker start 015 &&
cd /home/blog/app/ &&
git pull &&
yarn install --production=false &&
yarn build &&
docker build -t mlx/node-web-app . &&
docker run --name app --network=host  -p 3000:3000 -d mlx/node-web-app &&
echo 'ok!'
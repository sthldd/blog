docker start distracted_buck &&
cd /home/blog/app/blog &&
git pull &&
npm install --production=false &&
yarn build &&
docker build -t mlx/node-web-app . &&
docker kill distracted_buck && 
docker remove distracted_buck && 
docker run  --network=host  -p 3000:3000 -d mlx/node-web-app &&
echo 'ok!' 
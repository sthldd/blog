zip -r '.next.zip' '.next'
scp /Users/apple/Desktop/blog/.next.zip blog@dev1:/home/blog/app
docker build -t mlx/node-web-app .
docker run --network=host  -p 3000:3000 -d mlx/node-web-app
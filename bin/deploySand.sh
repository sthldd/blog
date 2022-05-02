zip -r '.next.zip' '.next'
scp /Users/apple/Desktop/blog/.next.zip blog@dev1:/home/blog/app
docker build -t mlx/node-web-app .
docker run --network=host  -p 3000:3000 -d mlx/node-web-app
docker run --name blog-nginx  --network=host  -d nginx:1.19.1

server {
    listen       80;
    listen  [::]:80;
    server_name  localhost;

    location / {
      proxy_pass   http://0.0.0.0:3000;
    }
}

FROM harbor.server.topviewclub.cn/library/nginx:1.19.1
RUN rm -rf /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/conf.d
COPY ./artifact /usr/share/nginx/html
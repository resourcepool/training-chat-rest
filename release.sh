rm -rf dist public views
mkdir dist
gulp
tar -czvf dist/chat-rest.tar.gz conf public route service util views websocket app.js package.json install.sh start.sh

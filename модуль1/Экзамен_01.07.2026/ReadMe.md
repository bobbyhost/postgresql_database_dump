
В этой папки ответы на экзаменационное задание от 01.07.2026

Исполняемый файл server.js в окружении: Node 24.4.1+Nginx +PostgreSQL. Порт 3008 Nginx.

Устанвока модулей:

npm -y init

npm install bcryptjs multer body-parser cookie-parser express-session dotenv express mysql2 bcrypt helmet csurf ejs  uuid express-validator 

это на всякий случай

pm2 start server.js --name demo.bobbyhost.ru

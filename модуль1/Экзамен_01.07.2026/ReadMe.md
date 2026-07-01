демо-версия:
https://demo.bobbyhost.ru
логин: demo
пароль: demo123

В этой папки ответы на экзаменационное задание от 01.07.2026

Исполняемый файл server.js в окружении: Node 24.4.1 (Next.js)+Nginx +PostgreSQL. Порт 3008 Nginx.

Устанвока модулей:

npm -y init

npm install pg bcryptjs multer body-parser cookie-parser express-session dotenv express mysql2 bcrypt helmet csurf ejs  uuid express-validator 

это на всякий случай

pm2 start server.js --name demo.bobbyhost.ru


Дополнительно: 
ипортировал дамп базы:
 PGPASSWORD='мой_пароль' psql -U demo_demo -d demo_demo -h localhost -f /home/demo/sites/demo.bobbyhost.ru/1.sql
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
INSERT 0 2
INSERT 0 6
INSERT 0 2
INSERT 0 10
INSERT 0 36
INSERT 0 30
INSERT 0 10
INSERT 0 20

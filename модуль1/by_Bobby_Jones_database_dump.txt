-- ============================================================
-- Дамп  PostgreSQL-базы данных для какого-то бутика от Александра aka Bobby Jones.
-- Нормализация до 3НФ, все внешние ключи, данные из файлов:
-- user_import.xlsx, Tovar.xlsx, Заказ_import.xlsx, Пункты выдачи_import.xlsx
-- ============================================================

-- ----------------------------
-- Справочники или типа того
-- ----------------------------
CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE manufacturers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- ----------------------------
-- Пользователи (запилил из user_import.xlsx)
-- ----------------------------
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(200) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(50) NOT NULL,
    role VARCHAR(50) NOT NULL
);

-- ----------------------------
-- Пункты выдачи (запилил из списка адресов)
-- ----------------------------
CREATE TABLE pickup_points (
    id SERIAL PRIMARY KEY,
    address VARCHAR(200) NOT NULL UNIQUE
);

-- ----------------------------
-- Товары (запилил из  Tovar.xlsx)
-- ----------------------------
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    article VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    supplier_id INTEGER REFERENCES suppliers(id) ON DELETE RESTRICT,
    manufacturer_id INTEGER REFERENCES manufacturers(id) ON DELETE RESTRICT,
    category_id INTEGER REFERENCES categories(id) ON DELETE RESTRICT,
    discount INTEGER DEFAULT 0 CHECK (discount >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    description TEXT,
    image VARCHAR(100)
);

-- ----------------------------
-- Заказы (запилил из Заказ_import.xlsx)
-- ----------------------------
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_number INTEGER NOT NULL UNIQUE,
    order_date DATE NOT NULL,
    delivery_date DATE,
    pickup_point_id INTEGER NOT NULL REFERENCES pickup_points(id) ON DELETE RESTRICT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    pickup_code VARCHAR(10) NOT NULL,
    status VARCHAR(50) NOT NULL
);

-- ----------------------------
-- Позиции заказов (разбивка артикулов)
-- ----------------------------
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0)
);

-- ============================================================
-- ЗАПОЛНЕНИЕ ДАННЫМИ. какой-то шмоточный бутик в которые любят ходить генеральские дочки))
-- ============================================================

INSERT INTO suppliers (name) VALUES
('Kari'),
('Обувь для вас');

INSERT INTO manufacturers (name) VALUES
('Kari'),
('Marco Tozzi'),
('Рос'),
('Rieker'),
('Alessio Nesca'),
('CROSBY');

INSERT INTO categories (name) VALUES
('Женская обувь'),
('Мужская обувь');

INSERT INTO users (full_name, email, password, role) VALUES
('Никифорова Весения Николаевна', '94d5ous@gmail.com', 'uzWC67', 'Администратор'),
('Сазонов Руслан Германович', 'uth4iz@mail.com', '2L6KZG', 'Администратор'),
('Одинцов Серафим Артёмович', 'yzls62@outlook.com', 'JlFRCZ', 'Администратор'),
('Степанов Михаил Артёмович', '1diph5e@tutanota.com', '8ntwUp', 'Менеджер'),
('Ворсин Петр Евгеньевич', 'tjde7c@yahoo.com', 'YOyhfR', 'Менеджер'),
('Старикова Елена Павловна', 'wpmrc3do@tutanota.com', 'RSbvHv', 'Менеджер'),
('Михайлюк Анна Вячеславовна', '5d4zbu@tutanota.com', 'rwVDh9', 'Авторизированный клиент'),
('Ситдикова Елена Анатольевна', 'ptec8ym@yahoo.com', 'LdNyos', 'Авторизированный клиент'),
('Ворсин Петр Евгеньевич', '1qz4kw@mail.com', 'gynQMT', 'Авторизированный клиент'),
('Старикова Елена Павловна', '4np6se@mail.com', 'AtnDjr', 'Авторизированный клиент');

INSERT INTO pickup_points (address) VALUES
('420151, г. Лесной, ул. Вишневая, 32'),
('125061, г. Лесной, ул. Подгорная, 8'),
('630370, г. Лесной, ул. Шоссейная, 24'),
('400562, г. Лесной, ул. Зеленая, 32'),
('614510, г. Лесной, ул. Маяковского, 47'),
('410542, г. Лесной, ул. Светлая, 46'),
('620839, г. Лесной, ул. Цветочная, 8'),
('443890, г. Лесной, ул. Коммунистическая, 1'),
('603379, г. Лесной, ул. Спортивная, 46'),
('603721, г. Лесной, ул. Гоголя, 41'),
('410172, г. Лесной, ул. Северная, 13'),
('614611, г. Лесной, ул. Молодежная, 50'),
('454311, г.Лесной, ул. Новая, 19'),
('660007, г.Лесной, ул. Октябрьская, 19'),
('603036, г. Лесной, ул. Садовая, 4'),
('394060, г.Лесной, ул. Фрунзе, 43'),
('410661, г. Лесной, ул. Школьная, 50'),
('625590, г. Лесной, ул. Коммунистическая, 20'),
('625683, г. Лесной, ул. 8 Марта'),
('450983, г.Лесной, ул. Комсомольская, 26'),
('394782, г. Лесной, ул. Чехова, 3'),
('603002, г. Лесной, ул. Дзержинского, 28'),
('450558, г. Лесной, ул. Набережная, 30'),
('344288, г. Лесной, ул. Чехова, 1'),
('614164, г.Лесной, ул. Степная, 30'),
('394242, г. Лесной, ул. Коммунистическая, 43'),
('660540, г. Лесной, ул. Солнечная, 25'),
('125837, г. Лесной, ул. Шоссейная, 40'),
('125703, г. Лесной, ул. Партизанская, 49'),
('625283, г. Лесной, ул. Победы, 46'),
('614753, г. Лесной, ул. Полевая, 35'),
('426030, г. Лесной, ул. Маяковского, 44'),
('450375, г. Лесной ул. Клубная, 44'),
('625560, г. Лесной, ул. Некрасова, 12'),
('630201, г. Лесной, ул. Комсомольская, 17'),
('190949, г. Лесной, ул. Мичурина, 26');

INSERT INTO products (article, name, unit, price, supplier_id, manufacturer_id, category_id, discount, stock, description, image) VALUES
('А112Т4', 'Ботинки', 'шт.', 4990, 1, 1, 1, 3, 6, 'Женские Ботинки демисезонные kari', '1.jpg'),
('F635R4', 'Ботинки', 'шт.', 3244, 2, 2, 1, 2, 13, 'Ботинки Marco Tozzi женские демисезонные, размер 39, цвет бежевый', '2.jpg'),
('H782T5', 'Туфли', 'шт.', 4499, 1, 1, 2, 4, 5, 'Туфли kari мужские классика MYZ21AW-450A, размер 43, цвет: черный', '3.jpg'),
('G783F5', 'Ботинки', 'шт.', 5900, 1, 3, 2, 2, 8, 'Мужские ботинки Рос-Обувь кожаные с натуральным мехом', '4.jpg'),
('J384T6', 'Ботинки', 'шт.', 3800, 2, 4, 2, 2, 16, 'B3430/14 Полуботинки мужские Rieker', '5.jpg'),
('D572U8', 'Кроссовки', 'шт.', 4100, 2, 3, 2, 3, 6, '129615-4 Кроссовки мужские', '6.jpg'),
('F572H7', 'Туфли', 'шт.', 2700, 1, 2, 1, 2, 14, 'Туфли Marco Tozzi женские летние, размер 39, цвет черный', '7.jpg'),
('D329H3', 'Полуботинки', 'шт.', 1890, 2, 5, 1, 4, 4, 'Полуботинки Alessio Nesca женские 3-30797-47, размер 37, цвет: бордовый', '8.jpg'),
('B320R5', 'Туфли', 'шт.', 4300, 1, 4, 1, 2, 6, 'Туфли Rieker женские демисезонные, размер 41, цвет коричневый', '9.jpg'),
('G432E4', 'Туфли', 'шт.', 2800, 1, 1, 1, 3, 15, 'Туфли kari женские TR-YR-413017, размер 37, цвет: черный', '10.jpg'),
('S213E3', 'Полуботинки', 'шт.', 2156, 2, 6, 2, 3, 6, '407700/01-01 Полуботинки мужские CROSBY', NULL),
('E482R4', 'Полуботинки', 'шт.', 1800, 1, 1, 1, 2, 14, 'Полуботинки kari женские MYZ20S-149, размер 41, цвет: черный', NULL),
('S634B5', 'Кеды', 'шт.', 5500, 2, 6, 2, 3, 6, 'Кеды Caprice мужские демисезонные, размер 42, цвет черный', NULL),
('K345R4', 'Полуботинки', 'шт.', 2100, 2, 6, 2, 2, 3, '407700/01-02 Полуботинки мужские CROSBY', NULL),
('O754F4', 'Туфли', 'шт.', 5400, 2, 4, 1, 4, 18, 'Туфли женские демисезонные Rieker артикул 55073-68/37', NULL),
('G531F4', 'Ботинки', 'шт.', 6600, 1, 1, 1, 2, 9, 'Ботинки женские зимние ROMER арт. 893167-01 Черный', NULL),
('J542F5', 'Тапочки', 'шт.', 500, 1, 1, 2, 3, 12, 'Тапочки мужские Арт.70701-55-67син р.41', NULL),
('B431R5', 'Ботинки', 'шт.', 2700, 2, 4, 2, 2, 5, 'Мужские кожаные ботинки/мужские ботинки', NULL),
('P764G4', 'Туфли', 'шт.', 6800, 1, 6, 1, 3, 15, 'Туфли женские, ARGO, размер 38', NULL),
('C436G5', 'Ботинки', 'шт.', 10200, 1, 5, 1, 2, 9, 'Ботинки женские, ARGO, размер 40', NULL),
('F427R5', 'Ботинки', 'шт.', 11800, 2, 4, 1, 4, 11, 'Ботинки на молнии с декоративной пряжкой FRAU', NULL),
('N457T5', 'Полуботинки', 'шт.', 4600, 1, 6, 1, 3, 13, 'Полуботинки Ботинки черные зимние, мех', NULL),
('D364R4', 'Туфли', 'шт.', 12400, 1, 1, 1, 2, 5, 'Туфли Luiza Belly женские Kate-lazo черные из натуральной замши', NULL),
('S326R5', 'Тапочки', 'шт.', 9900, 2, 6, 2, 3, 15, 'Мужские кожаные тапочки "Профиль С.Дали"', NULL),
('L754R4', 'Полуботинки', 'шт.', 1700, 1, 1, 1, 2, 7, 'Полуботинки kari женские WB2020SS-26, размер 38, цвет: черный', NULL),
('M542T5', 'Кроссовки', 'шт.', 2800, 2, 4, 2, 5, 3, 'Кроссовки мужские TOFA', NULL),
('D268G5', 'Туфли', 'шт.', 4399, 2, 4, 1, 3, 12, 'Туфли Rieker женские демисезонные, размер 36, цвет коричневый', NULL),
('T324F5', 'Сапоги', 'шт.', 4699, 1, 6, 1, 2, 5, 'Сапоги замша Цвет: синий', NULL),
('K358H6', 'Тапочки', 'шт.', 599, 1, 4, 2, 3, 2, 'Тапочки мужские син р.41', NULL),
('H535R5', 'Ботинки', 'шт.', 2300, 2, 4, 1, 2, 7, 'Женские Ботинки демисезонные', NULL);

INSERT INTO orders (order_number, order_date, delivery_date, pickup_point_id, user_id, pickup_code, status) VALUES
(1, '2025-02-27', '2025-04-20', 1, 4, '901', 'Завершен'),
(2, '2022-09-28', '2025-04-21', 11, 1, '902', 'Завершен'),
(3, '2025-03-21', '2025-04-22', 2, 2, '903', 'Завершен'),
(4, '2025-02-20', '2025-04-23', 11, 3, '904', 'Завершен'),
(5, '2025-03-17', '2025-04-24', 2, 4, '905', 'Завершен'),
(6, '2025-03-01', '2025-04-25', 15, 1, '906', 'Завершен'),
(7, '2025-02-28', '2025-04-26', 3, 2, '907', 'Завершен'),
(8, '2025-03-31', '2025-04-27', 19, 3, '908', 'Новый'),
(9, '2025-04-02', '2025-04-28', 5, 4, '909', 'Новый'),
(10, '2025-04-03', '2025-04-29', 19, 4, '910', 'Новый');

INSERT INTO order_items (order_id, product_id, quantity) VALUES
(1, (SELECT id FROM products WHERE article='А112Т4'), 2),
(1, (SELECT id FROM products WHERE article='F635R4'), 2),
(2, (SELECT id FROM products WHERE article='H782T5'), 1),
(2, (SELECT id FROM products WHERE article='G783F5'), 1),
(3, (SELECT id FROM products WHERE article='J384T6'), 10),
(3, (SELECT id FROM products WHERE article='D572U8'), 10),
(4, (SELECT id FROM products WHERE article='F572H7'), 5),
(4, (SELECT id FROM products WHERE article='D329H3'), 4),
(5, (SELECT id FROM products WHERE article='А112Т4'), 2),
(5, (SELECT id FROM products WHERE article='F635R4'), 2),
(6, (SELECT id FROM products WHERE article='H782T5'), 1),
(6, (SELECT id FROM products WHERE article='G783F5'), 1),
(7, (SELECT id FROM products WHERE article='J384T6'), 10),
(7, (SELECT id FROM products WHERE article='D572U8'), 10),
(8, (SELECT id FROM products WHERE article='F572H7'), 5),
(8, (SELECT id FROM products WHERE article='D329H3'), 4),
(9, (SELECT id FROM products WHERE article='B320R5'), 5),
(9, (SELECT id FROM products WHERE article='G432E4'), 1),
(10, (SELECT id FROM products WHERE article='S213E3'), 5),
(10, (SELECT id FROM products WHERE article='E482R4'), 5);

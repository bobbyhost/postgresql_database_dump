const express = require('express');
const { Client } = require('pg');
const app = express();
const PORT = 3008;

// ----- ПОДКЛЮЧЕНИЕ К БАЗЕ ДАННЫХ (простейшее) -----
const db = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',          // мой реальный пользователь я  сделал в примере https://demo.bobbyhost.ru
    password: 'ваш_пароль',    // мой реальный паролья я сделал в примере в примере https://demo.bobbyhost.ru
    database: 'module1_db'
});
db.connect(); // подключаемся сразу

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ----- API ДЛЯ ТОВАРОВ -----

// Получить все товары
app.get('/api/products', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT p.id, p.article, p.name, p.price, p.discount, p.stock,
                   s.name AS supplier, m.name AS manufacturer, c.name AS category
            FROM products p
            LEFT JOIN suppliers s ON p.supplier_id = s.id
            LEFT JOIN manufacturers m ON p.manufacturer_id = m.id
            LEFT JOIN categories c ON p.category_id = c.id
            ORDER BY p.id
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Получить один товар по id
app.get('/api/products/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Не найден' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Добавить товар
app.post('/api/products', async (req, res) => {
    const { article, name, unit, price, supplier_id, manufacturer_id,
            category_id, discount, stock, description, image } = req.body;
    try {
        const result = await db.query(`
            INSERT INTO products (article, name, unit, price, supplier_id, manufacturer_id,
                                  category_id, discount, stock, description, image)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *
        `, [article, name, unit || 'шт.', price, supplier_id || null,
            manufacturer_id || null, category_id || null,
            discount || 0, stock || 0, description || null, image || null]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Обновить товар
app.put('/api/products/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { article, name, unit, price, supplier_id, manufacturer_id,
            category_id, discount, stock, description, image } = req.body;
    try {
        const result = await db.query(`
            UPDATE products SET
                article=$1, name=$2, unit=$3, price=$4,
                supplier_id=$5, manufacturer_id=$6, category_id=$7,
                discount=$8, stock=$9, description=$10, image=$11
            WHERE id=$12 RETURNING *
        `, [article, name, unit, price, supplier_id || null,
            manufacturer_id || null, category_id || null,
            discount || 0, stock || 0, description || null, image || null, id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Не найден' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Удалить товар
app.delete('/api/products/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const result = await db.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Не найден' });
        res.json({ message: 'Удалён', deleted: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ----- ОТДАЁМ HTML-СТРАНИЦУ (ВСЁ В ОДНОМ ФАЙЛЕ) -----
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Управление товарами</title>
    <style>
        body { font-family: Arial; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        h1 { text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background: #f2f2f2; }
        .btn { padding: 5px 10px; border: none; border-radius: 4px; cursor: pointer; }
        .btn-add { background: #28a745; color: white; padding: 8px 16px; font-size: 16px; }
        .btn-edit { background: #ffc107; }
        .btn-delete { background: #dc3545; color: white; }
        .message { padding: 10px; margin: 10px 0; display: none; border-radius: 4px; }
        .success { display: block; background: #d4edda; color: #155724; }
        .error { display: block; background: #f8d7da; color: #721c24; }
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0; top: 0;
            width: 100%; height: 100%;
            background: rgba(0,0,0,0.5);
        }
        .modal-content {
            background: white;
            margin: 5% auto;
            padding: 20px;
            max-width: 500px;
            border-radius: 8px;
            position: relative;
        }
        .close {
            position: absolute;
            right: 20px; top: 10px;
            font-size: 28px;
            cursor: pointer;
        }
        .modal-content label { display: block; margin: 8px 0; }
        .modal-content input, .modal-content textarea { width: 100%; padding: 6px; box-sizing: border-box; }
        .form-actions { margin-top: 15px; display: flex; gap: 10px; justify-content: flex-end; }
        .form-actions button { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
        #saveBtn { background: #28a745; color: white; }
        #cancelBtn { background: #6c757d; color: white; }
    </style>
</head>
<body>
<div class="container">
    <h1>🛒 Товары</h1>
    <button class="btn btn-add" id="addBtn">➕ Добавить товар</button>
    <div id="message" class="message"></div>
    <table>
        <thead><tr><th>ID</th><th>Артикул</th><th>Название</th><th>Цена</th><th>Скидка %</th><th>В наличии</th><th>Поставщик</th><th>Производитель</th><th>Категория</th><th>Действия</th></tr></thead>
        <tbody id="productsBody"></tbody>
    </table>
</div>

<!-- Модальное окно -->
<div id="modal" class="modal">
    <div class="modal-content">
        <span class="close" id="closeModal">&times;</span>
        <h2 id="modalTitle">Добавить товар</h2>
        <form id="productForm">
            <input type="hidden" id="productId">
            <label>Артикул <input type="text" id="article" required></label>
            <label>Название <input type="text" id="name" required></label>
            <label>Ед. изм. <input type="text" id="unit" value="шт."></label>
            <label>Цена <input type="number" step="0.01" id="price" required></label>
            <label>Скидка (%) <input type="number" id="discount" value="0"></label>
            <label>Количество <input type="number" id="stock" value="0"></label>
            <label>Поставщик (ID) <input type="number" id="supplier_id"></label>
            <label>Производитель (ID) <input type="number" id="manufacturer_id"></label>
            <label>Категория (ID) <input type="number" id="category_id"></label>
            <label>Описание <textarea id="description"></textarea></label>
            <label>Фото <input type="text" id="image" placeholder="имя файла"></label>
            <div class="form-actions">
                <button type="submit" id="saveBtn">Сохранить</button>
                <button type="button" id="cancelBtn">Отмена</button>
            </div>
        </form>
    </div>
</div>

<script>
    const API = '/api/products';
    const tbody = document.getElementById('productsBody');
    const modal = document.getElementById('modal');
    const form = document.getElementById('productForm');
    const msg = document.getElementById('message');

    // --- Загрузка списка товаров ---
    async function load() {
        try {
            const res = await fetch(API);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            render(data);
        } catch (e) {
            showMsg('Ошибка загрузки: ' + e.message, 'error');
        }
    }

    function render(products) {
        if (!products.length) {
            tbody.innerHTML = '<tr><td colspan="10">Нет товаров</td></tr>';
            return;
        }
        tbody.innerHTML = products.map(p => \`
            <tr>
                <td>\${p.id}</td>
                <td>\${p.article}</td>
                <td>\${p.name}</td>
                <td>\${p.price}</td>
                <td>\${p.discount}%</td>
                <td>\${p.stock}</td>
                <td>\${p.supplier || '-'}</td>
                <td>\${p.manufacturer || '-'}</td>
                <td>\${p.category || '-'}</td>
                <td>
                    <button class="btn btn-edit" data-id="\${p.id}">✏️</button>
                    <button class="btn btn-delete" data-id="\${p.id}">🗑️</button>
                </td>
            </tr>
        \`).join('');

        document.querySelectorAll('.btn-edit').forEach(b => b.onclick = () => edit(b.dataset.id));
        document.querySelectorAll('.btn-delete').forEach(b => b.onclick = () => remove(b.dataset.id));
    }

    function showMsg(text, type = 'success') {
        msg.textContent = text;
        msg.className = 'message ' + type;
        msg.style.display = 'block';
        setTimeout(() => msg.style.display = 'none', 4000);
    }

    // --- Модальное окно ---
    function openModal(title, data = {}) {
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('productId').value = data.id || '';
        document.getElementById('article').value = data.article || '';
        document.getElementById('name').value = data.name || '';
        document.getElementById('unit').value = data.unit || 'шт.';
        document.getElementById('price').value = data.price || '';
        document.getElementById('discount').value = data.discount || 0;
        document.getElementById('stock').value = data.stock || 0;
        document.getElementById('supplier_id').value = data.supplier_id || '';
        document.getElementById('manufacturer_id').value = data.manufacturer_id || '';
        document.getElementById('category_id').value = data.category_id || '';
        document.getElementById('description').value = data.description || '';
        document.getElementById('image').value = data.image || '';
        modal.style.display = 'block';
    }

    function closeModal() {
        modal.style.display = 'none';
        form.reset();
    }

    document.getElementById('addBtn').onclick = () => openModal('Добавить товар');
    document.getElementById('closeModal').onclick = closeModal;
    document.getElementById('cancelBtn').onclick = closeModal;
    window.onclick = e => { if (e.target === modal) closeModal(); };

    // --- Редактирование ---
    async function edit(id) {
        try {
            const res = await fetch(API + '/' + id);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            openModal('Редактировать товар', data);
        } catch (e) {
            showMsg('Ошибка: ' + e.message, 'error');
        }
    }

    // --- Удаление ---
    async function remove(id) {
        if (!confirm('Удалить товар?')) return;
        try {
            const res = await fetch(API + '/' + id, { method: 'DELETE' });
            if (!res.ok) throw new Error('Ошибка удаления');
            showMsg('Товар удалён');
            load();
        } catch (e) {
            showMsg('Ошибка: ' + e.message, 'error');
        }
    }

    // --- Сохранение (добавление/обновление) ---
    form.onsubmit = async (e) => {
        e.preventDefault();
        const id = document.getElementById('productId').value;
        const method = id ? 'PUT' : 'POST';
        const url = id ? API + '/' + id : API;

        const body = {
            article: document.getElementById('article').value.trim(),
            name: document.getElementById('name').value.trim(),
            unit: document.getElementById('unit').value.trim(),
            price: parseFloat(document.getElementById('price').value),
            discount: parseInt(document.getElementById('discount').value) || 0,
            stock: parseInt(document.getElementById('stock').value) || 0,
            supplier_id: document.getElementById('supplier_id').value || null,
            manufacturer_id: document.getElementById('manufacturer_id').value || null,
            category_id: document.getElementById('category_id').value || null,
            description: document.getElementById('description').value.trim(),
            image: document.getElementById('image').value.trim() || null,
        };

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Ошибка');
            showMsg(id ? 'Товар обновлён' : 'Товар добавлен');
            closeModal();
            load();
        } catch (e) {
            showMsg('Ошибка: ' + e.message, 'error');
        }
    };

    // Старт
    load();
</script>
</body>
</html>
    `);
});

// ----- ЗАПУСК СЕРВЕРА -----
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
    console.log('Подключение к БД установлено.');
});

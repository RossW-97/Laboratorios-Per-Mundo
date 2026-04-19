import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import Database from "better-sqlite3";
import { addMonths, format } from "date-fns";

const db = new Database("perumundo.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    name TEXT,
    role TEXT CHECK(role IN ('agricultor', 'cooperativa', 'admin')),
    region TEXT
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    species TEXT,
    variety TEXT,
    biotization_type TEXT,
    senasa_cert TEXT,
    stock_in_vitro INTEGER,
    growth_speed TEXT,
    base_price REAL,
    region TEXT,
    line TEXT,
    code TEXT,
    height TEXT,
    tolerance TEXT
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    total_price REAL,
    status TEXT,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    estimated_delivery DATETIME,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS traceability (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    lote_id TEXT UNIQUE,
    stage TEXT,
    description TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(order_id) REFERENCES orders(id)
  );
`);

// Seed initial data if empty
const productCount = db.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number };
if (productCount.count === 0) {
  const insertProduct = db.prepare(`
    INSERT INTO products (species, variety, biotization_type, senasa_cert, stock_in_vitro, growth_speed, base_price, region, line, code, height, tolerance)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Musáceas
  insertProduct.run("Musa AAB", "Curaré Enano", "Biotizado +30%", "SENASA-2024-001", 5000, "Rápido", 3.53, "Loreto", "Musáceas", "PH-MUS-01", "9-10 m", "Tolerante");
  insertProduct.run("Musa AAB 'Red Banano Enano'", "Red Banano Enano", "Biotizado", "SENASA-2024-005", 3000, "Moderado", 3.80, "Loreto", "Musáceas", "PH-MUS-02", "11 m", "Libre de Virus");
  insertProduct.run("Musa AAA 'Isla Maleño'", "Isla Maleño", "Biotizado", "SENASA-2024-006", 4000, "Moderado", 3.60, "San Martín", "Musáceas", "PH-MUS-03", "8-9 m", "Vigilado");

  // Forestal
  insertProduct.run("Aniba rosaeodora", "Palo Rosa", "Biotizado Clonal", "SENASA-2024-002", 2000, "Moderado", 6.10, "San Martín", "Forestal", "PH-FOR-01", "12 meses (ciclo)", "Disponible");
  insertProduct.run("Cedrela odorata", "Cedro", "Biotizado", "SENASA-2024-003", 1500, "Lento", 5.50, "Loreto", "Forestal", "PH-FOR-02", "10 meses (ciclo)", "Bajo Pedido");
  insertProduct.run("Swietenia macrophylla", "Caoba", "Biotizado", "SENASA-2024-004", 1200, "Lento", 6.50, "San Martín", "Forestal", "PH-FOR-03", "14 meses (ciclo)", "Disponible");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Endpoints
  app.get("/api/catalogo", (req, res) => {
    const { region, growth_speed, line } = req.query;
    let query = "SELECT * FROM products WHERE 1=1";
    const params: any[] = [];

    if (region) {
      query += " AND region = ?";
      params.push(region);
    }
    if (growth_speed) {
      query += " AND growth_speed = ?";
      params.push(growth_speed);
    }
    if (line) {
      query += " AND line = ?";
      params.push(line);
    }

    const products = db.prepare(query).all(...params);
    res.json(products);
  });

  app.post("/api/pedidos", (req, res) => {
    const { user_id, product_id, quantity, user_role } = req.body;
    
    const product = db.prepare("SELECT * FROM products WHERE id = ?").get(product_id) as any;
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });

    // Business Logic: Delivery Date Calculation
    // Conventional: 24-36 months. Our tech: 12-16 months.
    const deliveryMonths = product.growth_speed === "Rápido" ? 12 : 16;
    const estimatedDelivery = addMonths(new Date(), deliveryMonths).toISOString();

    // Business Logic: Volume Discounts
    let totalPrice = product.base_price * quantity;
    if (user_role === "cooperativa" && quantity >= 1000) {
      totalPrice *= 0.85; // 15% discount for cooperatives
    } else if (quantity >= 5000) {
      totalPrice *= 0.90; // 10% volume discount
    }

    const info = db.prepare(`
      INSERT INTO orders (user_id, product_id, quantity, total_price, status, estimated_delivery)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(user_id || 1, product_id, quantity, totalPrice, "Pendiente", estimatedDelivery);

    const orderId = info.lastInsertRowid;
    const loteId = `LPM-${orderId}-${format(new Date(), "yyyyMM")}`;

    db.prepare(`
      INSERT INTO traceability (order_id, lote_id, stage, description)
      VALUES (?, ?, ?, ?)
    `).run(orderId, loteId, "Introducción in vitro", "Inicio del ciclo de micropropagación en laboratorio.");

    res.json({ 
      orderId, 
      loteId, 
      totalPrice, 
      estimatedDelivery,
      message: "Pedido procesado exitosamente con certificación SENASA vinculada."
    });
  });

  app.get("/api/trazabilidad/:loteId", (req, res) => {
    const { loteId } = req.params;
    const logs = db.prepare(`
      SELECT t.*, o.status, p.species, p.variety, p.senasa_cert
      FROM traceability t
      JOIN orders o ON t.order_id = o.id
      JOIN products p ON o.product_id = p.id
      WHERE t.lote_id = ?
      ORDER BY t.timestamp DESC
    `).all(loteId);

    if (logs.length === 0) return res.status(404).json({ error: "Lote no encontrado" });
    res.json(logs);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

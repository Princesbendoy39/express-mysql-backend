const pool = require("../config/db.config");

const executeQuery = async (sql, params = []) => {
  try {
  
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error("Database query error:", error);
    throw new Error("Database operation failed.");
  }
};

class Product {

  static async create({ name, description, price, image_url }) {
    const sql = "INSERT INTO products (name, description, price) VALUES (?, ?, ?)";
    const result = await executeQuery(sql, [name, description, price]);
    return { id: result.insertId, name, description, price,};
  }


  static async findAll() {
    const sql = "SELECT id, name, description, price, image_url, created_at FROM products";
    return executeQuery(sql);
  }

  static async findById(id) {
    const sql = "SELECT id, name, description, price, created_at FROM products WHERE id = ?";
    const rows = await executeQuery(sql, [id]);
    return rows[0] || null;
  }

  static async update(id, { name, description, price }) {
    const sql = "UPDATE products SET name = ?, description = ?, price = ? WHERE id = ?";
    const result = await executeQuery(sql, [name, description, price, id]);
    return result.affectedRows === 1;
  }
  
  static async delete(id) {
    const sql = "DELETE FROM products WHERE id = ?";
    const result = await executeQuery(sql, [id]);
    return result.affectedRows === 1;
  }
}

module.exports = Product;

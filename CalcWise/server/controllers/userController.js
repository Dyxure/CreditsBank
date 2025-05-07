const pool = require('../config/db')

exports.getUser = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Users');
        res.status(200).json(result.row);
    }
    catch(err) {
        res.status(500).json({ error: err.message });
    }
}

exports.createUser = async (req, res) => {
    const { name, password } = req.body;
    try {
        const result = await pool.query('INSERT INTO Users (username, password) VALUES ($1, $2) RETURNING *', [name, password]);
        res.status(201).json(result.row[0]);
    }
    catch(err) {
        res.status(500).json({ error: err.message });
    }
}

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, password } = req.body;
    try {
      const result = await pool.query('UPDATE Users SET name = $1, password = $2 WHERE id = $3 RETURNING *', [name, password, id]);
      res.status(200).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
}

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query('DELETE FROM Users WHERE id = $1', [id]);
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
}
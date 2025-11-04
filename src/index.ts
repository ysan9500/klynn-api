import express from "express";
import mongoose from "mongoose";
import Order from "./models/order.model.js";

const PORT = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI;
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.type("html").send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Klynn Orders API</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; max-width: 800px; margin: 40px auto; padding: 0 16px; line-height: 1.6; }
          h1 { margin-bottom: 0.2rem; }
          code { background: #f4f4f4; padding: 2px 4px; border-radius: 4px; font-size: 0.95em; }
          pre { background: #f4f4f4; padding: 12px; border-radius: 6px; overflow-x: auto; }
          .endpoint-table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          .endpoint-table th, .endpoint-table td { border: 1px solid #ddd; padding: 8px; font-size: 0.9rem; }
          .endpoint-table th { background: #fafafa; text-align: left; }
          .method { font-weight: 600; }
          .get { color: #2f855a; }
          .post { color: #3182ce; }
          .put { color: #b7791f; }
          .delete { color: #e53e3e; }
        </style>
      </head>
      <body>
        <h1>Klynn Orders API</h1>
        <p>Welcome 👋 This is the backend API for managing orders.</p>

        <h2>Base URL</h2>
        <pre><code>http://localhost:${PORT}</code></pre>

        <h2>Endpoints</h2>
        <table class="endpoint-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Path</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="method get">GET</td>
              <td><code>/api/orders</code></td>
              <td>Get all orders</td>
            </tr>
            <tr>
              <td class="method get">GET</td>
              <td><code>/api/orders/:id</code></td>
              <td>Get a single order by ID</td>
            </tr>
            <tr>
              <td class="method post">POST</td>
              <td><code>/api/orders</code></td>
              <td>Create a new order</td>
            </tr>
            <tr>
              <td class="method put">PUT</td>
              <td><code>/api/orders/:id</code></td>
              <td>Update an existing order</td>
            </tr>
            <tr>
              <td class="method delete">DELETE</td>
              <td><code>/api/orders/:id</code></td>
              <td>Delete an order</td>
            </tr>
          </tbody>
        </table>

        <h2>Example: Create Order</h2>
        <p>Send a <span class="method post">POST</span> request:</p>
        <pre><code>POST /api/orders
Content-Type: application/json

{
  "/* orderField1 */": "value",
  "/* orderField2 */": "value"
}</code></pre>

        <p style="margin-top: 24px; font-size: 0.85rem; color: #666;">
          Tip: Update this page to reflect your actual Order schema in <code>models/order.model.js</code>.
        </p>
      </body>
    </html>
  `);
});

// Get all orders
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get order by ID
app.get("/api/orders/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new order
app.post("/api/orders", async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an existing order
app.put("/api/orders/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    const updatedOrder = await Order.findById(req.params.id);
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete an order
app.delete("/api/orders/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

export default app;
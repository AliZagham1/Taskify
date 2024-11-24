import express from "express";
import pg from "pg";
import methodOverride from "method-override";
import dotenv from "dotenv";


if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}
const db = new pg.Client(
  process.env.DATABASE_URL ||
  {
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    database: process.env.DATABASE_NAME,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  }
);

db.connect((err) => {
  if (err) {
    console.error("Database connection error:", err.stack);
  } else {
    console.log("Database connected successfully");
  }
});

const app = express();
const port = process.env.PORT || 3000; // Use dynamic port for deployment

// Middleware
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Routes
app.get("/", (req, res) => res.render("intro"));
app.get("/about", (req, res) => res.render("about"));

app.get("/members", (req, res) => {
  db.query("SELECT * FROM members", (err, result) => {
    if (err) {
      console.error("Error retrieving members:", err);
      res.status(500).send("Error retrieving members");
    } else {
      res.render("members", { members: result.rows });
    }
  });
});

app.get("/members/:id", (req, res) => {
  const memberId = req.params.id;
  db.query("SELECT * FROM items WHERE member_id = $1", [memberId], (err, result) => {
    if (err) {
      console.error("Error fetching items:", err.stack);
      res.status(500).send("Internal Server Error");
    } else {
      res.render("items", { items: result.rows, memberId: memberId });
    }
  });
});

app.get("/add-member", (req, res) => res.render("add-member"));
app.post("/add-member", (req, res) => {
  const { name } = req.body;
  db.query("INSERT INTO members (name, joined_at) VALUES ($1, NOW())", [name], (err) => {
    if (err) {
      console.error("Error adding member:", err.stack);
      res.status(500).send("Internal Server Error");
    } else {
      res.redirect("/members");
    }
  });
});

app.get("/members/:id/add-item", (req, res) => {
  const memberId = req.params.id;
  res.render("add-item", { memberId });
});

app.post("/members/:id/add-item", (req, res) => {
  const memberId = req.params.id;
  const { content } = req.body;
  db.query(
    "INSERT INTO items (member_id, content, created_at) VALUES ($1, $2, NOW())",
    [memberId, content],
    (err) => {
      if (err) {
        console.error("Error adding task:", err.stack);
        res.status(500).send("Internal Server Error");
      } else {
        res.redirect(`/members/${memberId}`);
      }
    }
  );
});

app.get("/items/:id/edit", (req, res) => {
  const itemId = req.params.id;
  db.query("SELECT * FROM items WHERE id = $1", [itemId], (err, result) => {
    if (err) {
      console.error("Error fetching task:", err.stack);
      res.status(500).send("Internal Server Error");
    } else if (result.rows.length === 0) {
      res.status(404).send("Task not found");
    } else {
      res.render("edit-item", { item: result.rows[0] });
    }
  });
});

app.post("/items/:id/edit", (req, res) => {
  const itemId = req.params.id;
  const { content } = req.body;
  db.query(
    "UPDATE items SET content = $1 WHERE id = $2",
    [content, itemId],
    (err) => {
      if (err) {
        console.error("Error updating task:", err.stack);
        res.status(500).send("Internal Server Error");
      } else {
        res.redirect(`/members/${req.body.memberId}`);
      }
    }
  );
});

app.delete("/items/:id", (req, res) => {
  const taskId = req.params.id;
  db.query("DELETE FROM items WHERE id = $1", [taskId], (err) => {
    if (err) {
      console.error("Error deleting task:", err.stack);
      res.status(500).send("Internal Server Error");
    } else {
      res.redirect("back");
    }
  });
});

app.delete("/members/:id", (req, res) => {
  const memberId = req.params.id;
  db.query("DELETE FROM members WHERE id = $1", [memberId], (err) => {
    if (err) {
      console.error("Error deleting member:", err.stack);
      res.status(500).send("Internal Server Error");
    } else {
      res.redirect("/members");
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

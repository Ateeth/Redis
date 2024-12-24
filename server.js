const express = require("express");
const axios = require("axios");
const client = require("./client");

const app = express();

app.get("/", async (req, res) => {
  const cacheValue = await client.get("todos");
  if (cacheValue) {
    return res.json(JSON.parse(cacheValue));
  }

  try {
    const { data } = await axios.get(
      "https://jsonplaceholder.typicode.com/todos"
    );
    await client.set("todos", JSON.stringify(data));
    await client.expire("todos", 30);
    return res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Failed to fetch data." });
  }
});

app.listen(9000, () => {
  console.log("Server is running on port 9000");
});

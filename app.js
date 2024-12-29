const express = require("express");
const axios = require("axios");
const cors = require("cors");
const client = require("./client");

const DEFAULT_EXPIRATION = 3600;

const app = express();
app.use(cors());

app.get("/photos", async (req, res) => {
  const albumId = req.query.albumId;
  const photos = await getOrSetCache(`photos?albumId=${albumId}`, async () => {
    console.log("Cache Miss");
    const { data } = await axios.get(
      "https://jsonplaceholder.typicode.com/photos",
      { params: { albumId } }
    );
    return data;
  });
  res.json(photos);
});

app.get("/photos/:id", async (req, res) => {
  const photo = await getOrSetCache(`photos:${req.params.id}`, async () => {
    console.log("Cache Miss");
    const { data } = await axios.get(
      `https://jsonplaceholder.typicode.com/photos/${req.params.id}`
    );
    return data;
  });

  res.json(photo);
});

function getOrSetCache(key, cb) {
  return new Promise(async (resolve, reject) => {
    await client.get(key, async (error, data) => {
      if (error) {
        return reject(error);
      }

      if (data != null) {
        console.log("Cache Hit");
        return resolve(JSON.parse(data));
      }

      const freshData = await cb();
      await client.setex(key, DEFAULT_EXPIRATION, JSON.stringify(freshData));
      resolve(freshData);
    });
  });
}

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

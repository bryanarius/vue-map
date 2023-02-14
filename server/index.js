const express = require("express");
const axios = require("axios")
const cors = require("cors");
const url = require("url")
require("dotenv").config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());

// routes
app.use("/api/search", require("./routes/searchResults.js"));

// Handle Production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(`${__dirname}/public`));
}

app.listen(PORT, () => console.log(`app started on port: ${PORT}`));
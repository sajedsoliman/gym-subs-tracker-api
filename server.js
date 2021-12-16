require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { initQlServer } = require("./graphql/config");
const { connectDB } = require("./database/init");

const app = express();

app.use(express.json());
app.use(
	cors({
		credentials: true,
		origin: process.env.CLIENT_ORIGIN,
	})
);

initQlServer(app);
connectDB();

const PORT = process.env.PORT || 4000;
app.listen(
	PORT,
	() =>
		process.env.NODE_ENV === "development" &&
		console.log(`http://localhost:${PORT}/graphql`)
);

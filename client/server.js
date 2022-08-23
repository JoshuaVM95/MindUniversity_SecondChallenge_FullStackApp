const express = require("express");
const path = require("path");

// set up rate limiter: maximum of five requests per minute
const RateLimit = require("express-rate-limit");
const limiter = new RateLimit({
	windowMs: 60 * 1000, // 1 minute
	max: 5
});

const app = express();
const port = process.env.PORT || 3000;

// apply rate limiter to all requests
app.use(limiter);

app.use(express.static(path.join(__dirname, "build")));

app.get("/*", function (req, res) {
	res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(port, () => console.log(`react app runing at ${port}`));

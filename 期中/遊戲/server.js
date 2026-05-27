const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;

const scoreFile = path.join(__dirname, "scores.json");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

if (!fs.existsSync(scoreFile)) {
    fs.writeFileSync(scoreFile, "[]");
}

app.get("/leaderboard", (req, res) => {
    const scores = JSON.parse(fs.readFileSync(scoreFile));

    scores.sort((a, b) => b.score - a.score);

    res.json(scores.slice(0, 10));
});

app.post("/score", (req, res) => {
    const { name, score } = req.body;

    if (!name || score == null) {
        return res.status(400).json({
            message: "資料錯誤"
        });
    }

    const scores = JSON.parse(fs.readFileSync(scoreFile));

    scores.push({
        name,
        score,
        time: new Date().toLocaleString()
    });

    fs.writeFileSync(scoreFile, JSON.stringify(scores, null, 2));

    res.json({
        message: "分數已儲存"
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

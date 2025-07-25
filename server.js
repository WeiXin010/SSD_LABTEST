const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const PORT = 5000;

// Serve static files from frontend/
app.use(express.static(path.join(__dirname, 'frontend')));

// Validate search term
function isValid(term) {
    return /^[a-zA-Z0-9\s]{1,50}$/.test(term); // Alphanumeric + space, 1–50 chars
}

app.get('/search', (req, res) => {
    const query = req.query.query || '';

    if (!isValid(query)) {
        // On invalid query, serve index.html again (without redirect or error param)
        const filePath = path.join(__dirname, 'frontend', 'index.html');
        return fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) return res.status(500).send('Error loading page.');
            res.send(data); // Serve index.html again
        });
    }

    // Redirect to result page with query in URL
    const encodedQuery = encodeURIComponent(query);
    res.redirect(`/result.html?q=${encodedQuery}`);

});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

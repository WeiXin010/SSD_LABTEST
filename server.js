import express from 'express';
import path from 'path';
import fs from 'fs/promises'; // use the Promise-based API
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
        return res.redirect('/');
    }

    // Redirect to result page with query in URL
    const encodedQuery = encodeURIComponent(query);
    res.redirect(`/result.html?q=${encodedQuery}`);

});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

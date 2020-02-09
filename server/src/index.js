const express = require('express');
const app = express();
const dotenv = require('dotenv');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const axios = require('axios');
const child_process = require('child_process');

app.use(morgan(process.env.ENV))
app.use(express.static('static'));
app.use(cors())
dotenv.config({
    path: path.join('env', 'dev.env')
});

// Notebooks - https://www.onenote.com/api/v1.0/me/notes/notebooks
// Sections - https://www.onenote.com/api/v1.0/me/notes/notebooks/0-E6AC34B29128DCBF!127/sections
// Pages - https://www.onenote.com/api/v1.0/me/notes/sections/0-E6AC34B29128DCBF!152/pages

const microsoftOneNoteBaseUrl = 'https://www.onenote.com/api/v1.0/me/notes';

app.get('/notebooks', async (req, res) => {
    try {
        const response = await axios.get(`${microsoftOneNoteBaseUrl}/notebooks`, {
            headers: {
                Authorization: req.header('Authorization')
            }
        });

        res.status(200).json(response.data);
    } catch (err) {
        if(err.message.includes('status code 401')){
            res.status(401).json({
                message: 'unauthorised'
            });
        }
    }
});

app.get('/notebooks/:id', async (req, res) => {
    try {
        const response = await axios.get(`${microsoftOneNoteBaseUrl}/notebooks/${req.param.id}`, {
            headers: {
                Authorization: req.header('Authorization')
            }
        });
        res.status(200).json(response.data);
    } catch (err) {
        res.json(err);
    }
});

app.get('/notebooks/:id/sections', async (req, res) => {
    try {
        const response = await axios.get(`${microsoftOneNoteBaseUrl}/notebooks/${req.params.id}/sections`, {
            headers: {
                Authorization: req.header('Authorization')
            }
        });

        res.status(200).json(response.data);
    } catch (err) {
        res.json(err);
    }
});


app.get('/sections/:id/pages', async (req, res) => {
    try {
        const response = await axios.get(`${microsoftOneNoteBaseUrl}/sections/${req.params.id}/pages`, {
            headers: {
                Authorization: req.header('Authorization')
            }
        });
        res.status(200).json(response.data);
    } catch (err) {
        res.json(err);
    }
});

const PORT = process.env.PORT || 3004;

const server = app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

server.on('error', err => {
    if (err.code === 'EADDRINUSE') {
        child_process.exec('killall -9 node');
    }
});
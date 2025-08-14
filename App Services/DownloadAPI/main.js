const express = require('express');
const fs = require('fs');
const path = require('path');
const { logger } = require('../../App/Utils/winston');
const log = logger();
const router = express.Router();
const multer = require('multer');

const DOWNLOAD_FOLDER = path.join(__dirname, 'Files'); 
if (!fs.existsSync(DOWNLOAD_FOLDER)) fs.mkdirSync(DOWNLOAD_FOLDER);

const upload = multer({ dest: DOWNLOAD_FOLDER });

log.info("DownloadAPI service loaded.");

// Middleware
router.use(express.urlencoded({ extended: true }));

// Helper: check if a file is an image
const isImage = (filename) => {
    const ext = path.extname(filename).toLowerCase();
    return ['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext);
};

// --- Dashboard ---
router.get('/', (req, res) => {
    const files = fs.readdirSync(DOWNLOAD_FOLDER);
    const baseUrl = req.protocol + '://' + req.get('host') + '/download'; // base URL for download links

    let fileListHtml = files.map(f => {
        let preview = '';
        if (isImage(f)) {
            preview = `<br><img src="/download/${f}" alt="${f}" style="max-width:200px; max-height:200px;" />`;
        }
        return `
        <li>
            ${f} ${preview}
            <form style="display:inline" method="POST" action="/download/delete">
                <input type="hidden" name="filename" value="${f}" />
                <button type="submit">Delete</button>
            </form>
            <a href="/download/${f}" target="_blank">Download</a>
            <button onclick="copyLink('${baseUrl}/${f}')">Copy Link</button>
        </li>
        `;
    }).join('');

    res.send(`
        <h1>Download Dashboard</h1>
        <ul>${fileListHtml}</ul>

        <h2>Upload File</h2>
<form id="uploadForm" enctype="multipart/form-data">
    <input type="file" name="file" required />
    <button type="submit">Upload</button>
</form>
<div id="progressContainer" style="display:none;">
    <progress id="uploadProgress" value="0" max="100"></progress>
    <span id="progressText">0%</span>
</div>


        <script>
function copyLink(link) {
    navigator.clipboard.writeText(link)
        .then(() => alert('Copied to clipboard!'))
        .catch(err => alert('Failed to copy link'));
}

document.getElementById('uploadForm').addEventListener('submit', function(e) {
    e.preventDefault(); // stop normal form submit

    const fileInput = this.querySelector('input[type="file"]');
    if (!fileInput.files.length) return alert('Please select a file.');

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/download/add', true);

    xhr.upload.onprogress = function(e) {
        if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            document.getElementById('progressContainer').style.display = 'block';
            document.getElementById('uploadProgress').value = percent;
            document.getElementById('progressText').innerText = percent + '%';
        }
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            alert('Upload complete!');
            window.location.reload();
        } else {
            alert('Upload failed: ' + xhr.responseText);
        }
    };

    xhr.send(formData);
});
</script>

    `);
});

// --- List files API ---
router.get('/files', (req, res) => {
    const files = fs.readdirSync(DOWNLOAD_FOLDER);
    res.json({ files });
});

// --- Upload a file ---
router.post('/add', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).send("No file uploaded");

    const originalPath = req.file.path;
    const targetPath = path.join(DOWNLOAD_FOLDER, req.file.originalname);

    // Rename temp file to original name
    fs.renameSync(originalPath, targetPath);
    log.info(`File uploaded: ${req.file.originalname}`);
    res.redirect('/download');
});

// --- Delete a file via POST (for dashboard) ---
router.post('/delete', (req, res) => {
    const { filename } = req.body;
    if (!filename) return res.status(400).send("Missing filename");

    const filePath = path.join(DOWNLOAD_FOLDER, filename);
    if (!fs.existsSync(filePath)) return res.status(404).send("File not found");

    fs.unlinkSync(filePath);
    log.info(`File deleted: ${filename}`);
    res.redirect('/download');
});

// --- Download a file ---
router.get('/:filename', (req, res) => {
    const filePath = path.join(DOWNLOAD_FOLDER, req.params.filename);
    if (!fs.existsSync(filePath)) return res.status(404).send("File not found");

    res.download(filePath);
});

module.exports = router;

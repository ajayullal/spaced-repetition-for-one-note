let { readdir, readFile, writeFile, stat, mkdirSync } = require('fs');
const { promisify } = require('util');
var { copy } = require("fs-extra");
let rmdir = promisify(require('rimraf'));
readdir = promisify(readdir);
readFile = promisify(readFile);
stat = promisify(stat);
writeFile = promisify(writeFile);
copy = promisify(copy);

const deploymentFolderPath = '../one-note-spaced-repetition';
const buildFolderPath = './build';

const indexHTML = `${buildFolderPath}/index.html`;
readFile(indexHTML, 'UTF-8')
    .then(fileContent => {
        let html = fileContent.replace(/="\//g, `="./`);
        html = html.replace('React App', 'Spaced repetition for one note');
        writeFile(indexHTML, html)
    })
    .catch(error => console.log("Error modifying index.html"));

readdir(deploymentFolderPath).then(files => {
    files.forEach(async (file, index) => {
        if (file !== '.git') {
            await rmdir(`${deploymentFolderPath}/${file}`);
        }

        if (index === files.length - 1) {
            readdir(buildFolderPath).then(files => {
                files.forEach(async file => {
                    const stats = await stat(`${buildFolderPath}/${file}`);
                    if (stats.isDirectory()) {
                        mkdirSync(`${deploymentFolderPath}/${file}`)
                    }
                    copy(`${buildFolderPath}/${file}`, `${deploymentFolderPath}/${file}`)
                        .catch(err => {
                            console.log(`Error copying file ${err}`);
                        });
                });
            });

        }
    });
});
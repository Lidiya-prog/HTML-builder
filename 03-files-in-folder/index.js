const fs = require('fs');
const { readdir } = require('fs/promises')
const path = require('path')

const pathToSecret = path.join(__dirname, 'secret-folder')

async function checkFiles() {
    try {
        const files = await readdir(pathToSecret, { withFileTypes: true })
        files.forEach(file => {
            if (file.isFile()) {
                fs.stat(path.join(pathToSecret, file.name), (err, stat) => {
                    if (err) {
                        console.error(err)
                    } else {
                        const pathToFile = path.join(pathToSecret, file.name);
                        console.log(`${path.parse(pathToFile).name} - ${path.extname(pathToFile).slice(1)} - ${stat.size}`);
                    }

                })
            }
        })
    } catch (err) {
        console.error(err)
    }
}

checkFiles()
const path = require('path');
const { mkdir, copyFile, readdir, rm } = require('fs/promises');

const folderPath = path.join(__dirname, 'files');
const folderCopyPath = path.join(__dirname, 'files-copy')

async function copyDir() {
    try {
        await rm(folderCopyPath, { recursive: true, force: true })
        await mkdir(folderCopyPath, { recursive: true, force: true })
        const folderContent = await readdir(folderPath, {withFileTypes: true})
        folderContent.forEach( file => {
            if(file.isDirectory()){
                copyDir(path.join(folderPath, file.name ), path.join(folderCopyPath, file.name))
            } else {
                copyFile(path.join(folderPath, file.name ), path.join(folderCopyPath, file.name))
            }
           
        })
   
    } catch (e) {
        console.error(e.message);
    }
}

copyDir();

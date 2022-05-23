const path = require('path');
const { readdir } = require('fs/promises');
const fs = require('fs');

const distPath = path.join(__dirname, 'project-dist');
const stylePath = path.join(__dirname, 'styles');

async function mergeStyles(){
    try{
        const styles = await readdir(stylePath,  {withFileTypes: true});
        const output = fs.createWriteStream(path.join(distPath, 'bundle.css'));
        styles.forEach(style => {
            if(style.isFile() && style.name.includes('.css')){
                const input = fs.createReadStream(path.join(stylePath, style.name), 'utf-8');
                input.pipe(output);
            }
        })

    }catch(e){
        console.error(e.message);
    }
}

mergeStyles();
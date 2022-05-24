const path = require('path');
const { mkdir, copyFile, readdir, rm } = require('fs/promises');
const fs = require('fs');

const distPath = path.join(__dirname, 'project-dist');
const stylePath = path.join(__dirname, 'styles');
const assetsPath = path.join(__dirname, 'assets');
const componentsPath = path.join(__dirname, 'components');
const templatePath = path.join(__dirname, 'template.html');

async function buildHTML(templatePath, componentsPath) {
  try {
    const template = fs.createReadStream(templatePath, 'utf-8');
    let templateData = '';
    template.on('data', (chunk) => (templateData += chunk));
    template.on('end', async () => {
      const components = await readdir(componentsPath, { withFileTypes: true });
      components.forEach((component) => {
        const componentData = fs.createReadStream(
          path.join(componentsPath, component.name),
          'utf-8'
        );
        const name = path.basename(
          path.join(componentsPath, component.name),
          '.html'
        );

        let componentContent = '';
        componentData.on('data', (chunk) => (componentContent += chunk));
        componentData.on('end', () => {
          templateData = templateData.replace(
            `    {{${name}}}`,
            componentContent
          );
          const output = fs.createWriteStream(
            path.join(distPath, 'index.html')
          );
          output.write(templateData);
        });
      });
    });
  } catch (e) {
    console.error(e.message);
  }
}

async function copyDir(folderPath, folderCopyPath) {
  try {
    await rm(folderCopyPath, { recursive: true, force: true });
    await mkdir(folderCopyPath, { recursive: true, force: true });
    const folderContent = await readdir(folderPath, { withFileTypes: true });
    folderContent.forEach((file) => {
      if (file.isDirectory()) {
        copyDir(
          path.join(folderPath, file.name),
          path.join(folderCopyPath, file.name)
        );
      } else {
        copyFile(
          path.join(folderPath, file.name),
          path.join(folderCopyPath, file.name)
        );
      }
    });
  } catch (e) {
    console.error(e.message);
  }
}

async function mergeStyles() {
  try {
    const styles = await readdir(stylePath, { withFileTypes: true });
    const output = fs.createWriteStream(path.join(distPath, 'style.css'));
    styles.forEach((style) => {
      if (style.isFile() && style.name.includes('.css')) {
        const input = fs.createReadStream(
          path.join(stylePath, style.name),
          'utf-8'
        );
        input.pipe(output);
      }
    });
  } catch (e) {
    console.error(e.message);
  }
}

async function buildPage(distPath, templatePath, assetsPath, componentsPath) {
  try {
    await rm(distPath, { recursive: true, force: true });
    await mkdir(distPath, { recursive: true, force: true });
    buildHTML(templatePath, componentsPath);
    mergeStyles();
    copyDir(assetsPath, path.join(distPath, 'assets'));
  } catch (e) {
    console.error(e.message);
  }
}

buildPage(distPath, templatePath, assetsPath, componentsPath);

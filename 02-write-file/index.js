const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = process;
const output = fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf-8')

stdout.write('Hey! Type the text! \n')
stdin.on('data', data =>{
    data.toString().trim() === 'exit' ? exit() : output.write(data);
})

process.on('exit', () => stdout.write('\n Bye! \n'));
process.on('SIGINT', exit);

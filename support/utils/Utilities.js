const fs = require('fs');
const path = require('path');
const constants = require('../utils/constants');

class Utilities {
    waitForFileDownload(filePath, timeout) {
        return new Promise(function (resolve, reject) {
            const timer = setTimeout(function () {
                watcher.close();
                reject(new Error('File did not exists and was not created during the timeout.'));
            }, timeout);
            fs.access(filePath, fs.constants.R_OK, function (err) {
                if (!err) {
                    clearTimeout(timer);
                    watcher.close();
                    resolve();
                }
            });

            const dir = path.dirname(filePath);
            const basename = path.basename(filePath);
            const watcher = fs.watch(dir, function (eventType, filename) {
                if (eventType === 'rename' && filename === basename) {
                    clearTimeout(timer);
                    watcher.close();
                    resolve();
                }
            });
        });
    }

    getCwd(fileName) {
        return path.join(__dirname, fileName);
    }

    createDir(folderPath) {
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
        }
    }

    rmDir(path) {
        if (fs.existsSync(path)) {
            fs.readdirSync(path).forEach((file, index) => {
                const curPath = path + "/" + file;
                if (fs.lstatSync(curPath).isDirectory()) { // recurse
                    this.rmDir(curPath);
                } else {
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    } 

    getCurrentDate() {
        const date = new Date();
        return date.getDate();
    }
}
module.exports = new Utilities;
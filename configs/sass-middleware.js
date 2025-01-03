const sass = require('sass');
const path = require('path');

const fs = require('fs');

const scssPath = path.join(__dirname, '..', 'assets/scss');
const cssPath = path.join(__dirname, '..', 'assets/css');

// Cache for keeping track of the last modification time
let lastModifiedTime = {};

const sassMiddleware = (req, res, next) => {
    const scssFile = path.join(scssPath, req.url.replace('.css', '') + '.scss');
    const cssFile = path.join(cssPath, req.url.replace('.css', '') + '.css');

    const scssFileName = path.basename(scssFile);
    const cssFileName = path.basename(cssFile);

    // check if SCSS file exists
    if(fs.existsSync(scssFile)){
        try {
            // Get the current modification time of the SCSS file
            const currentMT = fs.statSync(scssFile).mtime.getTime();
            
            // Check if the file has changed since the last compilation
            if (lastModifiedTime[scssFile] !== currentMT) {
                const result = sass.compile(scssFile, {
                    outfile: cssFile,
                    outputStyle: 'expanded'
                });
    
                fs.writeFileSync(cssFile, result.css);
                console.log(`Compiled: ${scssFileName} to ${cssFileName}`);

                lastModifiedTime[scssFile] = currentMT;
            }
        } catch (error) {
            console.error(`Error compiling ${scssFileName}:`, error);
            return next(error);  // Pass error to next middleware
        }
    }else{
        return next();
    }

    next();
}

module.exports = sassMiddleware
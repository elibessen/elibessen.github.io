const pug = require("pug");
const fs = require("fs");

// List of Pug files to compile
const files = ["src/index", "src/404"];

files.forEach((file) => {
  // Compile Pug to HTML string
  const html = pug.renderFile(`${file}.pug`, { pretty: true });

  // Write HTML to corresponding .html file
  fs.writeFileSync(`${file}.html`, html, "utf8");
  console.log(`${file}.pug compiled to ${file}.html`);
});

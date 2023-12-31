// Importing necessary modules
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

/**
 * @param {vscode.ExtensionContext} context
 */
// Activating the extension
function activate(context) {
	
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "Project-Layout-VSCode" is now active!');

  // Registering the command and pushing it to the context subscriptions
  let disposable = vscode.commands.registerCommand(
    "extension.generateProjectLayout",
    generateProjectLayout
  );

  context.subscriptions.push(disposable);
}

// Function to generate the project layout
function generateProjectLayout() {
  // Getting the root path
  const rootPath = vscode.workspace.workspaceFolders
    ? vscode.workspace.workspaceFolders[0].uri.fsPath
    : undefined;

  if (!rootPath) {
    vscode.window.showErrorMessage("No workspace folder is open");
    return;
  }

  // Getting the settings
  const config = vscode.workspace.getConfiguration('vscodeProjectLayout');
  const outputFileName = config.get('outputFileName');
  const outputFileLocation = config.get('outputFileLocation');
  const additionalIgnoreDirs = config.get('additionalIgnoreDirs');
  const ignoreExtensions = config.get('ignoreExtensions');
  const outputFormat = config.get('outputFormat');

  // Getting the directories to ignore
  let ignoreDirs = getDirectoriesToIgnore();
  ignoreDirs.push(...additionalIgnoreDirs);

  // Starting the output string
  let output = "";
  switch (outputFormat) {
    case 'markdown':
      output += "--- Folder Layout ---\n";
      output += getFolderLayoutMarkdown(rootPath, ignoreDirs, ignoreExtensions, 0);
      break;
    case 'json':
      output += JSON.stringify(getFolderLayoutJson(rootPath, ignoreDirs, ignoreExtensions), null, 2);
      break;
    default:
      output += "--- Folder Layout ---\n";
      output += getFolderLayoutPlain(rootPath, ignoreDirs, ignoreExtensions, 0);
  }

  // Determine the file extension based on the output format
  let fileExtension;
  switch (outputFormat) {
    case 'json':
      fileExtension = '.json';
      break;
    case 'markdown':
      fileExtension = '.md';
      break;
    default:
      fileExtension = '.txt';
  }

  // Add the extension to the output file name
  const completeOutputFileName = `${outputFileName}${fileExtension}`;

  // Generating the output path
  const outputPath = path.join(rootPath, outputFileLocation, completeOutputFileName);

  // Writing the output to the file
  fs.writeFileSync(outputPath, output);

  // Showing a message that the project layout was generated successfully
  vscode.window.showInformationMessage("Project layout generated successfully");
}


// Functions to get the folder layout
// Function to get the folder layout in JSON format
function getFolderLayoutJson(dir, ignoreDirs, ignoreExtensions) {
  let layout = {};

  // If the directory exists
  if (fs.existsSync(dir)) {
    // Reading the files in the directory
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const fullPath = path.join(dir, file);
      const relativePath = path.relative(process.cwd(), fullPath);

      // If the file is a directory
      if (fs.lstatSync(fullPath).isDirectory()) {
        if (shouldIgnore(relativePath, ignoreDirs, ignoreExtensions, true)) {
          layout[file] = "(...)";
        } else {
          layout[file] = getFolderLayoutJson(fullPath, ignoreDirs, ignoreExtensions);
        }
      } else {
        // If the file is not a directory and should not be ignored
        if (!shouldIgnore(relativePath, ignoreDirs, ignoreExtensions)) {
          layout[file] = null;
        }
      }
    });
  }

  return layout;
}


// Function to get the folder layout in Markdown format
function getFolderLayoutMarkdown(dir, ignoreDirs, ignoreExtensions, level) {
  let output = "";

  // If the directory exists
  if (fs.existsSync(dir)) {
    // Reading the files in the directory
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const fullPath = path.join(dir, file);
      const relativePath = path.relative(process.cwd(), fullPath);
      const indent = " ".repeat(level * 2);

      if (fs.lstatSync(fullPath).isDirectory()) {
        if (shouldIgnore(relativePath, ignoreDirs, ignoreExtensions, true)) {
          output += `${indent}- ${file}/ (...)\n`;
        } else {
          output += `${indent}- ${file}/\n`;
          output += getFolderLayoutMarkdown(fullPath, ignoreDirs, ignoreExtensions, level + 1);
        }
      } else if (!shouldIgnore(relativePath, ignoreDirs, ignoreExtensions)) {
        output += `${indent}- ${file}\n`;
      }
    });
  }

  return output;
}


// Function to get the folder layout in plain format
function getFolderLayoutPlain(dir, ignoreDirs, ignoreExtensions, level) {
  let output = "";

  // If the directory exists
  if (fs.existsSync(dir)) {
    // Reading the files in the directory
    const files = fs.readdirSync(dir);
    files.forEach((file, index) => {
      const fullPath = path.join(dir, file);
      const relativePath = path.relative(process.cwd(), fullPath);
      const isLastFile = index === files.length - 1;
      const prefix = level === 0 ? "" : isLastFile ? "└── " : "├── ";
      const indent = " ".repeat(level * 4) + (level > 0 ? prefix : "");

      if (fs.lstatSync(fullPath).isDirectory()) {
        if (shouldIgnore(relativePath, ignoreDirs, ignoreExtensions, true)) {
          output += indent + `[${file}] (...)\n`;
        } else {
          output += indent + `[${file}]\n`;
          output += getFolderLayoutPlain(fullPath, ignoreDirs, ignoreExtensions, level + 1);
        }
      } else if (!shouldIgnore(relativePath, ignoreDirs, ignoreExtensions)) {
        output += indent + file + "\n";
      }
    });
  }

  return output;
}



// Function to get the directories to ignore
function getDirectoriesToIgnore() {
  // Getting the root path
  const rootPath = vscode.workspace.workspaceFolders
    ? vscode.workspace.workspaceFolders[0].uri.fsPath
    : undefined;

  // If there's no workspace, return an empty array
  if (!rootPath) {
    return [];
  }

  // Getting the settings
  const config = vscode.workspace.getConfiguration('vscodeProjectLayout');
  const relativePathToIgnore = config.get('ignoreDirPath');

  // Resolve the absolute path to the ignore file
  const absolutePathToIgnore = path.resolve(rootPath, relativePathToIgnore);

  if (!fs.existsSync(absolutePathToIgnore)) {
    return [];
  }

  // Reading the contents of the file and splitting it by lines
  let contents = fs.readFileSync(absolutePathToIgnore, 'utf8');
  let dirs = contents.split('\n').map(line => line.trim()).filter(line => line !== '');

  return dirs;
}



// Function to determine if a file should be ignored
function shouldIgnore(relativePath, ignoreDirs, ignoreExtensions, isDirectory = false) {
  if (isDirectory) {
    return ignoreDirs.some(dir => relativePath.includes(dir));
  }
  const fileExtension = path.extname(relativePath);
  return ignoreExtensions.includes(fileExtension);
}


// Deactivating the extension
function deactivate() { }

// Exporting the activate and deactivate functions
module.exports = {
  activate,
  deactivate,
};

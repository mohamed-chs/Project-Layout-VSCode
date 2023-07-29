# Project Layout

Project Layout is a powerful extension that helps you visualize the organization of your codebase within VSCode. It creates a text-based project structure, which makes it easier to understand your project's layout and file dependencies. You can choose to export the structure in different formats: Markdown, JSON, or a simple text-based tree structure.

This extension is a great tool for developers, especially for large projects, or when joining a new project and trying to understand the project structure quickly.

## Features

### Generate Project Layout
With a simple command, the extension will scan your project and generate a detailed representation of its structure, including folders and files. The tool smartly avoids directories and file types you don't want to include, based on your settings.

### Configurable Output
You have the flexibility to choose the format of your project's structure. The options include Markdown for those who prefer a more styled and structured format, JSON for those who want a format that can easily be read programmatically, and plain text for a quick and clean overview.

### Configurable Ignore Settings
You can specify the directories and file types to be ignored when generating the project structure. This feature is useful for excluding directories like `node_modules` or ignoring file types such as binary or image files. Additionally, you can specify a text file containing a list of directories to be ignored. Each line should represent a path to a directory to be ignored.

### Output Location
Customize the location and name of the output file to match your preferences. By default, the output file will be saved in your project's root directory, but you can specify any path you want.

## Usage

### To generate your project structure:
1. Open the command palette with `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS).
2. Type "Generate Project Structure" and hit `Enter`.

Now, a file representing your project structure will be generated at your specified location!

### To customize the extension settings:
Go to `File > Preferences > Settings` and search for "Project Layout". Here, you'll find options to tailor the extension to your preferences:

- **Output Format**: Choose between `"markdown"`, `"json"`, or `"text"`. This will determine how your project structure is formatted.

- **Output File Name**: Specify the name for the output file. By default, the file is named `"project_structure.md"`, `"project_structure.json"` or `"project_structure.txt"` depending on your chosen format.

- **Output File Location**: Choose where the output file should be saved. The default is `.` (the root of your project).

- **Directories to Ignore**: A list of directories to exclude from the project structure. Directories should be specified as relative paths from the root of your workspace.

- **File Extensions to Ignore**: A list of file extensions to exclude. Each item should start with a period (e.g. `".exe"`, `".tmp"`).

- **Directories to Ignore File Path**: The path to a text file with a list of directories to ignore. Each line in the file should contain one directory path. The default value is `"./.gitignore"`.

## Example
If we have the following project structure:

```
/my_project
├── /src
│   ├── script.js
│   └── style.css
├── /test
│   └── test_script.js
├── .gitignore
└── README.md
```

The extension might generate the following output in Markdown:

```md
# My Project

- **/src**
  - script.js
  - style.css
- **/test**
  - test_script.js
- .gitignore
- README.md
```

Or the following in JSON:

```json
{
  "My Project": {
    "src": [
      "script.js",
      "style.css"
    ],
    "test": [
      "test_script.js"
    ],
    "files": [
      ".gitignore",
      "README.md"
    ]
  }
}
```

## Installation

You can install the Project Layout extension directly from the Visual Studio Code Marketplace. Just search for "Project Layout" and click on "Install".

## Release Notes

### 1.0.0

Initial release.

### 1.0.1

## Contributions

Your contributions are always welcome! Feel free to create issues or submit pull requests.

## License

This project is licensed under the terms of the MIT license.

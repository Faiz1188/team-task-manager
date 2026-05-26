const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function assertIncludes(file, text, message) {
  const content = read(file);
  if (!content.includes(text)) {
    throw new Error(`${message}: expected ${file} to include ${text}`);
  }
}

const checks = [
  ['src/index.css', 'bg-slate-50 text-slate-900', 'light app body styles'],
  ['src/App.jsx', 'lg:ml-72', 'desktop sidebar content offset'],
  ['src/components/Navbar.jsx', 'hidden lg:flex', 'desktop sidebar navigation'],
  ['src/components/Navbar.jsx', 'lg:hidden', 'mobile navigation'],
  ['src/components/Navbar.jsx', 'id="logout-btn"', 'logout button id'],
  ['src/modules/auth/LoginPage.jsx', 'id="login-submit"', 'login submit id'],
  ['src/modules/auth/SignupPage.jsx', 'id="signup-submit"', 'signup submit id'],
  ['src/modules/projects/ProjectList.jsx', 'id="create-project-btn"', 'create project button id'],
  ['src/modules/tasks/TasksPage.jsx', 'id="create-task-btn"', 'create task button id'],
];

for (const [file, text, message] of checks) {
  assertIncludes(file, text, message);
}

console.log('redesign smoke checks passed');

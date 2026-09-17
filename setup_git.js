const { execSync } = require('child_process');
const fs = require('fs');

const GIT_PATH = '"C:\\Program Files\\Git\\cmd\\git.exe"';

function run(cmd) {
  try {
    const out = execSync(`${GIT_PATH} ${cmd}`, { encoding: 'utf-8', cwd: __dirname });
    return out;
  } catch (err) {
    return `ERROR: ${err.message}\n${err.stdout || ''}\n${err.stderr || ''}`;
  }
}

const status = {
  version: run('--version'),
  userName: run('config --global user.name'),
  userEmail: run('config --global user.email'),
  init: run('init'),
  statusBeforeAdd: run('status -s'),
};

fs.writeFileSync('C:\\Users\\archi\\git_status.json', JSON.stringify(status, null, 2));
console.log('Done git setup inspection');

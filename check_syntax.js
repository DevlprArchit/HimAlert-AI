const { execSync } = require('child_process');

try {
  execSync('python -m py_compile backend/main.py');
  console.log('main.py syntax is OK');
} catch (e) {
  console.error('Error in main.py:', e.message);
}

try {
  execSync('python -m py_compile backend/services/weather.py');
  console.log('weather.py syntax is OK');
} catch (e) {
  console.error('Error in weather.py:', e.message);
}

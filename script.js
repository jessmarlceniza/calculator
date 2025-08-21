const exprEl = document.getElementById('expression');
const resEl  = document.getElementById('result');
const keypad = document.getElementById('keypad');
const historyEl = document.getElementById('history');
const themeBtn = document.getElementById('themeBtn');
const copyBtn = document.getElementById('copyBtn');
const clearHistBtn = document.getElementById('clearHistBtn');
const page = document.getElementById('page');

let expr = '';
let justEvaluated = false;

function updateDisplay() {
  exprEl.textContent = expr;
  try {
    if (expr && /[0-9)]$/.test(expr)) {
      resEl.textContent = eval(expr.replace('^', '**'));
    } else {
      resEl.textContent = expr ? '…' : '0';
    }
  } catch { resEl.textContent = expr ? '…' : '0'; }
}

function append(ch) {
  if (justEvaluated && /[0-9.(]/.test(ch)) { expr = ''; justEvaluated = false; }
  expr += ch;
  justEvaluated = false;
  updateDisplay();
}

function backspace() { expr = expr.slice(0, -1); updateDisplay(); }
function allClear() { expr = ''; updateDisplay(); }

function evaluate() {
  if (!expr) return;
  try {
    const value = eval(expr.replace('^', '**'));
    resEl.textContent = value;
    expr = String(value);
    exprEl.textContent = expr;
    justEvaluated = true;
  } catch { resEl.textContent = 'Error'; justEvaluated = false; }
}

keypad.addEventListener('click', (e) => {
  const key = e.target.closest('.key');
  if (!key) return;
  const k = key.dataset.key;
  if (k === '=') return evaluate();
  if (k === 'AC') return allClear();
  if (k === 'DEL') return backspace();
  append(k);
});

document.addEventListener('keydown', (e) => {
  const k = e.key;
  if (/^[0-9]$/.test(k)) return append(k);
  if (['+', '-', '*', '/', '(', ')', '.', '^'].includes(k)) return append(k);
  if (k === 'Enter') return evaluate();
  if (k === 'Backspace') return backspace();
  if (k === 'Escape') return allClear();
});

themeBtn.addEventListener('click', () => {
  page.classList.toggle('light');
});

copyBtn.addEventListener('click', async () => {
  await navigator.clipboard.writeText(resEl.textContent.trim());
  copyBtn.textContent = '✅';
  setTimeout(()=>copyBtn.textContent='📋', 1000);
});

clearHistBtn.addEventListener('click', () => {
  historyEl.innerHTML = '';
});

updateDisplay();

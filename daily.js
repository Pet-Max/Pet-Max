// 每日名言更新脚本：每天从 quotations.md 随机抽一条，写入 README.md 的标记区间内。
// 无第三方依赖，GitHub Actions 的 runner 自带 Node。
const fs = require('fs');

const START = '<!-- DAILY-QUOTE:START -->';
const END = '<!-- DAILY-QUOTE:END -->';

try {
  const quotes = fs
    .readFileSync('./quotations.md', 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('-'));
  if (quotes.length === 0) {
    throw new Error('quotations.md 里没有以 "- " 开头的语录');
  }

  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  const date = new Date().toISOString().slice(0, 10);

  const readme = fs.readFileSync('./README.md', 'utf8');
  const start = readme.indexOf(START);
  const end = readme.indexOf(END);
  if (start === -1 || end === -1 || end < start) {
    throw new Error('README.md 缺少 DAILY-QUOTE:START / END 标记');
  }

  const next =
    readme.slice(0, start + START.length) +
    `\n\n<kbd>${date}</kbd>\n\n${quote}\n` +
    readme.slice(end);

  fs.writeFileSync('./README.md', next);
  console.log(`Update Success! ${date} -> ${quote}`);
} catch (err) {
  console.error(err.message);
  process.exit(1);
}

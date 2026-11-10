const assert=require('node:assert/strict'),fs=require('node:fs');
const convert=require('../assets/converter.js')(require('../assets/vendor/markdown-it.min.js'));
assert.equal(convert('一行目\n二行目'),'<p>一行目 二行目</p>\n');
assert.equal(convert('一行目  \n二行目'),'<p>一行目<br>\n二行目</p>\n');
assert.equal(convert('一行目 \n二行目'),'<p>一行目 二行目</p>\n');
assert.equal(convert('第一段落\n\n第二段落'),'<p>第一段落</p>\n<p>第二段落</p>\n');
assert.equal(convert('第一段落\n\n\n第二段落'),convert('第一段落\n\n第二段落'));
assert.equal(convert('一行目  \r\n二行目'),convert('一行目  \n二行目'));
assert.equal(convert('一行目\\\n二行目'),convert('一行目  \n二行目'));
const refs='[1] [公式](https://schema.org/)  \n[2] [定義](https://schema.org/BlogPosting)  \n[3] [説明](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)';
const html=convert('## 出典\n\n'+refs);assert.equal((html.match(/<a /g)||[]).length,3);assert.equal((html.match(/<br>/g)||[]).length,2);assert.equal((html.match(/<p>/g)||[]).length,1);
assert.ok(convert('```\na  \nb\n```').includes('a  \nb'));assert.ok(!convert('<script>x</script>').includes('<script>'));assert.ok(!convert('[x](javascript:alert(1))').includes('href="javascript:'));
const repaired=convert(String.raw`[1] [[https://schema.org/\](https://schema.org/)](https://schema.org/]\(https://schema.org/\))`);assert.ok(repaired.includes('<a href="https://schema.org/">https://schema.org/</a>'));
console.log('PASS: standard soft/hard breaks, paragraphs, CRLF, backslash, references, code and HTML/URL safety');

assert.ok(convert('[1] [https://schema.org/](https://schema.org/)  \n[2] [https://schema.org/BlogPosting](https://schema.org/BlogPosting)').includes('<br>'));

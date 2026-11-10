// Interpret plain-text Markdown runs, retaining native Docs headings, links,
// lists, tables, and styled paragraphs through the existing HTML serializer.
function plainMarkdownParagraph_(p) {
 if(p.bullet||p.positionedObjectIds)return null;
 const named=(p.paragraphStyle||{}).namedStyleType;
 if(named&&named!=='NORMAL_TEXT')return null;
 let text='';
 for(const e of p.elements||[]){
  if(!e.textRun||e.suggestedInsertionIds||e.suggestedDeletionIds||e.textRun.suggestedTextStyleChanges)return null;
  const s=e.textRun.textStyle||{};
  if(s.bold||s.italic||s.underline||s.strikethrough||s.link||s.baselineOffset&&s.baselineOffset!=='NORMAL')return null;
  text+=e.textRun.content||'';
 }
 return text;
}
function bodyHtml_(items,lists) {
 let out='',plain=[];
 function flush(){
  if(!plain.length)return;
  const source=plain.map(i=>plainMarkdownParagraph_(i.paragraph)).join('');
  out+=markdownHtml_(source);plain=[];
 }
 let rich=[];
 function flushRich(){if(rich.length){out+=richBodyHtml_(rich,lists);rich=[];}}
 for(const item of items||[]){
  if(item.sectionBreak)continue;
  if(item.paragraph&&plainMarkdownParagraph_(item.paragraph)!==null){flushRich();plain.push(item);}
  else{flush();rich.push(item);}
 }
 flush();flushRich();return out;
}

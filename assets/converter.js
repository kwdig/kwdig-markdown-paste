(function(root,factory){if(typeof module==='object'&&module.exports){module.exports=factory;}else{root.MPLBConverter=factory;}})(typeof window!=='undefined'?window:this,function(markdownit){
'use strict';
return function(source,mode){
 if(typeof source!=='string')throw new TypeError('Markdown must be text');
 source=source.replace(/\r\n?/g,'\n');
 // Repair only numbered reference lines whose duplicated URLs are identical.
 // Never rewrite fenced/indented code, labels, or references to different URLs.
 var fence=null;
 source=source.split('\n').map(function(line){
  var f=line.match(/^ {0,3}(`{3,}|~{3,})/);
  if(f){if(!fence)fence=f[1];else if(f[1][0]===fence[0]&&f[1].length>=fence.length)fence=null;return line;}
  if(fence||!/^ {0,3}\[\d+\]\s+\[/.test(line))return line;
  var clean=line.replace(/\\([:\[\]()])/g,'$1');
  var m=clean.match(/^( {0,3}\[\d+\]\s+)\[+(https?:\/\/[^\s\[\]()\\]+)(.*)$/);
  if(!m)return line;
  var rest=m[3].split(m[2]).join('');
  if(!/^[\[\]()\s]*$/.test(rest))return line;
  return m[1]+'['+m[2]+']('+m[2]+')'+line.match(/[ \t]*$/)[0];
 }).join('\n');
 mode=mode||'paragraphs';
 var md=markdownit({html:false,breaks:mode==='all-br',linkify:false,typographer:false});
 // Normalize soft breaks before WordPress can turn source newlines into BR.
 if(mode!=='all-br')md.renderer.rules.softbreak=function(){return ' ';};
 if(mode==='all-br'){
  md.renderer.rules.paragraph_open=function(tokens,index){
   if(tokens[index].hidden)return '';
   return index===0&&tokens[index].map?'<br>\n'.repeat(tokens[index].map[0]):'';
  };
  md.renderer.rules.paragraph_close=function(tokens,index){
   var close=tokens[index];if(close.hidden)return '';
   var open=index-1;
   while(open>=0&&!(tokens[open].type==='paragraph_open'&&tokens[open].level===close.level))open--;
   if(open<0||!tokens[open].map)return '';
   var end=tokens[open].map[1],next=index+1;
   while(next<tokens.length&&!tokens[next].map)next++;
   var count=next<tokens.length?tokens[next].map[0]-end+1:source.split('\n').length-end;
   return '<br>\n'.repeat(Math.max(0,count));
  };
 }
 return md.render(source);
};
});

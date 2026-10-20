(function(root,factory){if(typeof module==='object'&&module.exports){module.exports=factory;}else{root.MPLBConverter=factory;}})(typeof window!=='undefined'?window:this,function(markdownit){
'use strict';
return function(source,mode){
 if(typeof source!=='string')throw new TypeError('Markdown must be text');
 source=source.replace(/\r\n?/g,'\n');
 mode=mode||'all-br';
 var md=markdownit({html:false,breaks:true,linkify:false,typographer:false});
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

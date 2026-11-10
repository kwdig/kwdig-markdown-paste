(function(){
'use strict';
var convert=window.MPLBConverter(window.markdownit),seenDocs=new WeakSet(),seenTiny=new WeakSet();
function eligible(text){
 return typeof text==='string'&&(text.includes('\n')||/(^|\n) {0,3}(?:#{1,6} |```|~~~|\[\d+\]\s+\[|[-*+] |\d+\. |> )/.test(text)||/\[[^\n]+\]\([^\n]+\)/.test(text)||/\*\*[^\n]+\*\*/.test(text));
}
function take(e){var data=e.clipboardData||(e.originalEvent&&e.originalEvent.clipboardData);if(!data)return null;var text=data.getData('text/plain');if(data.getData('text/html')&&!/ {2,}\n|\\\n|(^|\n) {0,3}(?:#{1,6} |```|~~~|[-*+] |\d+\. |> )|\[[^\n]+\]\([^\n]+\)|\*\*[^\n]+\*\*/.test(text))return null;return eligible(text)?text:null;}
function classicHTML(text){return convert(text,'paragraphs');}
function stop(e){e.preventDefault();e.stopImmediatePropagation();}
function serialize(doc,fragment){fragment.querySelectorAll('a[href]').forEach(function(a){if(!a.textContent&&!a.querySelector('img,svg,br'))a.remove();});var box=doc.createElement('div');box.appendChild(fragment);return box.innerHTML;}
function onPaste(e){
 if(e.defaultPrevented||e.shiftKey)return;
 var target=e.target.nodeType===1?e.target:e.target.parentElement;
 if(!target||target.closest('.mplb-dialog,pre,code,.wp-block-code,.wp-block-html'))return;
 var text=take(e);if(text===null)return;
 // Classic text mode: insert HTML only in the main editor textarea.
 if(target.tagName==='TEXTAREA'&&target.id==='content'){
  var tiny=window.tinymce&&window.tinymce.get('content');if(tiny&&!tiny.isHidden())return;
  var html=classicHTML(text);stop(e);target.setRangeText(html,target.selectionStart,target.selectionEnd,'end');target.dispatchEvent(new Event('input',{bubbles:true}));target.dispatchEvent(new Event('change',{bubbles:true}));return;
 }
 var editable=target.closest('[contenteditable="true"]'),blockNode=editable&&editable.closest('[data-block]');
 if(!editable||!blockNode||!window.wp||!wp.data||!wp.blocks)return;
 var store=wp.data.select('core/block-editor'),id=blockNode.getAttribute('data-block'),block=store&&store.getBlock(id);
 // Other block types and cross-block selections retain WordPress's native paste.
 if(!block||block.name!=='core/paragraph'||store.getSelectedBlockClientIds().length>1)return;
 var doc=editable.ownerDocument,sel=doc.getSelection();if(!sel||sel.rangeCount!==1)return;
 var range=sel.getRangeAt(0);if(!editable.contains(range.startContainer)||!editable.contains(range.endContainer))return;
 var before=range.cloneRange(),after=range.cloneRange();before.selectNodeContents(editable);before.setEnd(range.startContainer,range.startOffset);after.selectNodeContents(editable);after.setStart(range.endContainer,range.endOffset);
 var prefix=serialize(doc,before.cloneContents()),suffix=serialize(doc,after.cloneContents()),output=convert(text,'paragraphs'),dispatch=wp.data.dispatch('core/block-editor');
 var inline=/^<p>((?:(?!<\/?p[>\s])[\s\S])*)<\/p>\n?$/.exec(output);
 if(inline&&!/<(?:h[1-6]|ul|ol|blockquote|pre|table|hr)\b/i.test(inline[1])){
  stop(e);dispatch.updateBlockAttributes(id,{content:prefix+inline[1].replace(/<br>\n/g,'<br>').replace(/\n/g,' ')+suffix});
 }else{
  var replacements=[];if(prefix)replacements.push(wp.blocks.createBlock('core/paragraph',Object.assign({},block.attributes,{content:prefix})));
  replacements.push(wp.blocks.createBlock('core/html',{content:output}));
  if(suffix)replacements.push(wp.blocks.createBlock('core/paragraph',Object.assign({},block.attributes,{content:suffix})));
  if(store.canInsertBlockType&&!store.canInsertBlockType('core/html',store.getBlockRootClientId(id)))return;
  stop(e);dispatch.replaceBlock(id,replacements);
 }
}
function attach(doc){if(!doc||seenDocs.has(doc))return;seenDocs.add(doc);doc.addEventListener('paste',onPaste,true);}
function attachTiny(editor){if(seenTiny.has(editor))return;seenTiny.add(editor);editor.on('paste',function(e){if(e.defaultPrevented)return;var node=editor.selection.getNode();if(node&&node.closest&&node.closest('pre,code'))return;var text=take(e);if(text===null)return;var html=classicHTML(text);stop(e);editor.undoManager.transact(function(){editor.insertContent(html);});editor.fire('change');},true);}
function scan(){
 attach(document);document.querySelectorAll('iframe').forEach(function(frame){try{if(frame.name==='editor-canvas'||frame.classList.contains('edit-site-visual-editor__editor-canvas'))attach(frame.contentDocument);}catch(ignore){}});
 if(window.tinymce){window.tinymce.editors.forEach(function(editor){if(editor.id==='content')attachTiny(editor);});}
}
scan();var timer=setInterval(scan,1000);window.addEventListener('pagehide',function(){clearInterval(timer);});
})();

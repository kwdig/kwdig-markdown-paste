(function(){
'use strict';
var convert=window.MPLBConverter(window.markdownit),dialog,source,preview,error,editorId='content',returnFocus;
function build(){
 if(dialog)return;
 dialog=document.createElement('dialog');dialog.className='mplb-dialog';dialog.setAttribute('aria-labelledby','mplb-title');
 dialog.innerHTML='<h2 id="mplb-title">Markdown貼り付け</h2><p>行末の半角スペース2個＋改行を &lt;br&gt; にします。通常の改行は同じ段落内、空行は段落区切りとして変換します。</p><label for="mplb-source">Markdownを貼り付けてください</label><textarea id="mplb-source" rows="12" spellcheck="false"></textarea><details><summary>変換後のHTML</summary><pre id="mplb-preview"></pre></details><p id="mplb-error" role="alert"></p><div class="mplb-actions"><button type="button" class="button mplb-cancel">キャンセル</button><button type="button" class="button button-primary mplb-insert">記事へ挿入</button></div>';
 document.body.appendChild(dialog);source=dialog.querySelector('textarea');preview=dialog.querySelector('pre');error=dialog.querySelector('#mplb-error');
 function update(){preview.textContent=convert(source.value,'paragraphs');error.textContent='';}
 source.addEventListener('input',update);
 dialog.querySelector('.mplb-cancel').addEventListener('click',function(){dialog.close();});
 dialog.addEventListener('close',function(){if(returnFocus&&returnFocus.isConnected)returnFocus.focus();});
 dialog.querySelector('.mplb-insert').addEventListener('click',function(){
  if(!source.value.trim()){error.textContent='Markdownを入力してください。';return;}
  var html=convert(source.value,'paragraphs');
  try{
   var store=window.wp&&wp.data&&wp.data.select('core/block-editor');
   if(store&&wp.data.select('core/editor')&&wp.data.select('core/editor').getCurrentPostId()){
    var blocks=wp.blocks.rawHandler({HTML:html});
    if(!blocks.length)throw new Error('変換できる内容がありません。');
    var selected=store.getSelectedBlockClientId(),root=selected?store.getBlockRootClientId(selected):undefined;
    var index=selected?store.getBlockIndex(selected,root)+1:undefined;
    wp.data.dispatch('core/block-editor').insertBlocks(blocks,index,root);
   }else{
    var tiny=window.tinymce&&tinymce.get(editorId);
    if(tiny&&!tiny.isHidden()){tiny.focus();tiny.undoManager.transact(function(){tiny.insertContent(html);});tiny.fire('change');}
    else {var text=document.getElementById(editorId);if(!text||text.tagName!=='TEXTAREA')throw new Error('本文エディターが見つかりません。');var start=text.selectionStart,end=text.selectionEnd;text.setRangeText(html,start,end,'end');text.dispatchEvent(new Event('input',{bubbles:true}));text.dispatchEvent(new Event('change',{bubbles:true}));}
   }
   source.value='';preview.textContent='';dialog.close();
  }catch(e){error.textContent='挿入できませんでした：'+e.message;}
 });
}
window.MPLBOpen=function(id){build();editorId=id||window.wpActiveEditor||'content';returnFocus=document.activeElement;dialog.showModal();source.focus();};
document.addEventListener('click',function(e){var b=e.target.closest('.mplb-open');if(b){e.preventDefault();window.MPLBOpen(b.getAttribute('data-editor'));}});
})();

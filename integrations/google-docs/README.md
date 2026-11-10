# Google Docs用Markdown標準改行アダプター（v1.0.7）

このフォルダーはGAS用の追加資料です。WordPressへZIPをインストールするだけではGASには読み込まれません。認証・投稿先・自動公開設定を含む既存のGASを置き換えるものではありません。

## 前提

Google Docs APIの文書構造からHTMLを作る既存GASに、`bodyHtml_(items, lists)`、`paragraphHtml_(p)`、`esc_(s)`がある構成を対象とします。別構成のGASへそのまま追加しても動作する保証はありません。

## 組み込み

1. 既存GASとWordPress取り込み設定をバックアップします。検証先は下書き保存に限定してください。
2. 元の`bodyHtml_(items, lists)`の関数名を`richBodyHtml_`に変更します。`documentHtml_`や表のセルから呼ぶ`bodyHtml_`は変更しません。
3. `Markdown.gs`と`MarkdownDocsAdapter.gs`をGASへ追加します。元の`bodyHtml_`を二重定義しないでください。
4. テスト文書で、通常改行・行末半角スペース2個・空行・リンクを確認します。行末スペースをtrimしないでください。
5. HTMLを受け取るWordPress側ではP、BR、見出し、リンクの許可とエスケープを維持します。Markdown標準出力に改行保護用spanは不要です。

## 出力

書式のない連続テキストをMarkdownとして処理します。通常改行は同じ段落内の空白、行末半角スペース2個以上＋改行はBR、空行は別のP段落です。ネイティブの見出し・太字・リンク・リスト・表などは既存のHTML変換処理へ渡します。生HTMLと危険なURLは実行しません。

これによりWordPressの自動段落整形を全記事で無効化する必要はありません。公開・下書きの判断、フォルダー指定、認証情報、トリガーは変更しません。Googleドキュメントのネイティブ脚注オブジェクトとは別に、`[1] [資料名](URL)`のようなMarkdown脚注リンクを扱います。

markdown-it 14.1.0はMIT（Markdown.gs先頭に全文）、独自アダプターはGPL-2.0-or-laterです。

# KwDig Markdown Paste 1.0.1

WordPressにMarkdownを貼り付ける際、通常の改行が別々の段落になるのを避けるためのプラグインです。

[リリース・インストール用ZIP](https://github.com/kwdig/kwdig-markdown-paste/releases/latest)

## 使い方
1. WordPressの「プラグイン → 新規追加 → プラグインのアップロード」で markdown-paste-linebreaks.zip をアップロードし、有効化。
2. クラシックエディターでは本文上の「Markdown貼り付け」をクリック。
   ブロックエディターでは右上の「︙」メニューから「Markdown貼り付け」を選択。
3. ダイアログにMarkdownを貼り付け、変換後のHTMLを確認して「記事へ挿入」をクリック。

通常のCtrl+Vの挙動や既存記事は変更しません。
クラシックのビジュアルエディターはカーソル位置へ挿入します。
ブロックエディターは選択したブロックの後ろへ挿入し、既存ブロックを置き換えません。
クラシックエディターのテキストタブではHTMLとして挿入します。

## 使い方のスクリーンショット

### クラシックエディター

本文上の「Markdown貼り付け」ボタンをクリックします。

![クラシックエディターのMarkdown貼り付けボタン](https://kwdig.com/wp-content/uploads/2026/10/mplb-howto-classic.png)

### ブロックエディター

右上の「︙」メニューから「Markdown貼り付け」を選択します。

![ブロックエディターのMarkdown貼り付けメニュー](https://kwdig.com/wp-content/uploads/2026/10/mplb-howto-block-menu.png)

### Markdownの貼り付けと挿入

ダイアログにMarkdownを貼り付け、「すべての改行を`<br>`にする」を選んだ状態で変換結果を確認し、「記事へ挿入」をクリックします。

![すべての改行をbrに変換する設定と変換後HTML](https://kwdig.com/wp-content/uploads/2026/10/mplb-howto-conversion.png)

詳しい操作方法は[KwDig Markdown Pasteの紹介記事](https://kwdig.com/kwdig-markdown-paste)をご覧ください。

## 改行ルール
既定：通常の改行も空行も `<br>` に変換します。空行1行は `<br>` 2個になります。
チェックを外すと、空行のみ段落の区切り（`<p>`）になります。
見出し、箇条書き、引用、リンク、太字、コード、表などはMarkdownとして変換します。
Markdown中の生HTMLは文字として表示し、実行しません。

例：
```
一行目
二行目

別の段落
```
変換後：
```html
一行目<br>
二行目<br>
<br>
別の段落
```

既定の「すべての改行を`<br>`にする」では、段落の囲みを省略します。
ブロックエディターではそのモードはカスタムHTMLブロックで挿入します。
クラシックのビジュアルエディターやWordPressの自動整形によって外側のpが補われることがあります。
通常の文章全体を包むpはWordPressの標準動作で、行ごとにpが付く問題とは区別してください。
コードブロック内の改行はそのまま維持します。

## 対応・確認範囲
WordPress 6.0以上、PHP 7.4以上。最新のChrome/Edge/Firefox/Safari（dialog対応）が必要です。
JavaScriptの構文、改行・段落・見出し・リスト・コード・HTMLエスケープ・危険なURL・改行コードの変換を検証済み。
kwdig.comのクラシック／ブロック両エディターで、専用ボタンからの実際の貼り付け・下書き保存・再読み込みを確認済み。リンク10件と表示上のbr9個を維持しました。クラシックではWordPressの自動整形により、全体を囲むpが1個付くことがあります。
フロント画面にはJavaScriptやCSSを読み込みません。外部サービスへの送信はありません。
通常のCtrl+Vを横取りせず、専用の「Markdown貼り付け」から使います。既存投稿やサイトのテーマは変更しません。

## ライセンス
プラグイン独自コード：GPL-2.0-or-later。
同梱markdown-it 14.1.0：MIT。ライセンス全文は assets/vendor/markdown-it-LICENSE.txt を参照。

1.0.1：すべての改行をbrにするモードを既定に変更。連続した空行を維持。sample.mdの番号付きリンク10件で検証。

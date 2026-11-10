=== KwDig Markdown Paste ===
Contributors: kwdig
Tags: markdown, editor, paste
Requires at least: 6.0
Requires PHP: 7.4
Stable tag: 1.0.7
License: GPL-2.0-or-later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Markdownの行末半角スペース2個を明示的改行として扱うWordPress用貼り付けプラグイン。

== Description ==
行末の半角スペース2個以上＋改行はBR、通常の改行は同じ段落内の空白、空行は別のP段落になります。
通常のCtrl+Vと専用「Markdown貼り付け」に対応。既存記事を一括変更しません。
Googleドキュメント→GASは別経路です。プラグインのインストールだけでは適用されません。同梱integrations/google-docsの組み込み方法を確認してください。

== Installation ==
管理画面「プラグイン → 新規追加 → プラグインのアップロード」でZIPを指定し、有効化します。更新後は編集画面を再読み込みしてください。

== Changelog ==
= 1.0.7 =
Markdown標準の改行仕様へ統一。行末スペース保持、通常Ctrl+V、GAS変換用資料を追加。

== Upgrade Notice ==
= 1.0.7 =
旧版のすべての改行をBRにする動作から変更されます。空行は段落区切りになります。詳細と確認範囲はREADME.mdを参照してください。

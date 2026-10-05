# A5 縦書き組版ツール

ブラウザ上でA5縦書きの組版・PDF出力ができるツール。

原作: [kanashiki1979/a5_tategaki_kumiban](https://github.com/kanashiki1979/a5_tategaki_kumiban)

## 機能

- 縦書きテキストをA5サイズでプレビュー・PDF出力
- 1段/2段組み対応
- 明朝体/ゴシック体 切替（Noto Serif JP / Noto Sans JP）
- 文字サイズ 8〜14pt
- 綴じしろ設定（ノド/両端）
- ヘッダー・フッター・ページ番号
- 左始まり（右綴じ）/ 右始まり（左綴じ）対応
- 段落頭の自動字下げ（「『（始まりは下げない）
- 縦中横（2桁数字の自動処理）

## 使い方

1. [GitHub Pages](https://seventh-heaven-gen.github.io/a5_tategaki_kumiban/a5_tategaki_kumiban.html) を開く
2. 本文を入力し、書体・サイズ等を設定
3. 「PDFで書き出す」で印刷ダイアログが開く
4. 送信先を「PDFに保存」、余白「なし」、「背景のグラフィック」オンにして保存

## Fork での変更点

- PDF保存時のファイル名がブランクだった問題を修正（ヘッダー入力値をファイル名に使用）
- プレビューとPDF出力でレンダリングが異なる問題を修正（テキスト折り返し幅を明示的に固定）


<div align="center">

# Falling Position Simulator 2025

気球 / 高高度プラットフォームの飛行（上昇→破裂→下降）着地点を予測・可視化する Web クライアント。Leaflet ベースで API から取得した飛行経路 / 着地点を地図上に表示し、パラメータ感度 (Ehime 実験モード) を同時比較できます。

👉 公開ページ (GitHub Pages): **https://wasa-rockoon.github.io/Falling-position-simulator2025/**

</div>

---

## 目次
1. 目的 / Overview
2. 主な機能 (Features)
3. デモ (Live Demo)
4. 動かし方 (Quick Start)
5. 画面と操作概要
6. パラメータ定義 (Flight Parameters)
7. Ehime 気球実験モード (Multi-Variant Sensitivity)
8. データ / 判定ロジック
9. アーキテクチャ概要
10. よくある質問 (FAQ)
11. 開発 / 貢献 (Contributing)
12. ライセンス
13. English Quick Summary

---

## 1. 目的 / Overview
高高度気球等の放球計画で「風予測と簡易物理モデル」に基づく着地点の見積もりと、不確実性（上昇・下降速度, 破裂高度の揺らぎ）が着地点分布へ与える影響を地図と数値で即時可視化することを目的としています。

## 2. 主な機能 (Features)
* 標準シナリオ: 上昇→破裂→下降の 1 本予測表示
* Ehime 実験モード: 13 バリアントを並列 API 呼び出しし着地点分布を表示
* 統計指標: 平均着地点, 最大偏差距離
* 陸 / 海 判定 (日本域 GeoJSON ポリゴン)
* マップインタラクション: ズーム / パン / マーカー詳細ポップアップ
* モバイル UI 最適化 (`predictor-mobile.css`)
* Cookie 保存: 過去入力値の再利用 (推測: `pred-cookie.js`)

## 3. デモ (Live Demo)
GitHub Pages にホストされた静的フロントエンド: 
https://wasa-rockoon.github.io/Falling-position-simulator2025/

> 注意: API（風予測 / 逆算）エンドポイントは外部サービス / 別リポジトリの `drift-api/` 想定。公開ページでは CORS / API キー制約により実行できない場合があります。

## 4. 動かし方 (Quick Start)
ローカルで静的ファイルを配信するだけで閲覧可能です (API 通信はネットワーク要件に依存)。

PowerShell 例 (Python 簡易サーバ):
```
python -m http.server 8000
```
ブラウザで: http://localhost:8000/

## 5. 画面と操作概要
1. 出発地点 / Launch 時刻などを入力
2. 予測モードを選択: 標準 or 愛媛気球実験用
3. 「予測」ボタンで API 呼び出し開始
4. マップに BASE 軌跡 / 着地点マーカー (実験モードではバリアント群) が追加
5. 情報パネルで進行状況・統計を確認

## 6. パラメータ定義 (Flight Parameters)
| パラメータ | 意味 | 単位 | 備考 |
|------------|------|------|------|
| Ascent Rate | 上昇平均速度 | m/s | 破裂高度到達まで一定仮定 |
| Descent Rate | 下降平均速度 | m/s | パラシュート展開後一定仮定 |
| Burst Altitude | 破裂高度 | m | 上昇フェーズ終了高度 |
| Launch Time | 離陸時刻 | UTC/JST | 風予測参照時間 |
| Start Lat/Lon | 離陸緯度経度 | deg | 入力地点 |

## 7. Ehime 気球実験モード (Multi-Variant Sensitivity)
以下、既存説明を拡張して掲載 (詳細は下部セクション)。

...（この節の下に既存の Ehime モード詳細原文が続きます）...

## 8. データ / 判定ロジック
* 風 / 予測: 外部 API (別システム) から取得（本リポジトリ内には実データなし）
* 陸海判定: `data/land_japan_raw.geojson` を用いた Point-in-Polygon
* カラーリング: `js/colour-map.js` によるカテゴリ分配 (推測)

## 9. アーキテクチャ概要
| 層 | 技術 | 役割 |
|----|------|------|
| UI | HTML / CSS (Bootstrap / jQuery UI) | フォーム・ダイアログ・レイアウト |
| Map | Leaflet | タイル, マーカー, ポップアップ表示 |
| JS ロジック | `js/pred/*.js` | モード選択, API 呼び出し, 結果描画 |
| 補助 | jQuery, moment.js | DOM 操作 / 日時処理 |
| GeoData | GeoJSON (日本陸域) | 陸海判定 |

主要ファイル (推測):
* `pred-new.js`: 新 UI / Ehime モードロジック
* `pred-map.js`: 地図初期化と描画
* `pred-ui.js`: 入力フォーム連動
* `pred-event.js`: イベントハンドラ集中管理
* `pred-config.js`: 定数 / 設定

## 10. よくある質問 (FAQ)
Q. なぜ 13 バリアント?  
A. 基準 + (単一パラメータ変動 6) + (2 パラメータ同符号組合せ 6) = 13。計算負荷と視認性のバランス。

Q. 平均 / 偏差を円で表示しない理由?  
A. ビジュアル混雑を避け、数値集中による比較を優先。必要なら fork で再追加可能。

Q. 海外放球に使える?  
A. 陸海判定ポリゴンを差し替えれば可能。風予測 API 側の全球対応が前提。

## 11. 開発 / 貢献 (Contributing)
Issue / PR 歓迎。バグ報告時は:
* 再現手順
* 入力パラメータ (上昇/下降/破裂)
* ブラウザ種別 / コンソールログ
を記載してください。

## 12. ライセンス
本プロジェクトは GPLv3 ライセンスです。詳細は `LICENSE` を参照してください。

## 13. English Quick Summary
Falling Position Simulator 2025 visualizes predicted balloon flight (ascent → burst → descent) and, in Ehime mode, runs 13 parameter variants in parallel to illustrate landing dispersion. Land/Sea classification uses a Japan landmask GeoJSON. UI: Leaflet + jQuery. Licensed under GPLv3. Live demo: https://wasa-rockoon.github.io/Falling-position-simulator2025/

---

## 愛媛気球実験モード (Ehime Balloon Experiment Mode)

本フォークには観測実験向けの「愛媛気球実験用」予測モードが追加されています。標準プロファイル（上昇→破裂→下降）を基準に、主要パラメータの許容幅を同時に複数バリエーションで API へ投げ、着地点の分布と統計値を可視化します。

### 許容幅 / マージン
* 上昇速度 (Ascent Rate): 基準値 ±1 m/s
* 下降速度 (Descent Rate): 基準値 ±3 m/s
* 破裂高度 (Burst Altitude): +10% / -20%

### 生成される 13 バリアントとラベル
| ラベル | 変更内容 |
|--------|----------|
| BASE   | 基準 (変更なし) |
| ASC- / ASC+ | 上昇 -1 / +1 m/s |
| DES- / DES+ | 下降 -3 / +3 m/s |
| BURST- / BURST+ | 破裂高度 -20% / +10% |
| A-D- / A+D+ | 上昇±1 & 下降±3 (同符号) |
| A-B- / A+B+ | 上昇±1 & 破裂高度 -20% / +10% |
| D-B- / D+B+ | 下降±3 & 破裂高度 -20% / +10% |

（合計 1 + 12 = 13 バリアント）

### 使い方
1. 予測タイプで「愛媛気球実験用」を選択。
2. 上昇速度 / 下降速度 / 破裂高度（標準プロファイル）を入力。
3. 「予測実行」を押すと 13 件の API リクエストが並列実行され、着地点が順次表示。
4. 情報行に以下が更新されます:
	* 上昇/下降 許容範囲表示
	* 破裂高度マージン (+10% / -20%)
	* 完了数 / 総数
	* 平均着地点 (全バリアント平均緯度経度)
	* 最大偏差 (平均地点から最も遠い着地点までの距離 km)

### マップ表示の意味
* カラフルな小円: 各バリアントの着地点（BASE はやや大きい）
* BASE の軌跡: 標準条件の飛行経路
* 平均着地点 / 最大偏差: いずれも現在はマップ図形を表示せず、パネル内数値のみ表示 (平均緯度経度, 最大偏差 km)。以前存在した青い平均マーカー・青/オレンジ破線円は削除しました。

### ポップアップ
任意の着地点マーカーをクリックすると:
* 変更: 上昇/下降/破裂高度が基準からどの方向に変化したか（例: 上昇+1 m/s → 「上昇+1 m/s」）
* 条件値（上昇速度, 下降速度, 破裂高度）
* 着地点座標
* 離陸時刻 (JST)

BASE のポップアップでは「変更: なし (基準)」と表示されます。

### 結果の解釈
* 平均着地点: 統計的中心（単純平均）。現状は数値のみ (マップ上マーカー非表示)。
* 最大偏差: 平均地点から最遠バリアント着地点までの距離 (km)。視覚円は表示せず数値のみ。
* 破裂高度影響: 破裂高度を含むバリアント (ラベルに B を含む) のばらつきは現在個別円を描かず、必要なら CSV へ出力後オフライン解析してください。

### 陸海判定 (Land / Sea Classification)
Ehime バリエーション表の最終列は各バリアントの予測着地点が「陸」か「海」かを表示します。

* 判定データ: `data/land_japan_raw.geojson` (日本付近切り出し陸地ポリゴン) による単純 Point-in-Polygon 判定。
* 表示: 「陸」= 通常色, 「海」= 水色強調, 読み込み中は「判定中」。
* 制限: ポリゴン外の遠方 (海上含む) は "海" と判定される可能性が高い。微小島嶼など低解像度により陸を海と誤判定することがあります。厳密用途では高解像度海岸線や別ソースで再確認してください。

### English Summary
The "Ehime Balloon Experiment" mode runs 13 parameter variants (ascent ±1 m/s, descent ±3 m/s, burst altitude +10% / -20%, and pairwise combos) in parallel and plots each landing point (color-coded). The panel lists: completed/total count, mean landing coordinates, and maximum deviation (km). Former visual overlays (mean marker and dispersion / burst dashed circles) were removed; only numeric summaries remain. A Land/Sea column classifies each landing (simple polygon test over a clipped Japan land mask). Popups show parameter deltas vs BASE.




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



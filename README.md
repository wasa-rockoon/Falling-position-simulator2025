
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
* 青い小円＋薄い円形マーカー: 平均着地点
* 青の破線円: 全バリアント着地点の最大偏差半径
* オレンジ破線円: 破裂高度変化 (BURST± / 含 B のラベル) のみを含むサブセットでの最大偏差半径

### ポップアップ
任意の着地点マーカーをクリックすると:
* 変更: 上昇/下降/破裂高度が基準からどの方向に変化したか（例: 上昇+1 m/s → 「上昇+1 m/s」）
* 条件値（上昇速度, 下降速度, 破裂高度）
* 着地点座標
* 離陸時刻 (JST)

BASE のポップアップでは「変更: なし (基準)」と表示されます。

### 結果の解釈
* 平均着地点: 統計的中心（単純平均）。
* 最大偏差: 探索・回収エリアの外接的な目安（安全側に余裕を持たせることを推奨）。
* オレンジ破線円: 破裂高度の不確かさが着地点に与える影響を個別に把握する指標。

### English Summary
The "Ehime Balloon Experiment" mode runs 13 parameter variants (ascent ±1 m/s, descent ±3 m/s, burst altitude +10% / -20%, and their pairwise combinations) in parallel, plots all landing points, and shows mean landing position plus dispersion circles (overall max deviation and burst-only subset). Popups list parameter deltas relative to the base case.



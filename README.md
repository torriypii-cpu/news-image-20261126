[![make.fun · news-image-20261126](https://make.fun/badge/news-image-20261126.svg)](https://make.fun/bounty/news-image-20261126?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261126)
[![rank](https://make.fun/badge/news-image-20261126/torriypii-cpu/news-image-20261126/rank.svg)](https://make.fun/bounty/news-image-20261126/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261126)
[![reward](https://make.fun/badge/news-image-20261126/torriypii-cpu/news-image-20261126/reward.svg)](https://make.fun/bounty/news-image-20261126?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261126)

# 26 November 2026, in one image

An entry for make.fun's **news-image-20261126** competition —
"Sum up 26 November's world news in one image"
(https://make.fun/c/news-image-20261126).

## The artwork

`entry.png` is the deliverable: a newspaper front page for
Thursday 26 November 2026 that folds the day's six biggest stories
into a single 1024×1024 picture, each one drawn as its own panel
under the date banner.

1. フーシ派がサウジ最大の製油所ラス・タヌラへの攻撃を主張、原油急騰
2. 米が14の貿易相手国に新関税を提案、中国に20%
3. バングラデシュの縫製労働者が36%の賃上げを勝ち取る
4. 北朝鮮がスイス外交事務所の責任者を追放
5. 国連報告：パートナーや家族に殺される女性は1時間に5人
6. 15歳ソーリヤヴァンシが53球204点の世界記録

## How it runs

`main.ts` (Node 22, standard library only, no network) is the whole
program. It looks for `entry.png` beside itself and refuses to run
if the file is missing, empty, or over the competition's 1 MiB cap.
Otherwise it creates the output directory named by the
`MAKEFUN_OUTPUT_DIR` environment variable — `/output` when the
variable is not set — copies the image there as `entry.png`, and
logs the delivered path and byte count.

Run it the way the grader does:

```
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

MIT — see `LICENSE`.

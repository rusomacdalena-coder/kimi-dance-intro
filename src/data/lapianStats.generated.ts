// 由 scripts/build-data.mjs 生成，禁止手改；数字全部来自投放区原始 breakdown.csv。
export const lapianAnnotated = {
  "dramaCount": 6,
  "totalMinutes": 544,
  "totalShots": 13087,
  "avgShotSec": 2.5,
  "medianShotsPerMin": 23,
  "windowCount": 541,
  "le2Share": 45.5,
  "le5Share": 93.2,
  "closeupShare": 52.4
} as const

export const lapianAggregate = {
  "updatedAt": "2026-09-03",
  "dramaCount": 4,
  "totalMinutes": 511,
  "totalShots": 12382,
  "avgShotSec": 2.48,
  "medianShotsPerMin": 23,
  "windowCount": 509,
  "le2Share": 46,
  "le5Share": 93.4,
  "closeupShare": 52.4,
  "narrativeTop": [
    {
      "name": "铺垫",
      "count": 4100,
      "share": 33.1
    },
    {
      "name": "冲突",
      "count": 2823,
      "share": 22.8
    },
    {
      "name": "过渡",
      "count": 2161,
      "share": 17.5
    },
    {
      "name": "转折",
      "count": 735,
      "share": 5.9
    },
    {
      "name": "高潮",
      "count": 471,
      "share": 3.8
    },
    {
      "name": "收束",
      "count": 376,
      "share": 3
    }
  ]
} as const

export const lapianTypeRows = [
  {
    "type": "真人",
    "titles": [
      "时光和你都很美"
    ],
    "dramaCount": 1,
    "totalMinutes": 164,
    "totalShots": 3443,
    "avgShotSec": 2.86,
    "medianShotsPerMin": 21,
    "windowCount": 163,
    "le2Share": 33.4,
    "le5Share": 91.9,
    "closeupShare": 58.3
  },
  {
    "type": "AI 漫剧",
    "titles": [
      "凡人百世书",
      "日薪一万，我在博物馆值夜班"
    ],
    "dramaCount": 2,
    "totalMinutes": 221,
    "totalShots": 5828,
    "avgShotSec": 2.28,
    "medianShotsPerMin": 25,
    "windowCount": 221,
    "le2Share": 52.5,
    "le5Share": 94.5,
    "closeupShare": 51.4
  },
  {
    "type": "3D 动漫",
    "titles": [
      "末世：从搬空全球仓库开始第一季"
    ],
    "dramaCount": 1,
    "totalMinutes": 126,
    "totalShots": 3111,
    "avgShotSec": 2.43,
    "medianShotsPerMin": 24,
    "windowCount": 125,
    "le2Share": 47.5,
    "le5Share": 93.1,
    "closeupShare": 47.6
  }
] as const

export const lapianDramas = [
  {
    "title": "时光和你都很美",
    "slug": "shi-guang-he-ni-dou-hen-mei",
    "type": "真人",
    "typeBasis": "公开报道 + 抽帧",
    "aspect": "竖屏 720×1280",
    "inAggregate": true,
    "note": "",
    "evidence": [
      {
        "label": "搜狐报道（横店摄制真人短剧）",
        "url": "https://www.sohu.com/a/1037271510_532230"
      }
    ],
    "shots": 3443,
    "minutes": 163.9,
    "avgShotSec": 2.86,
    "shotsPerMinMedian": 21,
    "windowCount": 163,
    "le2Share": 33.4,
    "le5Share": 91.9,
    "closeupShare": 58.3,
    "firstHookSec": 0,
    "narrativeTop": [
      [
        "铺垫",
        1149
      ],
      [
        "过渡",
        859
      ],
      [
        "冲突",
        633
      ],
      [
        "转折",
        145
      ],
      [
        "收束",
        116
      ]
    ],
    "shotScale": [
      [
        "近景",
        1544
      ],
      [
        "中景",
        674
      ],
      [
        "特写",
        463
      ],
      [
        "[未标注]",
        375
      ],
      [
        "全景",
        312
      ],
      [
        "远景",
        74
      ],
      [
        "中全景",
        1
      ]
    ]
  },
  {
    "title": "凡人百世书",
    "slug": "fan-ren-bai-shi-shu",
    "type": "AI 漫剧",
    "typeBasis": "公开页面 + 抽帧",
    "aspect": "横屏 1280×720",
    "inAggregate": true,
    "note": "",
    "evidence": [
      {
        "label": "短剧百科（AI漫剧）",
        "url": "https://www.duanjubaike.net/manju/info-7670854490097994814.html"
      },
      {
        "label": "百度百科",
        "url": "https://baike.baidu.com/item/%E5%87%A1%E4%BA%BA%E7%99%BE%E4%B8%96%E4%B9%A6/67910935"
      }
    ],
    "shots": 3221,
    "minutes": 135.1,
    "avgShotSec": 2.52,
    "shotsPerMinMedian": 23,
    "windowCount": 135,
    "le2Share": 44,
    "le5Share": 92.8,
    "closeupShare": 48.1,
    "firstHookSec": 324,
    "narrativeTop": [
      [
        "铺垫",
        1067
      ],
      [
        "冲突",
        659
      ],
      [
        "过渡",
        534
      ],
      [
        "转折",
        233
      ],
      [
        "高潮",
        173
      ]
    ],
    "shotScale": [
      [
        "近景",
        809
      ],
      [
        "特写",
        739
      ],
      [
        "中景",
        729
      ],
      [
        "全景",
        472
      ],
      [
        "[未标注]",
        275
      ],
      [
        "远景",
        188
      ],
      [
        "特寫",
        9
      ]
    ]
  },
  {
    "title": "末世：从搬空全球仓库开始第一季",
    "slug": "mo-shi-cong-ban-kong-quan-qiu-cang-ku-kai-shi-di-yi-ji",
    "type": "3D 动漫",
    "typeBasis": "公开片库（132 集）+ 抽帧",
    "aspect": "竖屏 720×1280",
    "inAggregate": true,
    "note": "",
    "evidence": [],
    "shots": 3111,
    "minutes": 125.8,
    "avgShotSec": 2.43,
    "shotsPerMinMedian": 24,
    "windowCount": 125,
    "le2Share": 47.5,
    "le5Share": 93.1,
    "closeupShare": 47.6,
    "firstHookSec": 5,
    "narrativeTop": [
      [
        "铺垫",
        989
      ],
      [
        "冲突",
        824
      ],
      [
        "过渡",
        415
      ],
      [
        "转折",
        158
      ],
      [
        "高潮",
        120
      ]
    ],
    "shotScale": [
      [
        "特写",
        779
      ],
      [
        "近景",
        703
      ],
      [
        "中景",
        667
      ],
      [
        "全景",
        428
      ],
      [
        "[未标注]",
        400
      ],
      [
        "远景",
        133
      ],
      [
        "俯拍",
        1
      ]
    ]
  },
  {
    "title": "日薪一万，我在博物馆值夜班",
    "slug": "ri-xin-yi-wan-wo-zai-bo-wu-guan-zhi-ye-ban",
    "type": "AI 漫剧",
    "typeBasis": "公开页面 + 抽帧",
    "aspect": "横屏 1280×720",
    "inAggregate": true,
    "note": "",
    "evidence": [
      {
        "label": "新浪（红果 AI 漫剧榜单）",
        "url": "https://www.sina.cn/news/detail/5298437427824619.html"
      },
      {
        "label": "爱奇艺",
        "url": "https://www.iqiyi.com/a_cuba3wif29.html"
      }
    ],
    "shots": 2607,
    "minutes": 86,
    "avgShotSec": 1.98,
    "shotsPerMinMedian": 30,
    "windowCount": 86,
    "le2Share": 63.1,
    "le5Share": 96.6,
    "closeupShare": 55.5,
    "firstHookSec": 0,
    "narrativeTop": [
      [
        "铺垫",
        895
      ],
      [
        "冲突",
        707
      ],
      [
        "过渡",
        353
      ],
      [
        "转折",
        199
      ],
      [
        "钩子",
        107
      ]
    ],
    "shotScale": [
      [
        "特写",
        831
      ],
      [
        "近景",
        616
      ],
      [
        "中景",
        466
      ],
      [
        "全景",
        404
      ],
      [
        "[未标注]",
        175
      ],
      [
        "远景",
        115
      ]
    ]
  },
  {
    "title": "硬核包子铺",
    "slug": "ying-he-bao-zi-pu",
    "type": "AI 漫剧",
    "typeBasis": "抽帧判断（未找到公开页）",
    "aspect": "竖屏 720×1280",
    "inAggregate": false,
    "note": "片段 21.6 分",
    "evidence": [],
    "shots": 493,
    "minutes": 21.6,
    "avgShotSec": 2.63,
    "shotsPerMinMedian": 23,
    "windowCount": 21,
    "le2Share": 38.9,
    "le5Share": 92.9,
    "closeupShare": 55.8,
    "firstHookSec": 266,
    "narrativeTop": [
      [
        "冲突",
        211
      ],
      [
        "铺垫",
        100
      ],
      [
        "过渡",
        65
      ],
      [
        "转折",
        38
      ],
      [
        "收束",
        18
      ]
    ],
    "shotScale": [
      [
        "中景",
        142
      ],
      [
        "特写",
        142
      ],
      [
        "近景",
        133
      ],
      [
        "全景",
        51
      ],
      [
        "[未标注]",
        18
      ],
      [
        "远景",
        7
      ]
    ]
  },
  {
    "title": "大明，李景隆的别样人生",
    "slug": "da-ming-li-jing-long-de-bie-yang-ren-sheng",
    "type": "AI 漫剧",
    "typeBasis": "公开页面 + 抽帧",
    "aspect": "横屏 1280×720",
    "inAggregate": false,
    "note": "片段约前 12 分 · 早期版本产出",
    "evidence": [
      {
        "label": "bilibili（标 AI短剧）",
        "url": "https://www.bilibili.com/video/BV1vhgf6pEz9/"
      }
    ],
    "shots": 212,
    "minutes": 11.9,
    "avgShotSec": 3.38,
    "shotsPerMinMedian": 18,
    "windowCount": 11,
    "le2Share": 32.1,
    "le5Share": 80.2,
    "closeupShare": 49.1,
    "firstHookSec": null,
    "narrativeTop": [
      [
        "冲突引入",
        22
      ],
      [
        "过渡",
        18
      ],
      [
        "铺垫",
        16
      ],
      [
        "信息传递",
        16
      ],
      [
        "发展",
        12
      ]
    ],
    "shotScale": [
      [
        "中景",
        101
      ],
      [
        "特写",
        57
      ],
      [
        "近景",
        47
      ],
      [
        "远景",
        7
      ]
    ]
  }
] as const

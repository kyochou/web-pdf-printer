# @web-printer/juejin

[掘金 juejin.cn](https://juejin.cn/)

## Installation
```bash
pnpm i @web-printer/juejin
```

```ts
import { Printer } from "@web-printer/core"
import juejin from "@web-printer/juejin"

new Printer()
  .use(
    juejin({
      url: "https://juejin.cn/?sort=weekly_hottest",
      maxPages: 10
    })
  )
  .print("掘金一周热门")
```

## Options

```ts
{
  /**
   * Url of a article list page
   * @example
   * - "https://juejin.cn/frontend"
   * - "https://juejin.cn/tag/JavaScript"
   * - "https://juejin.cn/column/6960944886115729422"
   */
  url: string
  /**
   * When the article list page has a lot of articles, you can set maxPages to limit, especially endless loading.
   * @default Infinity
   */
  maxPages?: number
  /**
   * Interval of each scroll
   * @default 500
   * @unit ms
   */
  interval?: number
}
```

## License

<a href="https://github.com/ourongxing/web-printer/blob/main/LICENSE">MIT</a> <span>©</span> <a href="https://github.com/ourongxing"><img width=15 src="https://avatars.githubusercontent.com/u/48356807?v=4"></a>

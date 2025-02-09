import type { MaybeMultiURL, PageInfo, Plugin } from "@web-printer/core"
import { evaluateWaitForImgLoad } from "@web-printer/core"

export default function (options: {
  /**
   * Url of website page generated by mdbook, this page must have sidebar outline
   * @example
   * - "https://vitepress.vuejs.org/guide/"
   * - "https://vuejs.org/guide/introduction.html"
   * - {
   *    Guide: "https://vuejs.org/guide/introduction.html",
   *    API: "https://vuejs.org/api/application.html"
   *  }
   */
  url: MaybeMultiURL
}): Plugin {
  const { url } = options
  if (!url) throw new Error("url is required")
  return {
    async fetchPagesInfo({ context }) {
      async function fecth(url: string, group?: string) {
        await page.goto(url)
        // 添加 console 监听器
        page.on("console", msg => {
          const args = msg.args()
          Promise.all(args.map(arg => arg.jsonValue())).then(consoleArgs =>
            console.log("playwright log:", ...consoleArgs)
          )
        })

        // await page.screenshot({
        //   path: `./tmp/${url.replace(/[^\w\s]/gi, "-")}.png`
        // })
        const data = JSON.parse(
          await page.evaluate(`
(() => {
  const ret = []
  function d(k, groups) {
    k.forEach((level0) => {
      const subgroup = level0.querySelector(":scope > .title .title-text")?.innerText
      if (subgroup) {
        console.log("subgroup", subgroup)
        const children = level0.querySelectorAll(":scope > .link")
        if (children.length) d(children, [...groups, subgroup].filter(Boolean))
        return
      }

      const title = level0.querySelector(":scope > .link-text")?.innerText
      const url = level0.href
      console.log("page info", title, url)
      if (url)
        ret.push({
          title,
          url,
          collapsed: false,
          selfGroup: false,
          groups
        })
    })
  }
  d(document.querySelectorAll(".VPSidebarGroup"), [])
  return JSON.stringify(ret.filter(k => k.title))
})()
  `)
        ) as PageInfo[]
        if (group) {
          data.forEach(k => {
            if (k.groups) k.groups.unshift(group)
            else k.groups = [group]
          })
        }
        return data
      }
      const page = await context.newPage()
      const pagesInfo = []
      if (typeof url === "string") {
        pagesInfo.push(...(await fecth(url)))
      } else {
        for (const [k, v] of Object.entries(url)) {
          pagesInfo.push(...(await fecth(v, k)))
        }
      }
      await page.close()
      return pagesInfo
    },
    async onPageLoaded({ page }) {
      await evaluateWaitForImgLoad(page, "main img")
    },
    injectStyle() {
      const style = `
    .vueschool,
    .vue-mastery-link,
    .edit-link,
    .vuejobs-wrapper {
        display: none !important;
    }

    [class*=language-] code {
        padding: 0 48px!important;
    }
    `
      return {
        style,
        contentSelector: "main",
        avoidBreakSelector: ".custom-block"
      }
    }
  }
}

import { Printer } from "@web-printer/core"
// import plugin you have installed
import vitepress from "@web-printer/vitepress"

// Will open a browser to login if you need.
// new Printer().login(url)

new Printer()
  .use(
    vitepress({
      url: {
        Guide: "https://doc.vben.pro/guide/introduction/vben.html",
        Components: "https://doc.vben.pro/components/introduction.html"
      }
    })
  )
  .print("Vben5 Components")

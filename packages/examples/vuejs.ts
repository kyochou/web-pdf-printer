import { Printer } from "@web-printer/core"
// import plugin you have installed
import vuejs from "@web-printer/vuejs"

// Will open a browser to login if you need.
// new Printer().login(url)

new Printer()
  .use(
    vuejs({
      url: {
        Guide: "https://cn.vuejs.org/guide/introduction.html",
        API: "https://cn.vuejs.org/api/application.html"
      }
    })
  )
  .print("Vue3 Documentation")

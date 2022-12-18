import type { BrowserContext, Page } from "playwright"
import type { PrinterPrintOption } from "./options"
import type { MaybePromise } from "./utils"
export * from "./options"
export * from "./utils"

type BaseInfo = {
  title: string
  groups?: (
    | {
        name: string
        collapsed?: boolean
      }
    | string
  )[]
  /**
   * When the item is a group and is a link
   */
  selfGroup?: boolean

  collapsed?: boolean
}

export type PageInfoWithoutIndex = {
  url: string
} & BaseInfo

export type PageInfo = {
  index: number
  url: string
} & BaseInfo

export type PDFBuffer = {
  buffer: ArrayBuffer
} & PageInfo

export type OutlineItem = {
  num: number
  url: string
} & BaseInfo

export type PageFilter = (
  parms: {
    length: number
  } & PageInfo
) => boolean

export interface Plugin {
  /**
   * Used to fetch a list of page url and title, need return the list.
   */
  fetchPagesInfo(params: {
    context: BrowserContext
  }): MaybePromise<PageInfoWithoutIndex[]>
  /**
   * Used to remove distracting elements and make web pages more PDF-friendly.
   */
  injectStyle?(params: {
    url: string
    printOption: PrinterPrintOption
  }): MaybePromise<{
    style?: string
    /**
     * if given, printer will only print the content element.
     */
    contentSelector?: string
    /**
     * set top margin for it only.
     * @requires PrinterPrintOption.continuous = true
     * @default the first selector of contentSelector || "body"
     */
    titleSelector?: string
    /**
     * Avoid page break
     * @default "pre,blockquote,tbody tr"
     * @requires PrinterPrintOption.continuous = false
     */
    avoidBreakSelector?: string
    /**
     * Used for hash locating. If given, Printer could replace the hash of url to PDF position.
     * @example "h2, h3" These elements generally have IDs for locating.
     * @requires PrinterPrintOption.replaceLink = true
     */
    hashIDSelector?: string
  }>
  /**
   * Run after page loaded.
   */
  onPageLoaded?(params: {
    page: Page
    pageInfo: PageInfo
    printOption: PrinterPrintOption
  }): MaybePromise<void>
  /**
   * Run before page will be printed.
   */
  onPageWillPrint?(params: {
    page: Page
    pageInfo: PageInfo
    printOption: PrinterPrintOption
  }): MaybePromise<void>
}

export type MaybeMultiURL =
  | {
      [k: string]: string
    }
  | string

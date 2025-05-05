"use client"

import { Extension } from "@tiptap/core"

export interface TableCellAttributesOptions {
  backgroundColor: {
    default: null
  }
  textColor: {
    default: null
  }
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    tableCellAttributes: {
      /**
       * Set table cell background color
       */
      setCellBackgroundColor: (color: string) => ReturnType
      /**
       * Set table cell text color
       */
      setCellTextColor: (color: string) => ReturnType
    }
  }
}

export const TableCellAttributes = Extension.create<TableCellAttributesOptions>({
  name: "tableCellAttributes",

  addOptions() {
    return {
      backgroundColor: {
        default: null,
      },
      textColor: {
        default: null,
      },
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: ["tableCell", "tableHeader"],
        attributes: {
          backgroundColor: {
            default: this.options.backgroundColor.default,
            parseHTML: (element) =>
              element.getAttribute("data-background-color") || this.options.backgroundColor.default,
            renderHTML: (attributes) => {
              if (!attributes.backgroundColor) {
                return {}
              }

              return {
                "data-background-color": attributes.backgroundColor,
                style: `background-color: ${attributes.backgroundColor}`,
              }
            },
          },
          textColor: {
            default: this.options.textColor.default,
            parseHTML: (element) => element.getAttribute("data-text-color") || this.options.textColor.default,
            renderHTML: (attributes) => {
              if (!attributes.textColor) {
                return {}
              }

              return {
                "data-text-color": attributes.textColor,
                style: `color: ${attributes.textColor}`,
              }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setCellBackgroundColor:
        (color) =>
        ({ chain }) => {
          return chain()
            .updateAttributes("tableCell", { backgroundColor: color })
            .updateAttributes("tableHeader", { backgroundColor: color })
            .run()
        },
      setCellTextColor:
        (color) =>
        ({ chain }) => {
          return chain()
            .updateAttributes("tableCell", { textColor: color })
            .updateAttributes("tableHeader", { textColor: color })
            .run()
        },
    }
  },
})

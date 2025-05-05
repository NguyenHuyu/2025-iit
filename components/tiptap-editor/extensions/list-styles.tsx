"use client"

import { Extension } from "@tiptap/core"

export interface ListStyleOptions {
  types: string[]
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    listStyle: {
      /**
       * Set the list style type
       */
      setListStyle: (listStyleType: string) => ReturnType
      /**
       * Set the list style type for bullet lists
       */
      setBulletListStyle: (listStyleType: string) => ReturnType
      /**
       * Set the list style type for ordered lists
       */
      setOrderedListStyle: (listStyleType: string) => ReturnType
    }
  }
}

export const ListStyle = Extension.create<ListStyleOptions>({
  name: "listStyle",

  addOptions() {
    return {
      types: ["bulletList", "orderedList"],
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          listStyleType: {
            default: null,
            parseHTML: (element) => element.style.listStyleType || null,
            renderHTML: (attributes) => {
              if (!attributes.listStyleType) {
                return {}
              }

              return {
                style: `list-style-type: ${attributes.listStyleType}`,
              }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setListStyle:
        (listStyleType) =>
        ({ commands }) => {
          return this.options.types.every((type) => commands.updateAttributes(type, { listStyleType }))
        },

      setBulletListStyle:
        (listStyleType) =>
        ({ commands }) => {
          return commands.updateAttributes("bulletList", { listStyleType })
        },

      setOrderedListStyle:
        (listStyleType) =>
        ({ commands }) => {
          return commands.updateAttributes("orderedList", { listStyleType })
        },
    }
  },
})

"use client"

import { Extension } from "@tiptap/core"
import { Plugin, PluginKey } from "@tiptap/pm/state"
import { DecorationSet } from "@tiptap/pm/view"
import tippy from "tippy.js"
import { useCallback, useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

// Categorías de emojis
const emojiCategories = [
  {
    name: "Smileys & People",
    emojis: [
      "😀",
      "😃",
      "😄",
      "😁",
      "😆",
      "😅",
      "🤣",
      "😂",
      "🙂",
      "🙃",
      "😉",
      "😊",
      "😇",
      "🥰",
      "😍",
      "🤩",
      "😘",
      "😗",
      "😚",
      "😙",
      "😋",
      "😛",
      "😜",
      "🤪",
      "😝",
      "🤑",
      "🤗",
      "🤭",
      "🤫",
      "🤔",
      "🤐",
      "🤨",
      "😐",
      "😑",
      "😶",
      "😏",
      "😒",
      "🙄",
      "😬",
      "🤥",
      "😌",
      "😔",
      "😪",
      "🤤",
      "😴",
      "😷",
      "🤒",
      "🤕",
    ],
  },
  {
    name: "Animals & Nature",
    emojis: [
      "🐶",
      "🐱",
      "🐭",
      "🐹",
      "🐰",
      "🦊",
      "🐻",
      "🐼",
      "🐨",
      "🐯",
      "🦁",
      "🐮",
      "🐷",
      "🐸",
      "🐵",
      "🐔",
      "🐧",
      "🐦",
      "🐤",
      "🦆",
      "🦅",
      "🦉",
      "🦇",
      "🐺",
      "🐗",
      "🐴",
      "🦄",
      "🐝",
      "🐛",
      "🦋",
      "🐌",
      "🐞",
      "🐜",
      "🦟",
      "🦗",
      "🕷️",
      "🦂",
      "🐢",
      "🐍",
      "🦎",
      "🦖",
      "🦕",
      "🐙",
      "🦑",
      "🦐",
      "🦞",
      "🦀",
      "🐡",
    ],
  },
  {
    name: "Food & Drink",
    emojis: [
      "🍎",
      "🍐",
      "🍊",
      "🍋",
      "🍌",
      "🍉",
      "🍇",
      "🍓",
      "🍈",
      "🍒",
      "🍑",
      "🥭",
      "🍍",
      "🥥",
      "🥝",
      "🍅",
      "🍆",
      "🥑",
      "🥦",
      "🥬",
      "🥒",
      "🌶️",
      "🌽",
      "🥕",
      "🧄",
      "🧅",
      "🥔",
      "🍠",
      "🥐",
      "🥯",
      "🍞",
      "🥖",
      "🥨",
      "🧀",
      "🥚",
      "🍳",
      "🧈",
      "🥞",
      "🧇",
      "🥓",
      "🥩",
      "🍗",
      "🍖",
      "🦴",
      "🌭",
      "🍔",
      "🍟",
      "🍕",
    ],
  },
  {
    name: "Activities",
    emojis: [
      "⚽",
      "🏀",
      "🏈",
      "⚾",
      "🥎",
      "🎾",
      "🏐",
      "🏉",
      "🥏",
      "🎱",
      "🪀",
      "🏓",
      "🏸",
      "🏒",
      "🏑",
      "🥍",
      "🏏",
      "🪃",
      "🥅",
      "⛳",
      "🪁",
      "🏹",
      "🎣",
      "🤿",
      "🥊",
      "🥋",
      "🎽",
      "🛹",
      "🛼",
      "🛷",
      "⛸️",
      "🥌",
      "🎿",
      "⛷️",
      "🏂",
      "🪂",
      "🏋️",
      "🤼",
      "🤸",
      "🤺",
      "⛹️",
      "🤾",
      "🏌️",
      "🏇",
      "🧘",
      "🏄",
      "🏊",
      "🤽",
    ],
  },
  {
    name: "Travel & Places",
    emojis: [
      "🚗",
      "🚕",
      "🚙",
      "🚌",
      "🚎",
      "🏎️",
      "🚓",
      "🚑",
      "🚒",
      "🚐",
      "🛻",
      "🚚",
      "🚛",
      "🚜",
      "🛵",
      "🏍️",
      "🛺",
      "🚲",
      "🛴",
      "🛹",
      "🚏",
      "🚦",
      "🚥",
      "🗺️",
      "🗿",
      "🗽",
      "🗼",
      "🏰",
      "🏯",
      "🏟️",
      "🎡",
      "🎢",
      "🎠",
      "⛲",
      "⛱️",
      "🏖️",
      "🏝️",
      "🏜️",
      "🌋",
      "⛰️",
      "🏔️",
      "🗻",
      "🏕️",
      "⛺",
      "🏠",
      "🏡",
      "🏘️",
      "🏚️",
    ],
  },
  {
    name: "Objects",
    emojis: [
      "⌚",
      "📱",
      "📲",
      "💻",
      "⌨️",
      "🖥️",
      "🖨️",
      "🖱️",
      "🖲️",
      "🕹️",
      "🗜️",
      "💽",
      "💾",
      "💿",
      "📀",
      "📼",
      "📷",
      "📸",
      "📹",
      "🎥",
      "📽️",
      "🎞️",
      "📞",
      "☎️",
      "📟",
      "📠",
      "📺",
      "📻",
      "🎙️",
      "🎚️",
      "🎛️",
      "🧭",
      "⏱️",
      "⏲️",
      "⏰",
      "🕰️",
      "⌛",
      "⏳",
      "📡",
      "🔋",
      "🔌",
      "💡",
      "🔦",
      "🕯️",
      "🪔",
      "🧯",
      "🛢️",
      "💸",
      "💵",
    ],
  },
  {
    name: "Symbols",
    emojis: [
      "❤️",
      "🧡",
      "💛",
      "💚",
      "💙",
      "💜",
      "🖤",
      "🤍",
      "🤎",
      "💔",
      "❣️",
      "💕",
      "💞",
      "💓",
      "💗",
      "💖",
      "💘",
      "💝",
      "💟",
      "☮️",
      "✝️",
      "☪️",
      "🕉️",
      "☸️",
      "✡️",
      "🔯",
      "🕎",
      "☯️",
      "☦️",
      "🛐",
      "⛎",
      "♈",
      "♉",
      "♊",
      "♋",
      "♌",
      "♍",
      "♎",
      "♏",
      "♐",
      "♑",
      "♒",
      "♓",
      "🆔",
      "⚛️",
      "🉑",
      "☢️",
      "☣️",
      "📴",
      "📳",
    ],
  },
  {
    name: "Flags",
    emojis: [
      "🏁",
      "🚩",
      "🎌",
      "🏴",
      "🏳️",
      "🏳️‍🌈",
      "🏳️‍⚧️",
      "🏴‍☠️",
      "🇦🇨",
      "🇦🇩",
      "🇦🇪",
      "🇦🇫",
      "🇦🇬",
      "🇦🇮",
      "🇦🇱",
      "🇦🇲",
      "🇦🇴",
      "🇦🇶",
      "🇦🇷",
      "🇦🇸",
      "🇦🇹",
      "🇦🇺",
      "🇦🇼",
      "🇦🇽",
      "🇦🇿",
      "🇧🇦",
      "🇧🇧",
      "🇧🇩",
      "🇧🇪",
      "🇧🇫",
      "🇧🇬",
      "🇧🇭",
      "🇧🇮",
      "🇧🇯",
      "🇧🇱",
      "🇧🇲",
    ],
  },
]

// Componente selector de emojis
export const EmojiPicker = ({ editor }: { editor: any }) => {
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState("Smileys & People")

  const insertEmoji = useCallback(
    (emoji: string) => {
      editor.chain().focus().insertContent(emoji).run()
    },
    [editor],
  )

  const filteredEmojis = useCallback(() => {
    if (!search) {
      return emojiCategories.find((category) => category.name === activeTab)?.emojis || []
    }

    const allEmojis = emojiCategories.flatMap((category) => category.emojis)
    return allEmojis.filter((emoji) => emoji.includes(search))
  }, [search, activeTab])

  return (
    <div className="w-[320px] p-2 bg-white rounded-md border shadow-md">
      <Input
        placeholder="Search emoji..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-2"
      />

      {!search && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-2">
            {emojiCategories.slice(0, 4).map((category) => (
              <TabsTrigger key={category.name} value={category.name} className="text-xs py-1">
                {category.name.split(" ")[0]}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsList className="grid grid-cols-4 mb-2">
            {emojiCategories.slice(4).map((category) => (
              <TabsTrigger key={category.name} value={category.name} className="text-xs py-1">
                {category.name.split(" ")[0]}
              </TabsTrigger>
            ))}
          </TabsList>

          {emojiCategories.map((category) => (
            <TabsContent key={category.name} value={category.name} className="mt-0">
              <ScrollArea className="h-[200px]">
                <div className="grid grid-cols-8 gap-1">
                  {category.emojis.map((emoji, index) => (
                    <button
                      key={index}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded cursor-pointer text-xl"
                      onClick={() => insertEmoji(emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      )}

      {search && (
        <ScrollArea className="h-[200px]">
          <div className="grid grid-cols-8 gap-1">
            {filteredEmojis().map((emoji, index) => (
              <button
                key={index}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded cursor-pointer text-xl"
                onClick={() => insertEmoji(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}

// Extensión de Emoji para Tiptap
export const EmojiExtension = Extension.create({
  name: "emoji",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("emoji"),
        props: {
          decorations: (state) => {
            // Aquí podrías agregar decoraciones para resaltar emojis si lo deseas
            return DecorationSet.empty
          },
        },
      }),
    ]
  },
})

// Hook para usar el selector de emojis
export const useEmojiPicker = (editor: any) => {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const tippyInstance = useRef<any>(null)

  useEffect(() => {
    if (!buttonRef.current) return

    tippyInstance.current = tippy(buttonRef.current, {
      content: document.createElement("div"),
      interactive: true,
      trigger: "manual",
      placement: "bottom-start",
      arrow: true,
      theme: "light",
      appendTo: () => document.body,
    })

    return () => {
      if (tippyInstance.current) {
        tippyInstance.current.destroy()
      }
    }
  }, [])

  useEffect(() => {
    if (!tippyInstance.current) return

    const div = document.createElement("div")

    if (isOpen) {
      // Renderizar el componente EmojiPicker en el div
      const root = document.createElement("div")
      div.appendChild(root)

      // Aquí normalmente usaríamos ReactDOM.render, pero como estamos en un entorno
      // donde no podemos importar ReactDOM directamente, simulamos el contenido
      root.innerHTML = '<div id="emoji-picker-container"></div>'

      // Actualizar el contenido de tippy
      tippyInstance.current.setContent(div)
      tippyInstance.current.show()

      // En una implementación real, aquí renderizaríamos el componente React
      const container = root.querySelector("#emoji-picker-container")
      if (container) {
        // ReactDOM.render(<EmojiPicker editor={editor} />, container)
        // Como no podemos usar ReactDOM.render, simulamos el contenido
        const emojiPickerElement = document.createElement("div")
        emojiPickerElement.className = "emoji-picker"
        container.appendChild(emojiPickerElement)

        // Crear el componente EmojiPicker manualmente
        const emojiPicker = new EmojiPicker({ editor })
        // En una implementación real, esto sería manejado por React
      }
    } else {
      tippyInstance.current.hide()
    }
  }, [isOpen, editor])

  const toggleEmojiPicker = useCallback(() => {
    setIsOpen(!isOpen)
  }, [isOpen])

  return {
    buttonRef,
    toggleEmojiPicker,
    isOpen,
  }
}

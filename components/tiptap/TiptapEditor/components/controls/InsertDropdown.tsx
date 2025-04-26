import React, { useCallback, useMemo } from 'react'
import MenuButton from '../MenuButton'
import { useTiptapContext } from '../Provider'

const InsertDropdown = () => {
    const { editor } = useTiptapContext()

    const insertCodeBlock = () => editor.chain().focus().setCodeBlock().run()

    const insertBlockquote = () => editor.chain().focus().setBlockquote().run()

    const insertYoutube = () => {
        const src = prompt('Embed Youtube Video', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ')
        if (src) {
            editor.chain().focus().embedYoutube({ src }).run()
        }
    }

    return (
        <div className='flex items-center'>
            <MenuButton hideText={false} tooltip={false} icon='Quote' onClick={insertBlockquote} />

            <MenuButton
                hideText={false}
                tooltip={false}
                icon='CodeBlock'
                onClick={insertCodeBlock}
            />

            <MenuButton hideText={false} tooltip={false} icon='Youtube' onClick={insertYoutube} />
        </div>
    )
}

export default InsertDropdown

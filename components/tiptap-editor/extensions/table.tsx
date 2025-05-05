/* eslint-disable */
// @ts-nocheck
'use client'
import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import { TableView } from './table-view'
import type { Node as ProseMirrorNode } from '@tiptap/pm/model'
import { NodeSelection } from '@tiptap/pm/state'
import { findParentNode } from '@tiptap/core'

export interface TableOptions {
    HTMLAttributes: Record<string, any>
    resizable: boolean
    handleWidth: number
    cellMinWidth: number
    View: any
}

export const TableExtension = Extension.create<TableOptions>({
    name: 'tableExtension',

    addOptions() {
        return {
            HTMLAttributes: {},
            resizable: true,
            handleWidth: 5,
            cellMinWidth: 100,
            View: TableView,
        }
    },

    addProseMirrorPlugins() {
        const { resizable, handleWidth, cellMinWidth, View } = this.options

        if (!resizable) {
            return []
        }

        const key = new PluginKey('tableColumnResizing')
        const lastColumnResizable = true

        return [
            new Plugin({
                key,
                state: {
                    init() {
                        return {
                            decorations: DecorationSet.empty,
                            dragging: null,
                        }
                    },
                    apply(tr, state) {
                        const action = tr.getMeta(key)
                        if (action && action.setDragging !== undefined) {
                            return { ...state, dragging: action.setDragging }
                        }

                        if (action && action.setDecorations !== undefined) {
                            return { ...state, decorations: action.setDecorations }
                        }

                        if (tr.docChanged && state.dragging) {
                            let decorations = state.decorations
                            const { pos } = state.dragging
                            const doc = tr.doc
                            const table = findTableAt(doc, pos)
                            if (table) {
                                const { map } = TableMap.get(table.node)
                                const start = table.pos
                                if (map) {
                                    const tableDecorations = handleDecorations(
                                        start,
                                        table.node,
                                        map,
                                        lastColumnResizable,
                                        handleWidth,
                                        cellMinWidth
                                    )
                                    decorations = DecorationSet.create(doc, tableDecorations)
                                }
                            }
                            return { ...state, decorations }
                        }

                        return state
                    },
                },
                props: {
                    decorations(state) {
                        return this.getState(state).decorations
                    },
                    nodeViews: {
                        table: (node, view, getPos) =>
                            new View(node, view, getPos, {
                                handleWidth,
                                cellMinWidth,
                                lastColumnResizable,
                                key,
                            }),
                    },
                },
            }),
        ]
    },
})

export function findTableAt(doc: ProseMirrorNode, pos: number) {
    return findParentNode(
        (node) => node.type.spec.tableRole === 'table',
        NodeSelection.create(doc, pos)
    )
}

export class TableMap {
    width: number
    height: number
    map: number[]
    problems?: object[]

    constructor(width: number, height: number, map: number[], problems?: object[]) {
        this.width = width
        this.height = height
        this.map = map
        this.problems = problems
    }

    // Find the dimensions of the cell at the given position.
    findCell(pos: number) {
        for (let i = 0; i < this.map.length; i++) {
            const curPos = this.map[i]
            if (curPos === pos) {
                return { left: i % this.width, top: Math.floor(i / this.width) }
            }
        }
        throw new RangeError(`No cell with offset ${pos} found`)
    }

    // Find the left side of the cell at the given position.
    colCount(pos: number) {
        for (let i = 0; i < this.map.length; i++) {
            if (this.map[i] === pos) {
                return i % this.width
            }
        }
        throw new RangeError(`No cell with offset ${pos} found`)
    }

    // Find the next cell in the given direction, starting from the cell
    // at `pos`, if any.
    nextCell(pos: number, axis: string, dir: number) {
        const { left, top } = this.findCell(pos)
        if (axis === 'horiz') {
            if (dir < 0 ? left === 0 : left === this.width - 1) {
                return null
            }
            return this.map[top * this.width + (left + dir)]
        } else {
            if (dir < 0 ? top === 0 : top === this.height - 1) {
                return null
            }
            return this.map[(top + dir) * this.width + left]
        }
    }

    // Get the position at which the cell at the given row and column
    // starts, or would start, if a cell started there.
    positionAt(row: number, col: number, table: ProseMirrorNode) {
        if (row < 0 || row >= this.height || col < 0 || col >= this.width) {
            return null
        }
        return this.map[row * this.width + col]
    }

    // Find the rectangle between the given cells.
    rectBetween(a: number, b: number) {
        const { left: leftA, top: topA } = this.findCell(a)
        const { left: leftB, top: topB } = this.findCell(b)
        return {
            left: Math.min(leftA, leftB),
            top: Math.min(topA, topB),
            right: Math.max(leftA, leftB),
            bottom: Math.max(topA, topB),
        }
    }

    // Return the position of all cells that have the top left corner in
    // the given rectangle.
    cellsInRect(rect: { left: number; top: number; right: number; bottom: number }) {
        const result = []
        const seen: Record<number, boolean> = {}
        for (let row = rect.top; row <= rect.bottom; row++) {
            for (let col = rect.left; col <= rect.right; col++) {
                const index = row * this.width + col
                const pos = this.map[index]
                if (pos === undefined || seen[pos]) {
                    continue
                }
                seen[pos] = true
                if (
                    (col === rect.left && !this.map[index - 1] === pos) ||
                    (row === rect.top && !(this.map[index - this.width] === pos))
                ) {
                    result.push(pos)
                }
            }
        }
        return result
    }

    // Return the position at which the cell at the given position
    // starts.
    cellStarting(pos: number) {
        const { left, top } = this.findCell(pos)
        return this.map[top * this.width + left]
    }

    // Return an array of the rows in the table, with arrays of the
    // positions of the cells in each row.
    rows() {
        const result = []
        const seen: Record<number, boolean> = {}
        for (let row = 0; row < this.height; row++) {
            const rowResult = []
            for (let col = 0; col < this.width; col++) {
                const index = row * this.width + col
                const pos = this.map[index]
                if (pos === undefined || seen[pos]) {
                    continue
                }
                seen[pos] = true
                rowResult.push(pos)
            }
            result.push(rowResult)
        }
        return result
    }

    // Return an array of the columns in the table, with arrays of the
    // positions of the cells in each column.
    cols() {
        const result = []
        const seen: Record<number, boolean> = {}
        for (let col = 0; col < this.width; col++) {
            const colResult = []
            for (let row = 0; row < this.height; row++) {
                const index = row * this.width + col
                const pos = this.map[index]
                if (pos === undefined || seen[pos]) {
                    continue
                }
                seen[pos] = true
                colResult.push(pos)
            }
            result.push(colResult)
        }
        return result
    }

    // Find the table map for the given table node.
    static get(table: ProseMirrorNode) {
        return TableMap.build(table)
    }

    // Build a table map for the given table node.
    static build(table: ProseMirrorNode) {
        const width = findWidth(table)
        const height = table.childCount
        const map = []
        let mapPos = 0
        const problems = null
        for (let i = 0, e = width * height; i < e; i++) {
            map.push(0)
        }

        for (let row = 0, pos = 0; row < height; row++) {
            const rowNode = table.child(row)
            for (let i = 0; i < rowNode.childCount; i++) {
                const cellNode = rowNode.child(i)
                const { colspan = 1, rowspan = 1 } = cellNode.attrs
                for (let h = 0; h < rowspan; h++) {
                    for (let w = 0; w < colspan; w++) {
                        const mapIndex = (row + h) * width + (pos + w)
                        if (map[mapIndex] === 0) {
                            map[mapIndex] = mapPos
                        } else {
                            // This position has already been allocated, which means
                            // there is overlap. If this is the first position in the
                            // current cell, create a problem.
                            if (h === 0 && w === 0) {
                                // problems = problems || []
                                // problems.push({
                                //   type: "collision",
                                //   row,
                                //   pos,
                                //   n: colspan,
                                // })
                            }
                            // Skip the problematic cell.
                            continue
                        }
                    }
                }
                mapPos++
                pos += colspan
            }
        }

        return { map: new TableMap(width, height, map, problems), problems }
    }
}

// Get the width of a table node.
function findWidth(table: ProseMirrorNode) {
    let width = 0
    let hasRowSpan = false
    for (let i = 0; i < table.childCount; i++) {
        const rowNode = table.child(i)
        let rowWidth = 0
        if (hasRowSpan) {
            for (let j = 0; j < rowNode.childCount; j++) {
                const cellNode = rowNode.child(j)
                rowWidth += cellNode.attrs.colspan || 1
            }
        } else {
            rowWidth = rowNode.childCount
        }
        if (width && rowWidth !== width) {
            hasRowSpan = true
        }
        width = Math.max(width, rowWidth)
    }
    return width
}

function handleDecorations(
    start: number,
    table: ProseMirrorNode,
    map: TableMap,
    lastColumnResizable: boolean,
    handleWidth: number,
    cellMinWidth: number
) {
    const decorations = []
    const rows = map.height
    const cols = map.width
    const rowPositions = []

    for (let row = 0; row < rows; row++) {
        const rowNode = table.child(row)
        let rowPos = start + 1
        for (let i = 0; i < row; i++) {
            rowPos += table.child(i).nodeSize
        }
        rowPositions.push(rowPos)
    }

    for (let col = 0; col < cols; col++) {
        const isLastColumn = col === cols - 1
        if (isLastColumn && !lastColumnResizable) {
            continue
        }

        const colPositions = []
        for (let row = 0; row < rows; row++) {
            const rowNode = table.child(row)
            let colPos = rowPositions[row] + 1
            for (let i = 0; i < col; i++) {
                colPos += rowNode.child(i).nodeSize
            }
            colPositions.push(colPos)
        }

        const decorationPos = colPositions[0] + rowPositions[0] - start - 1
        const decoration = Decoration.widget(decorationPos, () => {
            const handle = document.createElement('div')
            handle.className = 'column-resize-handle'
            handle.style.position = 'absolute'
            handle.style.top = '0'
            handle.style.bottom = '0'
            handle.style.width = `${handleWidth}px`
            handle.style.cursor = 'col-resize'
            handle.style.userSelect = 'none'
            handle.style.right = '0'
            handle.style.zIndex = '1'
            handle.style.backgroundColor = 'transparent'
            return handle
        })

        decorations.push(decoration)
    }

    return decorations
}

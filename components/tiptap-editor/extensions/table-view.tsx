/* eslint-disable */
// @ts-nocheck
'use client'
import { findParentNode } from '@tiptap/core'
import { NodeSelection } from '@tiptap/pm/state'
import { TableMap } from './table'

export class TableView {
    node: any
    view: any
    getPos: any
    dom: HTMLElement
    table: HTMLTableElement
    colgroup: HTMLTableColElement
    options: any
    cellMinWidth: number
    handlers: any[]
    draggedColumn: any
    dragging: boolean

    constructor(node, view, getPos, options) {
        this.node = node
        this.view = view
        this.getPos = getPos
        this.options = options
        this.cellMinWidth = options.cellMinWidth
        this.handlers = []
        this.dragging = false

        this.dom = document.createElement('div')
        this.dom.className = 'tableWrapper'
        this.table = document.createElement('table')
        this.dom.appendChild(this.table)
        this.colgroup = document.createElement('colgroup')
        this.table.appendChild(this.colgroup)
        this.contentDOM = document.createElement('tbody')
        this.table.appendChild(this.contentDOM)

        this.updateColumns()
    }

    update(node) {
        if (node.type !== this.node.type) return false
        this.node = node
        this.updateColumns()
        return true
    }

    updateColumns() {
        const tableMap = TableMap.get(this.node)
        const cols = tableMap.width
        let totalWidth = 0
        const cells = []

        for (let row = 0; row < tableMap.height; row++) {
            for (let col = 0; col < cols; col++) {
                const cellPos = tableMap.map[row * cols + col]
                if (cellPos === 0 || cells.includes(cellPos)) continue
                cells.push(cellPos)
                const cell = this.node.nodeAt(cellPos)
                const colspan = cell.attrs.colspan || 1
                const colwidth = cell.attrs.colwidth || []
                for (let i = 0; i < colspan; i++) {
                    const width = colwidth[i] || this.cellMinWidth
                    totalWidth += width
                }
            }
            break
        }

        // Remove existing colgroup children
        while (this.colgroup.firstChild) {
            this.colgroup.removeChild(this.colgroup.firstChild)
        }

        // Create new col elements
        for (let col = 0; col < cols; col++) {
            const colEl = document.createElement('col')
            this.colgroup.appendChild(colEl)
        }

        // Set up handlers for column resizing
        this.handlers.forEach((handler) => handler.destroy())
        this.handlers = []

        // Add resize handlers
        if (this.options.resizable) {
            const handles = this.table.querySelectorAll('.column-resize-handle')
            handles.forEach((handle, i) => {
                const handler = new ColumnResizeHandler(i, this, handle, this.options)
                this.handlers.push(handler)
            })
        }
    }

    ignoreMutation() {
        return true
    }

    destroy() {
        this.handlers.forEach((handler) => handler.destroy())
    }
}

class ColumnResizeHandler {
    columnIndex: number
    view: TableView
    handle: HTMLElement
    options: any
    dragging: boolean
    startX: number
    startWidth: number
    tableStart: number
    rtl: boolean
    dragMove: (e: MouseEvent) => void
    dragEnd: () => void

    constructor(columnIndex, view, handle, options) {
        this.columnIndex = columnIndex
        this.view = view
        this.handle = handle
        this.options = options
        this.dragging = false

        this.handle.addEventListener('mousedown', this.handleMouseDown)
    }

    handleMouseDown = (e: MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        const tableView = this.view.view
        const editorView = tableView
        const state = editorView.state
        const tableStart = this.view.getPos()
        const table = findParentNode(
            (node) => node.type.spec.tableRole === 'table',
            NodeSelection.create(state.doc, tableStart)
        )

        if (!table) return

        this.dragging = true
        this.startX = e.clientX
        this.tableStart = tableStart

        // Get the current column width
        const map = TableMap.get(table.node)
        const colCount = map.width
        const col = Math.min(this.columnIndex, colCount - 1)

        // Find a cell in the column to get its width
        let width = 0
        for (let row = 0; row < map.height; row++) {
            const cellPos = map.map[row * colCount + col]
            if (cellPos === 0) continue
            const cell = table.node.nodeAt(cellPos)
            if (cell) {
                const colwidth = cell.attrs.colwidth || []
                width = colwidth[0] || this.options.cellMinWidth
                break
            }
        }

        this.startWidth = width

        // Set up event handlers for dragging
        this.dragMove = this.handleDragMove.bind(this)
        this.dragEnd = this.handleDragEnd.bind(this)

        window.addEventListener('mousemove', this.dragMove)
        window.addEventListener('mouseup', this.dragEnd)

        // Set dragging state in the plugin
        editorView.dispatch(
            state.tr.setMeta(this.options.key, {
                setDragging: {
                    columnIndex: col,
                    pos: tableStart,
                    startX: e.clientX,
                    startWidth: width,
                },
            })
        )
    }

    handleDragMove = (e: MouseEvent) => {
        if (!this.dragging) return

        const delta = e.clientX - this.startX
        if (!delta) return

        const tableView = this.view.view
        const state = tableView.state
        const tr = state.tr
        const tableStart = this.tableStart
        const table = findParentNode(
            (node) => node.type.spec.tableRole === 'table',
            NodeSelection.create(state.doc, tableStart)
        )

        if (!table) return

        const map = TableMap.get(table.node)
        const colCount = map.width
        const col = Math.min(this.columnIndex, colCount - 1)

        // Calculate new width
        const newWidth = Math.max(this.startWidth + delta, this.options.cellMinWidth)

        // Update all cells in the column
        for (let row = 0; row < map.height; row++) {
            const index = row * colCount + col
            const pos = map.map[index]
            if (pos === 0) continue

            const start = tableStart + 1 // +1 to skip the table node itself
            let cellPos = start

            // Navigate to the correct row
            for (let i = 0; i < row; i++) {
                cellPos += table.node.child(i).nodeSize
            }

            // Navigate to the correct cell in the row
            const rowNode = table.node.child(row)
            cellPos += 1 // +1 to skip the row node itself
            for (let i = 0; i < col; i++) {
                if (i < rowNode.childCount) {
                    cellPos += rowNode.child(i).nodeSize
                }
            }

            if (cellPos >= start && cellPos < start + table.node.nodeSize) {
                const cell = table.node.nodeAt(pos)
                if (!cell) continue

                const attrs = { ...cell.attrs }
                const colspan = attrs.colspan || 1

                if (colspan === 1) {
                    attrs.colwidth = [newWidth]
                } else {
                    const colwidth = attrs.colwidth
                        ? attrs.colwidth.slice()
                        : Array(colspan).fill(0)
                    colwidth[0] = newWidth
                    attrs.colwidth = colwidth
                }

                tr.setNodeMarkup(cellPos, null, attrs)
            }
        }

        if (!tr.steps.length) return

        tableView.dispatch(tr)
    }

    handleDragEnd = () => {
        if (!this.dragging) return

        this.dragging = false
        window.removeEventListener('mousemove', this.dragMove)
        window.removeEventListener('mouseup', this.dragEnd)

        const tableView = this.view.view
        const state = tableView.state

        // Clear dragging state in the plugin
        tableView.dispatch(state.tr.setMeta(this.options.key, { setDragging: null }))
    }

    destroy() {
        this.handle.removeEventListener('mousedown', this.handleMouseDown)
        window.removeEventListener('mousemove', this.dragMove)
        window.removeEventListener('mouseup', this.dragEnd)
    }
}

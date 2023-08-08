import * as d3 from 'd3'
import { useEffect, useRef } from 'react'
import { nodes } from './nodes'
import { symbols } from './symbols'
import { edges } from './edges'
import { getDomain, getLine } from './utils'

const Graph = () => {
  const graphRef = useRef(null)

  const { xMin, xMax, yMin, yMax } = getDomain()

  const scale = 3

  const width = (xMax - xMin + 20) * scale
  const height = (yMax - yMin + 20) * scale

  useEffect(() => {
    if (graphRef.current === null) return
    const svg = d3.select(graphRef.current)

    const xScale = d3
      .scaleLinear()
      .domain([xMin - 10, xMax + 10])
      .range([0, width])

    // create nodes from nodes array and append to svg
    svg
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr(
        'transform',
        (d) => `translate(${xScale(d.pos[0])} ${xScale(d.pos[1])}) rotate(${d.rot}) scale(${scale})`
      )
      .append('path')
      .attr('d', (d) => {
        const relevantSymbol = symbols.find((symbol) => symbol.name === d.template)
        if (!relevantSymbol) return ''
        return relevantSymbol.paths.join(' ')
      })
      .attr('stroke', '#333')
      .attr('stroke-width', 0.5)
      .attr('id', (d) => `${d.id} node`)

    // create edges from edges array and append to svg
    svg
      .selectAll('svg')
      .data(edges)
      .join('path')
      .attr('d', (d) => getLine(d, xScale))
      .attr('stroke', '#333')
      .attr('id', (d) => d.id)

    return () => {
      // remove all the elements from the svg
      svg.selectAll('path').remove()
      svg.selectAll('g').remove()
    }
  }, [height, width, xMax, xMin, yMax, yMin])

  return (
    <div>
      <svg
        ref={graphRef}
        width={width}
        height={height}
        viewBox={`${xMin - 10} ${yMin - 10} ${width} ${height}`}
      ></svg>
    </div>
  )
}

export default Graph

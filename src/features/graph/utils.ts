import * as d3 from 'd3'
import { nodes } from './nodes'
import { edges } from './edges'

export const getDomain = () => {
  const xValues = nodes.map((node) => node.pos[0])
  const yValues = nodes.map((node) => node.pos[1])
  const xMin = Math.min(...xValues)
  const xMax = Math.max(...xValues)
  const yMin = Math.min(...yValues)
  const yMax = Math.max(...yValues)
  return {
    xMin,
    xMax,
    yMin,
    yMax,
  }
}

const nodesMap = new Map(nodes.map((node) => [node.id, node]))

export const getLine = (
  edge: (typeof edges)[number],
  xScale: d3.ScaleLinear<number, number, never>
) => {
  const source = nodesMap.get(edge.source.node)
  const target = nodesMap.get(edge.target.node)

  const line = d3
    .line()
    .x((d) => xScale(d[0]))
    .y((d) => xScale(d[1]))

  const points = edge.wayPoints ? edge.wayPoints.map((wayPoint) => [wayPoint[0], wayPoint[1]]) : []
  if (!source || !target) return line([])
  const sourceConnectionOffset = edge.source.cp.split(':').map((n) => Number(n))
  const targetConnectionOffset = edge.target.cp.split(':').map((n) => Number(n))
  const sourceConnection = [
    source.pos[0] + sourceConnectionOffset[0],
    source.pos[1] + sourceConnectionOffset[1],
  ]
  const targetConnection = [
    target.pos[0] + targetConnectionOffset[0],
    target.pos[1] + targetConnectionOffset[1],
  ]
  const pointsArr = [sourceConnection, ...points, targetConnection]
  // @ts-expect-error issue with the type of an array an it being readonly
  return line(pointsArr)
}

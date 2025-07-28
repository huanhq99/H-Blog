'use client'
import React, { useEffect, useRef, useState } from 'react'
import ReactECharts from 'echarts-for-react'

type DataItem = { date: string; count: number }
type Props = { data: DataItem[] }

const BlogHeatmap: React.FC<Props> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)

  const now = new Date()
  const past12Months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1)
    const monthIdx = d.getMonth() + 1
    const mm = monthIdx < 10 ? `0${monthIdx}` : `${monthIdx}`
    return `${d.getFullYear()}-${mm}`
  })

  const displayLabels = past12Months.map((d) => `${parseInt(d.slice(5))}`)
  const monthMap = new Map(data.map((d) => [d.date, d.count]))
  const heatmapData = past12Months.map((month, idx) => [idx, 0, monthMap.get(month) || 0])
  const maxCount = Math.max(...data.map((d) => d.count), 4)

  // 👇 监听容器宽度变化，动态计算 cellSize
  useEffect(() => {
    const resize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
      }
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  const cellWidth = containerWidth / 12 - 4 // 留出空隙
  const cellHeight = cellWidth // 保持正方

  const chartHeight = cellHeight + 40 // 加 padding 和标签空间

  const option = {
    tooltip: {
      formatter: (params: any) => {
        const month = past12Months[params.value[0]]
        return `${month}：${params.value[2]} 篇文章`
      },
    },
    grid: {
      top: 10,
      left: 10,
      right: 10,
      bottom: 30,
      containLabel: false,
    },
    xAxis: {
      type: 'category',
      data: displayLabels,
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: {
        color: '#666',
        fontSize: 10,
        interval: 0,
      },
      boundaryGap: true,
    },
    yAxis: {
      type: 'category',
      data: [''],
      show: false,
    },
    visualMap: {
      show: false,
      min: 0,
      max: maxCount,
      inRange: {
        color: ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'],
      },
    },
    series: [
      {
        type: 'heatmap',
        data: heatmapData,
        cellSize: [cellWidth, cellHeight],
        label: { show: false },
        itemStyle: {
          borderRadius: 4,
          borderColor: '#f0f0f0',
          borderWidth: 2,
        },
        emphasis: {
          itemStyle: {
            borderColor: '#999',
            borderWidth: 1,
          },
        },
      },
    ],
  }

  return (
      <div
          ref={containerRef}
          className="w-full max-w-[450px] mx-auto"
      >
        {containerWidth > 0 && (
            <ReactECharts
                option={option}
                notMerge
                lazyUpdate
                style={{ width: '100%', height: `${chartHeight}px` }}
            />
        )}
      </div>
  )
}

export default BlogHeatmap

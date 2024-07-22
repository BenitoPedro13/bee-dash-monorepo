import { Attachment, Influencer } from '@/store'
import React from 'react'

type TableSortingIconProps = {
    sortColumn: keyof Attachment | keyof Influencer,
    sortOrder: 'asc' | 'desc',
    actualColumn: keyof Attachment | keyof Influencer,
}

const TableSortingIcon = ({sortColumn, sortOrder, actualColumn}: TableSortingIconProps) => {
  return (
    <span className="" aria-hidden="true">
    {sortColumn === actualColumn &&
    sortOrder === "asc" ? (
      <svg
        viewBox="0 0 1024 1024"
        focusable="false"
        data-icon="caret-up"
        width="1em"
        height="1em"
        fill="#2d3442"
        aria-hidden="true"
      >
        <path d="M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z"></path>
      </svg>
    ) : (
      <svg
        viewBox="0 0 1024 1024"
        focusable="false"
        data-icon="caret-up"
        width="1em"
        height="1em"
        fill="#cfd4dc"
        aria-hidden="true"
      >
        <path d="M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z"></path>
      </svg>
    )}
    {sortColumn === actualColumn &&
    sortOrder === "desc" ? (
      <svg
        viewBox="0 0 1024 1024"
        focusable="false"
        data-icon="caret-down"
        width="1em"
        height="1em"
        fill="#2d3442"
        aria-hidden="true"
      >
        <path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z"></path>
      </svg>
    ) : (
      <svg
        viewBox="0 0 1024 1024"
        focusable="false"
        data-icon="caret-down"
        width="1em"
        height="1em"
        fill="#cfd4dc"
        aria-hidden="true"
      >
        <path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z"></path>
      </svg>
    )}
  </span>
  )
}

export default TableSortingIcon
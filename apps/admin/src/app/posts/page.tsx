"use client";

import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { CrudFilter, useMany, type BaseRecord } from "@refinedev/core";
import { Space, Table } from "antd";
import { useSearchParams } from "next/navigation";

export default function PostsList() {
  const searchParams = useSearchParams();
  const pageSize = searchParams.get("pageSize")
    ? Number(searchParams.get("pageSize"))
    : 10;
  const current = searchParams.get("current")
    ? Number(searchParams.get("current"))
    : 1;
  const filterField = searchParams.get("filter_field") ?? "name";
  const filterValue = searchParams.get("filter_value");

  const filter: CrudFilter[] | undefined =
    filterField && filterValue !== null
      ? [{ field: filterField, operator: "contains", value: filterValue }]
      : undefined;

  const {
    tableProps,
    tableQueryResult: { data, isLoading },
    current: currentPage,
    setCurrent: setCurrentPage,
    pageCount,
    pageSize: currentPageSize,
    setPageSize: setCurrentPageSize,
  } = useTable({
    syncWithLocation: true,
    pagination: { current, pageSize },
    sorters: {
      initial: [{ field: "id", order: "asc" }],
    },
    filters: {
      initial: filter,
    },
  });

  return (
    <List>
      <Table
        {...tableProps}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: currentPageSize,
          total: data?.total,
          onChange: (page, pageSize) => {
            setCurrentPage(page);
            setCurrentPageSize(pageSize);
          },
        }}
      >
        <Table.Column dataIndex="id" title="ID" />
        <Table.Column dataIndex="type" title="Type" />
        <Table.Column dataIndex="isVideo" title="Is Video" />
        <Table.Column dataIndex="impressions" title="Impressions" />
        <Table.Column dataIndex="interactions" title="Interactions" />
        <Table.Column dataIndex="clicks" title="Clicks" />
        <Table.Column dataIndex="videoViews" title="Video Views" />
        <Table.Column dataIndex="engagement" title="Engagement" />
        <Table.Column dataIndex="price" title="Price" />
        <Table.Column dataIndex="postDate" title="Post Date" />
        <Table.Column dataIndex="creatorId" title="Influencer ID" />
        <Table.Column dataIndex="performanceId" title="Performance ID" />
        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
}

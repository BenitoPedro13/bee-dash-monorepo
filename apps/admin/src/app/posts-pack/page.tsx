/* eslint-disable @next/next/no-img-element */
"use client";

import { dataProvider } from "@providers/data-provider";
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

export default function CampaignList() {
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
  const baseApiUrl = dataProvider.getApiUrl();
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
    pagination: { mode: "client", current, pageSize },
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
        <Table.Column
          dataIndex="price"
          title="Price"
          render={(_, record: BaseRecord) => (
            <>
              {((record?.price as number) ?? 0).toLocaleString("pt-BR", {
                currency: "BRL",
                style: "currency",
              })}
            </>
          )}
        />
        <Table.Column
          dataIndex="posts"
          title="Posts Quantity"
          render={(_, record: BaseRecord) => <>{record?.posts?.length ?? 0}</>}
        />
        <Table.Column dataIndex={["creator", "name"]} title="Creator Name" />
        <Table.Column dataIndex={["campaign", "name"]} title="Campaign Name" />
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

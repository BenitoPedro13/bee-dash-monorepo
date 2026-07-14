/* eslint-disable @next/next/no-img-element */
"use client";
import { dataProvider } from "@providers/data-provider";
import { Show, TextField } from "@refinedev/antd";
import { useOne, useShow } from "@refinedev/core";
import { Typography } from "antd";
import { useParams } from "next/navigation";

const { Title } = Typography;

export default function CampaignShow() {
  const params = useParams<{ id: string }>();
  const { data, isLoading } = useOne({ resource: "campaigns", id: params.id });
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>ID</Title>
      <TextField value={record?.id} />

      <Title level={5}>Campaign Name</Title>
      <TextField value={record?.name} />

      <Title level={5}>Table URL</Title>
      <TextField value={record?.urlTable} />

      <Title level={5}>Uses Posts Table or CSV Table</Title>
      <TextField value={record?.byPosts ? "Posts Table" : "CSV Table"} />

      <Title level={5}>Usuario</Title>
      <TextField value={record?.user?.email ?? record?.userId} />

      <Title level={5}>Created At</Title>
      <TextField value={new Date(record?.createdAt).toLocaleString()} />

      <Title level={5}>Updated At</Title>
      <TextField value={new Date(record?.updatedAt).toLocaleString()} />
    </Show>
  );
}

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
  const { data, isLoading } = useOne({ resource: "posts", id: params.id });
  const record = data?.data;
  const baseApiUrl = dataProvider.getApiUrl();
  return (
    <Show isLoading={isLoading}>
      <Title level={5}>ID</Title>
      <TextField value={record?.id} />

      <Title level={5}>Post Type</Title>
      <TextField value={record?.type} />

      <Title level={5}>Impressions</Title>
      <TextField value={record?.impressions} />

      <Title level={5}>Impressions</Title>
      <TextField value={record?.impressions} />

      <Title level={5}>Likes</Title>
      <TextField value={record?.likes} />

      <Title level={5}>Shares</Title>
      <TextField value={record?.shares} />

      <Title level={5}>Comments</Title>
      <TextField value={record?.comments} />

      <Title level={5}>Saves</Title>
      <TextField value={record?.saves} />

      <Title level={5}>Clicks</Title>
      <TextField value={record?.clicks} />

      <Title level={5}>Sticker Clicks</Title>
      <TextField value={record?.stickerClicks} />

      <Title level={5}>Link Clicks</Title>
      <TextField value={record?.linkClicks} />

      <Title level={5}>Social Network Type</Title>
      <TextField value={`${record?.socialNetwork?.type}`} />

      <Title level={5}>Social Network Username</Title>
      <TextField value={`${record?.socialNetwork?.username}`} />

      <Title level={5}>Creator Name</Title>
      <TextField value={`${record?.socialNetwork?.creator?.name}`} />

      <Title level={5}>Posts Pack Id</Title>
      <TextField value={record?.postsPack?.id} />

      <Title level={5}>Campaign Name</Title>
      <TextField value={record?.postsPack?.campaign?.name} />

      <Title level={5}>Created At</Title>
      <TextField value={new Date(record?.createdAt).toLocaleString()} />

      <Title level={5}>Updated At</Title>
      <TextField value={new Date(record?.updatedAt).toLocaleString()} />
    </Show>
  );
}

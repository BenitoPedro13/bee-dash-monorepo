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

  const { data, isLoading } = useOne({
    resource: "social-networks",
    id: params.id,
  });

  const record = data?.data;

  const baseApiUrl = dataProvider.getApiUrl();

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>ID</Title>
      <TextField value={record?.id} />

      <Title level={5}>Social Network Type</Title>
      <TextField value={record?.type} />

      <Title level={5}>Creator</Title>
      {record?.creator ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            justifyContent: "center",
          }}
        >
          <img
            src={record?.creator?.urlProfilePicture}
            alt={record?.creator?.name}
            style={{ maxWidth: "250px", borderRadius: 30 }}
          />
          <p style={{ width: "250px", textAlign: "center", fontSize: "16px" }}>
            {record?.creator?.name}
          </p>
        </div>
      ) : (
        <TextField value="N/A" />
      )}

      <Title level={5}>Username</Title>
      <TextField value={record?.username} />

      <Title level={5}>Followers</Title>
      <TextField value={record?.followers} />

      <Title level={5}>Created At</Title>
      <TextField value={new Date(record?.createdAt).toLocaleString()} />

      <Title level={5}>Updated At</Title>
      <TextField value={new Date(record?.updatedAt).toLocaleString()} />
    </Show>
  );
}

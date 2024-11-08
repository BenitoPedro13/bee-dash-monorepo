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
  const { data, isLoading } = useOne({ resource: "creators", id: params.id });
  const record = data?.data;
  const baseApiUrl = dataProvider.getApiUrl();
  return (
    <Show isLoading={isLoading}>
      <Title level={5}>ID</Title>
      <TextField value={record?.id} />

      <Title level={5}>Creator Name</Title>
      <TextField value={record?.name} />

      <Title level={5}>Creator City</Title>
      <TextField value={record?.city} />

      <Title level={5}>Creator Profile Picture</Title>
      {record?.urlProfilePicture ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <img
            src={baseApiUrl + record.urlProfilePicture}
            alt={record.urlProfilePicture}
            style={{ maxWidth: "500px" }}
          />
        </div>
      ) : (
        <TextField value="N/A" />
      )}

      <Title level={5}>Created At</Title>
      <TextField value={new Date(record?.createdAt).toLocaleString()} />

      <Title level={5}>Updated At</Title>
      <TextField value={new Date(record?.updatedAt).toLocaleString()} />
    </Show>
  );
}

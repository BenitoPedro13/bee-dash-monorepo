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
  const { data, isLoading } = useOne({ resource: "posts-pack", id: params.id });
  const record = data?.data;
  const baseApiUrl = dataProvider.getApiUrl();
  return (
    <Show isLoading={isLoading}>
      <Title level={5}>ID</Title>
      <TextField value={record?.id} />

      <Title level={5}>Price</Title>
      <TextField
        value={((record?.price as number) ?? 0).toLocaleString("pt-BR", {
          currency: "BRL",
          style: "currency",
        })}
      />

      <Title level={5}>Registrations</Title>
      <TextField
        value={((record?.registrations as number) ?? 0).toLocaleString("pt-BR")}
      />

      <Title level={5}>Posts Quantity</Title>
      <TextField value={record?.posts?.length ?? 0} />

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
            src={baseApiUrl + record?.creator?.urlProfilePicture}
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

      <Title level={5}>Campaign</Title>
      <TextField value={record?.campaign?.name} />

      <Title level={5}>Created At</Title>
      <TextField value={new Date(record?.createdAt).toLocaleString()} />

      <Title level={5}>Updated At</Title>
      <TextField value={new Date(record?.updatedAt).toLocaleString()} />
    </Show>
  );
}

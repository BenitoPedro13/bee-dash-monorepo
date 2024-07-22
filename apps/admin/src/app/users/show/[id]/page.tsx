/* eslint-disable @next/next/no-img-element */
"use client";
import { dataProvider } from "@providers/data-provider";
import { Show, TextField } from "@refinedev/antd";
import { useOne, useShow } from "@refinedev/core";
import { Typography } from "antd";
import { useParams } from "next/navigation";

const { Title } = Typography;

export default function UserShow() {
  const params = useParams<{ id: string }>();
  const { data, isLoading } = useOne({ resource: "users", id: params.id });
  const record = data?.data;
  const baseApiUrl = dataProvider.getApiUrl();
  return (
    <Show isLoading={isLoading}>
      <Title level={5}>ID</Title>
      <TextField value={record?.id} />

      <Title level={5}>Email</Title>
      <TextField value={record?.email} />

      <Title level={5}>Password</Title>
      <TextField value={record?.password} />

      <Title level={5}>Name</Title>
      <TextField value={record?.name} />

      <Title level={5}>Created At</Title>
      <TextField value={new Date(record?.createdAt).toLocaleString()} />

      <Title level={5}>Updated At</Title>
      <TextField value={new Date(record?.updatedAt).toLocaleString()} />

      <Title level={5}>Total Initial Investment</Title>
      <TextField value={record?.totalInitialInvestment} />

      <Title level={5}>Color</Title>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <TextField value={record?.color} />
        <input
          type="color"
          id="color"
          name="color"
          value={data?.data.color}
          // onChange={(e) => e.preventDefault()}
        />
      </div>

      <Title level={5}>Campaign Name</Title>
      <TextField value={record?.campaignName} />

      <Title level={5}>Estimated Executed Investment</Title>
      <TextField value={record?.estimatedExecutedInvestment} />

      <Title level={5}>Profile Picture URL</Title>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {data?.data.urlProfilePicture ? (
          <img
            src={baseApiUrl + data?.data.urlProfilePicture}
            alt={data?.data.name}
            style={{ maxWidth: "500px" }}
          />
        ) : (
          "Nenhum Foto de Perfil existente para esse usuario"
        )}
      </div>
    </Show>
  );
}

/* eslint-disable @next/next/no-img-element */
"use client";

import { DeleteButton, Edit, useForm } from "@refinedev/antd";
import { BaseRecord, useOne, useTable } from "@refinedev/core";
import {
  Form,
  Input,
  InputNumber,
  Upload,
  Button,
  List,
  Table,
  Space,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useParams } from "next/navigation";
import axios from "axios";
import { dataProvider, LOCAL_API_URL } from "@providers/data-provider";
import { RcFile } from "antd/es/upload";
import { useState, useEffect } from "react";

export default function UsersEdit() {
  const params = useParams<{ id: string }>();
  const { formProps, saveButtonProps } = useForm({});
  const { data, isLoading } = useOne({ resource: "users", id: params.id });
  const baseApiUrl = dataProvider.getApiUrl();

  const [searchTerm, setSearchTerm] = useState("");

  const handleButtonClick = () => {
    handleSearchCreators(searchTerm);
  };

  const [creators, setCreators] = useState([]);
  const [creatorsLoading, setCreatorsLoading] = useState(false);

  const {
    tableQueryResult: { data: attachments, isLoading: attachmentsIsLoading },
    current: currentPage,
    setCurrent: setCurrentPage,
    pageCount,
    pageSize: currentPageSize,
    setPageSize: setCurrentPageSize,
  } = useTable({
    syncWithLocation: true,
    resource: "attachments",
    meta: {
      email: data?.data.email,
    },
    pagination: { current: 1, pageSize: 10 },
    sorters: {
      initial: [{ field: "id", order: "asc" }],
    },
  });

  // const {
  //   tableQueryResult: { data: posts, isLoading: postsIsLoading },
  //   // current: postsCurrentPage,
  //   // setCurrent: setPostsCurrentPage,
  //   // pageCount,
  //   // pageSize: currentPageSize,
  //   // setPageSize: setCurrentPageSize,
  // } = useTable({
  //   syncWithLocation: true,
  //   resource: "posts",
  //   meta: {
  //     email: data?.data.email,
  //   },
  //   pagination: { current: 1, pageSize: 10 },
  //   sorters: {
  //     initial: [{ field: "id", order: "asc" }],
  //   },
  // });

  const handleUploadCsv = async ({ file }: { file: RcFile }) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_email", data?.data.email);

    try {
      const response = await axios.post(`${baseApiUrl}/csvs/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return true;
    } catch (error) {
      console.error("Error uploading file", error);
      return false;
    }
  };

  const handleUploadProfileImage = async ({ file }: { file: RcFile }) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_email", data?.data.email);

    try {
      const response = await axios.post(
        `${baseApiUrl}/users/upload-profile-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return true;
    } catch (error) {
      console.error("Error uploading file", error);
      return false;
    }
  };

  const handleUploadAttachment = async ({ file }: { file: RcFile }) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_email", data?.data.email);

    try {
      const response = await axios.post(
        `${baseApiUrl}/users/upload-attachment`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return true;
    } catch (error) {
      console.error("Error uploading file", error);
      return false;
    }
  };

  const handleSearchCreators = async (input: string) => {
    try {
      const response = await axios.get(
        `${LOCAL_API_URL}/creators/search?input=${input}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setCreators(response.data.rows); // Ensure this updates the state that is used in the Table
    } catch (error) {
      console.error("Error handleSearchCreators", error);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      handleSearchCreators(searchTerm);
    } else {
      setCreators([]);
    }
  }, [searchTerm]);

  if (isLoading || attachmentsIsLoading || creatorsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Email"
          name="email"
          initialValue={data?.data.email}
          rules={[
            {
              required: true,
              type: "email",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Name"
          name="name"
          initialValue={data?.data.name}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          initialValue={data?.data.password}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Total Initial Investment"
          name="totalInitialInvestment"
          initialValue={data?.data.totalInitialInvestment}
          rules={[
            {
              required: true,
              type: "number",
              min: 0,
            },
          ]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Estimated Executed Investment"
          name="estimatedExecutedInvestment"
          initialValue={data?.data.estimatedExecutedInvestment}
          rules={[
            {
              required: true,
              type: "number",
              min: 0,
            },
          ]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Campaign Name"
          name="campaignName"
          initialValue={data?.data.campaignName}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Color" name="color" initialValue={data?.data.color}>
          <input
            type="color"
            id="color"
            name="color"
            value={data?.data.color ?? "#0A0A0A"}
          />
        </Form.Item>
      </Form>

      <Form.Item label="Foto de Perfil">
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
          <Upload
            beforeUpload={async (file) =>
              await handleUploadProfileImage({ file: file })
            }
          >
            <Button icon={<UploadOutlined />}>
              {data?.data.performances[0]?.originalFilename
                ? "Clique para substituir a Foto de Perfil"
                : "Cique para fazer o upload da Foto de Perfil"}
            </Button>
          </Upload>
        </div>
      </Form.Item>

      <Form.Item label="Arquivo CSV">
        <div>
          {data?.data.performances[0]?.originalFilename ??
            "Nenhum CSV existente para esse usuario"}
        </div>
        <Upload
          beforeUpload={async (file) => await handleUploadCsv({ file: file })}
        >
          <Button icon={<UploadOutlined />}>
            {data?.data.performances[0]?.originalFilename
              ? "Clique para substituir o CSV"
              : "Cique para fazer o upload do CSV"}
          </Button>
        </Upload>
      </Form.Item>

      <Form.Item label="Anexos">
        <Upload
          beforeUpload={async (file) =>
            await handleUploadAttachment({ file: file })
          }
        >
          <Button icon={<UploadOutlined />}>
            Cique para fazer o upload de um Anexo
          </Button>
        </Upload>
        <List>
          <Table
            rowKey="id"
            dataSource={attachments?.data}
            pagination={{
              current: currentPage,
              pageSize: currentPageSize,
              total: attachments?.total,
              onChange: (page, pageSize) => {
                setCurrentPage(page);
                setCurrentPageSize(pageSize);
              },
            }}
          >
            <Table.Column dataIndex="id" title="ID" />
            <Table.Column dataIndex="originalFilename" title="Nome Original" />
            <Table.Column dataIndex="createdAt" title="Criado em" />
            <Table.Column
              title="Actions"
              dataIndex="actions"
              render={(_, record: BaseRecord) => (
                <Space>
                  <DeleteButton
                    hideText
                    size="small"
                    recordItemId={record.id}
                  />
                </Space>
              )}
            />
          </Table>
        </List>
      </Form.Item>

      <Form.Item label="Posts">
        <Input
          placeholder="Filter Posts By Influencer Name"
          // value={searchTerm}
          // onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "calc(100% - 200px)", marginRight: "8px" }}
        />
        <Button
          // onClick={handleButtonClick}
          type="primary"
          style={{ marginRight: "8px" }}
        >
          Search
        </Button>
        <Button
          // onClick={handleButtonClick}
          type="primary"
        >
          Search
        </Button>
        <List>
          <Table
            rowKey="id"
            dataSource={creators}
            pagination={{
              current: currentPage,
              pageSize: currentPageSize,
              total: creators.length,
              onChange: (page, pageSize) => {
                setCurrentPage(page);
                setCurrentPageSize(pageSize);
              },
            }}
          >
            {/* <Table.Column dataIndex="profile" title="Profile" /> */}
            <Table.Column
              dataIndex="image"
              title="Image"
              render={(text, record) => {
                return (
                  <img
                    src={text}
                    alt={text}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                  />
                );
              }}
            />
            <Table.Column dataIndex="name" title="Name" />
            <Table.Column dataIndex="creator_id" title="Creator ID" />
            {/* <Table.Column dataIndex="state" title="State" /> */}
          </Table>
        </List>
      </Form.Item>

      {/* <Form.Item label="Influencers">
        <Input
          placeholder="Search Influencers"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "calc(100% - 100px)", marginRight: "8px" }}
        />
        <Button onClick={handleButtonClick} type="primary">
          Search
        </Button>
        <List>
          <Table
            rowKey="id"
            dataSource={creators}
            pagination={{
              current: currentPage,
              pageSize: currentPageSize,
              total: creators.length,
              onChange: (page, pageSize) => {
                setCurrentPage(page);
                setCurrentPageSize(pageSize);
              },
            }}
          >
            <Table.Column dataIndex="profile" title="Profile" />
            <Table.Column
              dataIndex="image"
              title="Image"
              render={(text, record) => {
                return (
                  <img
                    src={text}
                    alt={text}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                  />
                );
              }}
            />
            <Table.Column dataIndex="name" title="Name" />
            <Table.Column dataIndex="creator_id" title="Creator ID" />
            <Table.Column dataIndex="state" title="State" />
          </Table>
        </List>
      </Form.Item> 
      */}
    </Edit>
  );
}

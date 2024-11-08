/* eslint-disable @next/next/no-img-element */
"use client";

import { Edit, useForm, useSelect } from "@refinedev/antd";
import { useOne } from "@refinedev/core";
import { Form, Input, Upload, Button, Select, DatePicker } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useParams } from "next/navigation";
import axios from "axios";
import { dataProvider } from "@providers/data-provider";
import { RcFile } from "antd/es/upload";

export default function UsersEdit() {
  const params = useParams<{ id: string }>();
  const { formProps, saveButtonProps } = useForm({});
  const { data, isLoading } = useOne({ resource: "creators", id: params.id });

  const baseApiUrl = dataProvider.getApiUrl();

  const { selectProps: categoriesSelectProps, queryResult: categoriesResult } =
    useSelect({
      resource: "categories",
      optionLabel: "category",
      optionValue: "id",
      defaultValue:
        isLoading === false && Array.isArray(data?.data.categories)
          ? data?.data.categories.map((item: { id: number }) => item.id)
          : [],
    });

  const handleUploadCreatorImage = async ({
    file,
    creatorId,
  }: {
    file: RcFile;
    creatorId: number;
  }) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${baseApiUrl}/users/upload-creator-image/${creatorId}`,
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Creator Name"
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
          label={"Creator City"}
          name={["city"]}
          rules={[
            {
              required: true,
              message: "Please enter the Creator City",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={"Categories"}
          name={["categories"]}
          rules={[
            {
              required: true,
              message: "Select the Categories this Creator has",
            },
          ]}
          getValueProps={(categories?: { id: number }[]) => {
            // console.log(categories, "categoeis");
            return { value: categories?.map((item) => item?.id) };
          }}
          getValueFromEvent={(args: number[]) => {
            return args.map((item) => ({
              id: item,
            }));
          }}
        >
          <Select
            {...categoriesSelectProps}
            mode="multiple"
            onChange={(value) => {
              console.log(value, "value");
              // formProps.form?.setFieldValue("categories", value);
            }}
          />
        </Form.Item>

        <Form.Item label="Creator Profile Picture" name="urlProfilePicture">
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {data?.data.urlProfilePicture ? (
              <img
                src={baseApiUrl + data?.data.urlProfilePicture}
                alt={data?.data.name}
                style={{ maxWidth: "250px", borderRadius: 30 }}
              />
            ) : (
              "Nenhuma Foto de Perfil existente para esse usuario"
            )}
            <Upload
              beforeUpload={async (file) =>
                await handleUploadCreatorImage({ file, creatorId: +params.id })
              }
            >
              <Button icon={<UploadOutlined />}>
                {data?.data.urlProfilePicture
                  ? "Clique para substituir a Foto de Perfil"
                  : "Cique para fazer o upload da Foto de Perfil"}
              </Button>
            </Upload>
          </div>
        </Form.Item>
      </Form>
    </Edit>
  );
}

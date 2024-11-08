/* eslint-disable @next/next/no-img-element */
"use client";

import {
  DeleteButton,
  Edit,
  EditButton,
  ShowButton,
  useForm,
  useModalForm,
} from "@refinedev/antd";
import { EyeOutlined } from "@ant-design/icons";
import { BaseRecord, useModal, useOne, useTable } from "@refinedev/core";
import {
  Form,
  Input,
  InputNumber,
  Upload,
  Button,
  List,
  Table,
  Space,
  Modal,
  Select,
  DatePicker,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useParams } from "next/navigation";
import axios from "axios";
import {
  BACKEND_API_URL,
  dataProvider,
  LOCAL_API_URL,
} from "@providers/data-provider";
import { RcFile } from "antd/es/upload";
import { useState, useEffect } from "react";
import {
  CreatorService,
  ICreatorsSearch,
  ICreatorsSearchResponse,
} from "@database/services/CreatorService";
import { Posts } from "@types";
import Link from "next/link";

export default function UsersEdit() {
  const params = useParams<{ id: string }>();
  const { formProps, saveButtonProps } = useForm({});
  const { data, isLoading } = useOne({ resource: "users", id: params.id });
  const baseApiUrl = dataProvider.getApiUrl();

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Category"
          name="category"
          initialValue={data?.data.category}
          rules={[
            {
              required: true,
              type: "string",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Edit>
  );
}

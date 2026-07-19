/* eslint-disable @next/next/no-img-element */
"use client";

import {
  DeleteButton,
  Edit,
  EditButton,
  ShowButton,
  useForm,
  useModalForm,
  useSelect,
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
  const { data, isLoading } = useOne({ resource: "posts-pack", id: params.id });

  const { selectProps: creatorsSelectProps, queryResult: creatorsResult } =
    useSelect({
      resource: "creators",
      optionLabel: "name",
      optionValue: "id",
      searchField: "name",
      debounce: 300,
    });

  const { selectProps: campaignsSelectProps, queryResult: campaignsResult } =
    useSelect({
      resource: "campaigns",
      optionLabel: "name",
      optionValue: "id",
      searchField: "name",
      debounce: 300,
    });

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label={"Creator"}
          name={["creatorId"]}
          initialValue={data?.data?.creatorId}
          rules={[
            {
              required: true,
              message: "Select the Creator this Post Pack belongs to",
            },
          ]}
        >
          <Select {...creatorsSelectProps} />
        </Form.Item>

        <Form.Item
          label={"Campanha"}
          name={["campaignId"]}
          initialValue={data?.data?.campaignId}
          rules={[
            {
              required: true,
              message: "Select the Campaign this Post Pack belongs to",
            },
          ]}
        >
          <Select {...campaignsSelectProps} />
        </Form.Item>

        <Form.Item
          label={"Price"}
          name={["price"]}
          initialValue={data?.data?.price}
          rules={[
            {
              required: true,
              message: "Please enter a valid number",
            },
          ]}
        >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          label={"Registrations"}
          name={["registrations"]}
          initialValue={data?.data?.price}
          rules={[
            {
              required: true,
              message: "Please enter a valid number",
            },
          ]}
        >
          <InputNumber min={0} />
        </Form.Item>
      </Form>
    </Edit>
  );
}

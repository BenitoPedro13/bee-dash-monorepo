/* eslint-disable @next/next/no-img-element */
"use client";

import { Edit, useForm, useSelect } from "@refinedev/antd";
import { useOne } from "@refinedev/core";
import { Form, Input, InputNumber, Select } from "antd";

import { useParams } from "next/navigation";

export default function UsersEdit() {
  const params = useParams<{ id: string }>();

  const { formProps, saveButtonProps } = useForm({});

  const { data, isLoading } = useOne({
    resource: "social-networks",
    id: params.id,
  });

  const { selectProps: creatorsSelectProps, queryResult: creatorsResult } =
    useSelect({
      resource: "creators",
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
              message: "Select the Creator this Social Network belongs to",
            },
          ]}
        >
          <Select {...creatorsSelectProps} />
        </Form.Item>

        <Form.Item
          label={"Social Network Type"}
          name={["type"]}
          initialValue={data?.data?.type}
          rules={[
            {
              required: true,
              message: "Please select the Social Network Type",
            },
          ]}
        >
          <Select>
            <Select.Option value="INSTAGRAM">Instagram</Select.Option>
            <Select.Option value="TIKTOK">TikTok</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label={"Username"}
          name={["username"]}
          initialValue={data?.data?.username}
          rules={[
            {
              required: true,
              message: "Please enter the Social Network Username",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={"Followers"}
          name={["followers"]}
          initialValue={data?.data?.followers}
          rules={[
            {
              required: true,
              message: "Please enter the Social Network Followers quantity",
            },
          ]}
        >
          <InputNumber />
        </Form.Item>
      </Form>
    </Edit>
  );
}

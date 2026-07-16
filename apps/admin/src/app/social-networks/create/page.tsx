"use client";

import { Create, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, InputNumber, Select } from "antd";

export default function UserCreate() {
  const { formProps, saveButtonProps } = useForm({});

  const { selectProps: creatorsSelectProps, queryResult: creatorsResult } =
    useSelect({
      resource: "creators",
      optionLabel: "name",
      optionValue: "id",
      searchField: "name",
      debounce: 300,
    });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label={"Creator"}
          name={["creatorId"]}
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
    </Create>
  );
}

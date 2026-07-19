"use client";

import { Create, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, InputNumber, Select } from "antd";

export default function UserCreate() {
  const { formProps, saveButtonProps } = useForm({});

  const { selectProps: usersSelectProps, queryResult: usersResult } = useSelect(
    {
      resource: "users",
      optionLabel: "email",
      searchField: "email",
      optionValue: "id",
      debounce: 300,
    }
  );

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label={"Campanign Name"}
          name={["name"]}
          rules={[
            {
              required: true,
              message: "Please enter the Campaign Name",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={"Usar dados dos Posts dos Creators"}
          name={["byPosts"]}
          initialValue={false}
          rules={[
            {
              required: true,
              type: "boolean",
              message:
                "Please indicate if the data should be based on the Posts Table or as the CSV File",
            },
          ]}
        >
          <Select>
            <Select.Option value={true}>Posts Table</Select.Option>
            <Select.Option value={false}>CSV Table</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label={"Table URL"}
          name={["urlTable"]}
          rules={[
            {
              required: false,
              type: "url",
              message: "Please enter a valid URL",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={"Usuario"}
          name={["userId"]}
          rules={[
            {
              required: true,
              message: "Selecione a qual usuario essa Campanha pertence.",
            },
          ]}
        >
          <Select {...usersSelectProps} />
        </Form.Item>

        <Form.Item
          label={"Campaign Image URL"}
          name={["imageUrl"]}
          rules={[
            {
              required: false,
              type: "url",
              message: "Please enter a valid URL",
            },
          ]}
        >
          <Input defaultValue="" disabled />
        </Form.Item>
      </Form>
    </Create>
  );
}

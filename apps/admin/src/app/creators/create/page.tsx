"use client";

import { Create, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, InputNumber, Select } from "antd";

export default function UserCreate() {
  const { formProps, saveButtonProps } = useForm({});

  const { selectProps: usersSelectProps, queryResult: usersResult } = useSelect(
    {
      resource: "users",
      optionLabel: "email",
      // optionLabel: "name",
      optionValue: "id",
    }
  );

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label={"Creator Name"}
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
          label={"Profile Picture URL"}
          name={["urlProfilePicture"]}
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

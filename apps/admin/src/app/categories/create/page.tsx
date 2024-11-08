"use client";

import { Create, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber, Select } from "antd";

export default function UserCreate() {
  const { formProps, saveButtonProps } = useForm({});

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label={"Category"}
          name={["category"]}
          rules={[
            {
              required: true,
              type: "string",
              message: "Please enter a valid category",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Create>
  );
}

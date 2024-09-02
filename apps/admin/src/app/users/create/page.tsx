"use client";

import { Create, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber, Select } from "antd";

export default function UserCreate() {
  const { formProps, saveButtonProps } = useForm({});

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label={"Email"}
          name={["email"]}
          rules={[
            {
              required: true,
              type: "email",
              message: "Please enter a valid email address",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={"Name"}
          name={["name"]}
          rules={[
            {
              required: true,
              message: "Please enter your name",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={"Password"}
          name={["password"]}
          rules={[
            {
              required: true,
              min: 8,
              message: "Password must be at least 8 characters",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        {/* <Form.Item
          label={"Usar dados dos Posts dos Creators"}
          name={["byPosts"]}
          initialValue={false}
          rules={[
            {
              required: true,
              type: "boolean",
              message:
                "Please indicate if the data should be based on the Posts Table or not.",
            },
          ]}
        >
          <Select>
            <Select.Option value={true}>Sim</Select.Option>
            <Select.Option value={false}>Não</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label={"Total Initial Investment"}
          name={["totalInitialInvestment"]}
          initialValue={0}
          rules={[
            {
              required: true,
              type: "number",
              message: "Please enter a valid number",
            },
          ]}
        >
          <InputNumber disabled min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label={"Estimated Executed Investment"}
          name={["estimatedExecutedInvestment"]}
          initialValue={0}
          rules={[
            {
              required: true,
              type: "number",
              message: "Please enter a valid number",
            },
          ]}
        >
          <InputNumber disabled min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label={"Campaign Name"}
          name={["campaignName"]}
          rules={[
            {
              required: true,
              message: "Please enter the campaign name",
            },
          ]}
        >
          <Input />
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
 */}
        <Form.Item
          label={"Color"}
          name={["color"]}
          initialValue={"#FF8C00"}
          rules={[
            {
              required: false,
              message: "Please enter a valid color code",
            },
          ]}
        >
          <Input disabled />
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
          <Input disabled />
        </Form.Item>
      </Form>
    </Create>
  );
}

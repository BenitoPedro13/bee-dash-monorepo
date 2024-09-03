"use client";

import { Create, useForm, useSelect } from "@refinedev/antd";
import { Form, Select } from "antd";
import { InputNumber } from "antd/lib";
export default function UserCreate() {
  const { formProps, saveButtonProps } = useForm({});

  const { selectProps: creatorsSelectProps, queryResult: creatorsResult } =
    useSelect({
      resource: "creators",
      optionLabel: "name",
      optionValue: "id",
    });

  const { selectProps: campaignsSelectProps, queryResult: campaignsResult } =
    useSelect({
      resource: "campaigns",
      optionLabel: "name",
      optionValue: "id",
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
              message: "Select the Creator this Post Pack belongs to",
            },
          ]}
        >
          <Select {...creatorsSelectProps} />
        </Form.Item>

        <Form.Item
          label={"Campanha"}
          name={["campaignId"]}
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
          // initialValue={0}
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
    </Create>
  );
}

"use client";

import { Create, useForm, useSelect } from "@refinedev/antd";
import { DatePicker, Form, Select } from "antd";
import { InputNumber } from "antd/lib";
export default function UserCreate() {
  const { formProps, saveButtonProps } = useForm({});

  const {
    selectProps: socialNetworksSelectProps,
    queryResult: socialNetworksResult,
  } = useSelect({
    resource: "social-networks",
    optionLabel: "username",
    optionValue: "id",
  });

  const { selectProps: postsPackSelectProps, queryResult: postsPackResult } =
    useSelect({
      resource: "posts-pack",
      optionLabel: "name",
      optionValue: "id",
    });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label={"Post Type"}
          name={["type"]}
          rules={[
            {
              required: true,
              message: "Please select the Post Type",
            },
          ]}
        >
          <Select>
            <Select.Option value="FEED">Feed</Select.Option>
            <Select.Option value="STORIES">Stories</Select.Option>
            <Select.Option value="REELS">Reels</Select.Option>
            <Select.Option value="TIKTOK">Tiktok</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label={"Impressions"}
          initialValue={0}
          name={["impressions"]}
          rules={[
            {
              type: "number",
              message: "Please enter a valid number of Impressions",
            },
          ]}
        >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          label={"Interactions"}
          name={["interactions"]}
          initialValue={undefined}
          rules={[
            {
              type: "number",
              message: "Please enter a valid number of Interactions",
            },
          ]}
        >
          <InputNumber disabled min={0} />
        </Form.Item>

        <Form.Item
          label={"Likes"}
          initialValue={0}
          name={["likes"]}
          rules={[
            {
              type: "number",
              message: "Please enter a valid number of Likes",
            },
          ]}
        >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          label={"Shares"}
          initialValue={0}
          name={["shares"]}
          rules={[
            {
              type: "number",
              message: "Please enter a valid number of Shares",
            },
          ]}
        >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          label={"Comments"}
          initialValue={0}
          name={["comments"]}
          rules={[
            {
              type: "number",
              message: "Please enter a valid number of Comments",
            },
          ]}
        >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          label={"Saves"}
          initialValue={0}
          name={["saves"]}
          rules={[
            {
              type: "number",
              message: "Please enter a valid number of Saves",
            },
          ]}
        >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          label={"Clicks"}
          name={["clicks"]}
          initialValue={undefined}
          rules={[
            {
              type: "number",
              message: "Please enter a valid number of Clicks",
            },
          ]}
        >
          <InputNumber disabled min={0} />
        </Form.Item>

        <Form.Item
          label={"Sticker Clicks"}
          initialValue={0}
          name={["stickerClicks"]}
          rules={[
            {
              type: "number",
              message: "Please enter a valid number of Sticker Clicks",
            },
          ]}
        >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          label={"Link Clicks"}
          initialValue={0}
          name={["linkClicks"]}
          rules={[
            {
              type: "number",
              message: "Please enter a valid number of Link Clicks",
            },
          ]}
        >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          label={"Post Date"}
          name={["postDate"]}
          rules={[
            {
              required: true,
              message: "Please select the Post Date",
            },
          ]}
        >
          <DatePicker />
        </Form.Item>

        <Form.Item
          label={"Social Network"}
          name={["socialNetworkId"]}
          rules={[
            {
              required: true,
              message: "Select the Social Network this Post belongs to",
            },
          ]}
        >
          <Select {...socialNetworksSelectProps} />
        </Form.Item>

        <Form.Item
          label={"Post Pack"}
          name={["postsPackId"]}
          rules={[
            {
              required: true,
              message: "Select the Post Pack this Post belongs to",
            },
          ]}
        >
          <Select {...postsPackSelectProps} />
        </Form.Item>
      </Form>
    </Create>
  );
}

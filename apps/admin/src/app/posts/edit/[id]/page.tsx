/* eslint-disable @next/next/no-img-element */
"use client";

import { DateField, Edit, useForm, useSelect } from "@refinedev/antd";

import { useOne } from "@refinedev/core";
import { Form, InputNumber, Select, DatePicker, Input } from "antd";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function UsersEdit() {
  const params = useParams<{ id: string }>();
  const { formProps, saveButtonProps } = useForm({});
  const { data, isLoading } = useOne({ resource: "posts", id: params.id });
  const [postDate, setPostDate] = useState<string>(data?.data?.postDate);

  const {
    selectProps: socialNetworkSelectProps,
    queryResult: socialNetworkResult,
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
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label={"Post Type"}
          name={["type"]}
          initialValue={data?.data?.type}
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
          initialValue={data?.data?.impressions}
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
          initialValue={data?.data?.likes}
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
          initialValue={data?.data?.shares}
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
          initialValue={data?.data?.comments}
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
          initialValue={data?.data?.saves}
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
          initialValue={data?.data?.stickerClicks}
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
          initialValue={data?.data?.linkClicks}
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
          initialValue={data?.data?.postDate}
          name={["postDate"]}
          rules={[
            {
              required: true,
              message: "Please select the Post Date",
            },
          ]}
          style={{ marginBottom: "0px" }}
        >
          {null}
        </Form.Item>

        <DatePicker
          style={{ position: "relative", top: "-31px" }}
          defaultValue={dayjs(data?.data?.postDate)}
          value={dayjs(postDate ?? data?.data?.postDate)}
          onChange={(date) => {
            setPostDate(() => date.toISOString());
            formProps.form?.setFieldValue("postDate", date.toISOString());
          }}
        />

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
          <Select {...socialNetworkSelectProps} />
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
    </Edit>
  );
}

/* eslint-disable @next/next/no-img-element */
"use client";

import { Create, useForm } from "@refinedev/antd";
import {
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  Button,
  Table,
  Space,
} from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import { dataProvider, LOCAL_API_URL } from "@providers/data-provider";
import {
  CreatorService,
  ICreatorsSearchResponse,
} from "@database/services/CreatorService";

export default function PostsCreate() {
  const creatorsService = new CreatorService();
  const { formProps, saveButtonProps } = useForm({});
  const [searchTerm, setSearchTerm] = useState("");
  const [creators, setCreators] = useState<ICreatorsSearchResponse>([]);
  const [creatorsLoading, setCreatorsLoading] = useState(false);
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(
    null
  );

  const handleSearchCreators = async (input: string) => {
    try {
      const response = await creatorsService.searchByCreatorName(input);

      if (!response) {
        return;
      }

      setCreators(response);
    } catch (error) {
      console.error("Error handleSearchCreators", error);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      handleSearchCreators(searchTerm);
    } else {
      setCreators([]);
    }
  }, [searchTerm]);

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label={"Type"}
          name={["type"]}
          rules={[
            {
              required: true,
              message: "Please select the type",
            },
          ]}
        >
          <Select>
            <Select.Option value="FEED">Feed</Select.Option>
            <Select.Option value="STORIES">Stories</Select.Option>
            <Select.Option value="TIKTOK">Tiktok</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label={"Is Video"}
          name={["isVideo"]}
          rules={[
            {
              required: true,
              message: "Please indicate if this is a video",
            },
          ]}
        >
          <Select>
            <Select.Option value={true}>Sim</Select.Option>
            <Select.Option value={false}>Não</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label={"Impressions"}
          name={["impressions"]}
          rules={[
            {
              required: true,
              type: "number",
              message: "Please enter a valid number of impressions",
            },
          ]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label={"Interactions"}
          name={["interactions"]}
          rules={[
            {
              required: true,
              type: "number",
              message: "Please enter a valid number of interactions",
            },
          ]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label={"Clicks"}
          name={["clicks"]}
          rules={[
            {
              required: true,
              type: "number",
              message: "Please enter a valid number of clicks",
            },
          ]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label={"Video Views"}
          name={["videoViews"]}
          rules={[
            {
              required: true,
              type: "number",
              message: "Please enter a valid number of video views",
            },
          ]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label={"Engagement"}
          name={["engagement"]}
          rules={[
            {
              required: true,
              type: "number",
              message: "Please enter a valid engagement value",
            },
          ]}
        >
          <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label={"Price"}
          name={["price"]}
          rules={[
            {
              required: true,
              type: "number",
              message: "Please enter a valid price",
            },
          ]}
        >
          <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label={"Post Date"}
          name={["postDate"]}
          rules={[
            {
              required: true,
              message: "Please select the post date",
            },
          ]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label={"Influencer"}
          name={["creatorId"]}
          rules={[
            {
              required: true,
              message: "Please select an influencer",
            },
          ]}
        >
          <div>
            <Input
              placeholder="Search Influencers"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "calc(100% - 100px)", marginRight: "8px" }}
            />
            <Button
              onClick={() => handleSearchCreators(searchTerm)}
              type="primary"
            >
              Search
            </Button>
            <Table
              rowKey="id"
              dataSource={creators}
              pagination={false}
              loading={creatorsLoading}
              onRow={(record) => ({
                onClick: () => {
                  setSelectedCreatorId(record.creator_id);
                  formProps.form?.setFieldValue("creatorId", record.id);
                },
                style: {
                  cursor: "pointer",
                  backgroundColor:
                    record.id === selectedCreatorId ? "#e6f7ff" : undefined,
                },
              })}
            >
              <Table.Column dataIndex="name" title="Name" />
              <Table.Column dataIndex="creator_id" title="Creator ID" />
              <Table.Column
                dataIndex="image"
                title="Image"
                render={(text, record) => (
                  <img
                    src={text}
                    alt={text}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                  />
                )}
              />
            </Table>
          </div>
        </Form.Item>

        <Form.Item
          label={"Performance ID"}
          name={["performanceId"]}
          rules={[
            {
              required: true,
              type: "number",
              message: "Please enter a valid performance ID",
            },
          ]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Create>
  );
}

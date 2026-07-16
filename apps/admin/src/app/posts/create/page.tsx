"use client";

import { Create, useForm, useSelect } from "@refinedev/antd";
import {
  Alert,
  Button,
  DatePicker,
  Descriptions,
  Form,
  Select,
  Space,
  Upload,
} from "antd";
import { InputNumber } from "antd/lib";
import { UploadOutlined } from "@ant-design/icons";
import type { RcFile, UploadFile } from "antd/es/upload/interface";
import axios from "axios";
import { useState } from "react";
import { dataProvider } from "@providers/data-provider";

type StoriesMetricField =
  | "impressions"
  | "likes"
  | "comments"
  | "shares"
  | "stickerClicks"
  | "linkClicks";

const STORIES_METRIC_FIELDS: StoriesMetricField[] = [
  "impressions",
  "likes",
  "comments",
  "shares",
  "stickerClicks",
  "linkClicks",
];

interface ExtractedMetricField {
  found: boolean;
  value: number | null;
  confidence: "high" | "low";
}

interface ExtractStoriesInsightsResponse {
  extracted: Record<StoriesMetricField, ExtractedMetricField>;
  unmapped: { label: string; value: string }[];
  warnings: string[];
  uniqueFilenames: string[];
}

export default function UserCreate() {
  const { formProps, saveButtonProps } = useForm({});
  const baseApiUrl = dataProvider.getApiUrl();

  const postType = Form.useWatch("type", formProps.form);

  const [screenshotFiles, setScreenshotFiles] = useState<UploadFile[]>([]);
  const [extracting, setExtracting] = useState(false);
  const [autoFilledFields, setAutoFilledFields] = useState<
    Set<StoriesMetricField>
  >(new Set());
  const [lowConfidenceFields, setLowConfidenceFields] = useState<
    StoriesMetricField[]
  >([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [unmapped, setUnmapped] = useState<
    { label: string; value: string }[]
  >([]);

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
      optionLabel: (postsPack) => {
        const record = postsPack as Record<string, any>;
        const creatorName = record?.creator?.name ?? "Unknown creator";
        const campaignName = record?.campaign?.name ?? "No campaign";
        const price = (record?.price ?? 0).toLocaleString("pt-BR", {
          currency: "BRL",
          style: "currency",
        });
        return `${creatorName} · ${campaignName} · ${price}`;
      },
      optionValue: "id",
      searchField: "name",
      debounce: 300,
    });

  const handleExtractFromScreenshots = async () => {
    if (screenshotFiles.length === 0) return;

    setExtracting(true);
    setWarnings([]);
    setUnmapped([]);
    setAutoFilledFields(new Set());
    setLowConfidenceFields([]);

    try {
      const formData = new FormData();
      for (const file of screenshotFiles) {
        formData.append("files", (file.originFileObj ?? file) as RcFile);
      }

      const { data } = await axios.post<ExtractStoriesInsightsResponse>(
        `${baseApiUrl}/insights-extraction/stories`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const filled = new Set<StoriesMetricField>();
      const lowConfidence: StoriesMetricField[] = [];
      const formValues: Partial<Record<StoriesMetricField, number>> = {};

      for (const field of STORIES_METRIC_FIELDS) {
        const result = data.extracted[field];
        if (!result) continue;

        if (result.found && result.confidence === "high" && result.value !== null) {
          formValues[field] = result.value;
          filled.add(field);
        } else if (result.found && result.confidence === "low") {
          lowConfidence.push(field);
        } else if (!result.found) {
          lowConfidence.push(field);
        }
      }

      formProps.form?.setFieldsValue(formValues);
      setAutoFilledFields(filled);
      setLowConfidenceFields(lowConfidence);
      setWarnings(data.warnings ?? []);
      setUnmapped(data.unmapped ?? []);
    } catch (error) {
      console.error("Error extracting insights from screenshots", error);
      setWarnings([
        "Failed to extract data from the screenshot(s) — please fill in the fields manually.",
      ]);
    } finally {
      setExtracting(false);
    }
  };

  const fieldExtra = (field: StoriesMetricField) => {
    if (autoFilledFields.has(field)) {
      return "Auto-filled from screenshot — tap to edit";
    }
    if (lowConfidenceFields.includes(field)) {
      return "Not confidently read from the screenshot — please check manually";
    }
    return undefined;
  };

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

        {postType === "STORIES" && (
          <Form.Item label="Import from screenshot">
            <Space direction="vertical" style={{ width: "100%" }}>
              <Upload
                multiple
                listType="picture"
                fileList={screenshotFiles}
                beforeUpload={() => false}
                onChange={({ fileList }) =>
                  setScreenshotFiles(fileList.slice(0, 6))
                }
                onRemove={(file) =>
                  setScreenshotFiles((prev) =>
                    prev.filter((item) => item.uid !== file.uid)
                  )
                }
              >
                <Button icon={<UploadOutlined />}>
                  Add Instagram Insights screenshot(s)
                </Button>
              </Upload>

              <Button
                type="primary"
                disabled={screenshotFiles.length === 0}
                loading={extracting}
                onClick={handleExtractFromScreenshots}
              >
                Extract from screenshot(s)
              </Button>

              {warnings.length > 0 && (
                <Alert
                  type="warning"
                  showIcon
                  message="Review before saving"
                  description={
                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                      {warnings.map((warning, index) => (
                        <li key={index}>{warning}</li>
                      ))}
                    </ul>
                  }
                />
              )}

              {unmapped.length > 0 && (
                <Descriptions
                  size="small"
                  bordered
                  column={1}
                  title="Found in screenshot but not tracked yet"
                >
                  {unmapped.map((item, index) => (
                    <Descriptions.Item key={index} label={item.label}>
                      {item.value}
                    </Descriptions.Item>
                  ))}
                </Descriptions>
              )}
            </Space>
          </Form.Item>
        )}

        <Form.Item
          label={"Impressions"}
          initialValue={0}
          name={["impressions"]}
          extra={fieldExtra("impressions")}
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
          extra={fieldExtra("likes")}
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
          extra={fieldExtra("shares")}
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
          extra={fieldExtra("comments")}
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
          extra={fieldExtra("stickerClicks")}
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
          extra={fieldExtra("linkClicks")}
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

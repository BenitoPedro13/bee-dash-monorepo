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

type PostsMetricField =
  | "impressions"
  | "likes"
  | "comments"
  | "shares"
  | "saves"
  | "stickerClicks"
  | "linkClicks";

interface ScreenshotExtractionConfig {
  endpoint: string;
  maxFiles: number;
  fields: PostsMetricField[];
}

// Mirrors apps/api/src/insights-extraction/dto/extract-insights-response.dto.ts —
// keep the field lists in sync with STORIES_METRIC_FIELDS / REELS_METRIC_FIELDS.
const SCREENSHOT_EXTRACTION_CONFIG: Partial<
  Record<string, ScreenshotExtractionConfig>
> = {
  STORIES: {
    endpoint: "stories",
    maxFiles: 6,
    fields: ["impressions", "likes", "comments", "shares", "stickerClicks", "linkClicks"],
  },
  REELS: {
    endpoint: "reels",
    maxFiles: 8,
    fields: ["impressions", "likes", "comments", "shares", "saves"],
  },
};

interface ExtractedMetricField {
  found: boolean;
  value: number | null;
  confidence: "high" | "low";
}

interface ExtractInsightsResponse {
  extracted: Partial<Record<PostsMetricField, ExtractedMetricField>>;
  allMetrics: { label: string; value: string }[];
  warnings: string[];
  uniqueFilenames: string[];
}

export default function UserCreate() {
  const { formProps, saveButtonProps } = useForm({});
  const baseApiUrl = dataProvider.getApiUrl();

  const postType = Form.useWatch("type", formProps.form);
  const extractionConfig = SCREENSHOT_EXTRACTION_CONFIG[postType as string];

  const [screenshotFiles, setScreenshotFiles] = useState<UploadFile[]>([]);
  const [extracting, setExtracting] = useState(false);
  const [autoFilledFields, setAutoFilledFields] = useState<
    Set<PostsMetricField>
  >(new Set());
  const [lowConfidenceFields, setLowConfidenceFields] = useState<
    PostsMetricField[]
  >([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [allMetrics, setAllMetrics] = useState<
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
        return `${creatorName} · ${campaignName}`;
      },
      optionValue: "id",
      searchField: "name",
      debounce: 300,
    });

  const handleExtractFromScreenshots = async () => {
    if (!extractionConfig || screenshotFiles.length === 0) return;

    setExtracting(true);
    setWarnings([]);
    setAllMetrics([]);
    setAutoFilledFields(new Set());
    setLowConfidenceFields([]);

    try {
      const formData = new FormData();
      for (const file of screenshotFiles) {
        formData.append("files", (file.originFileObj ?? file) as RcFile);
      }

      const { data } = await axios.post<ExtractInsightsResponse>(
        `${baseApiUrl}/insights-extraction/${extractionConfig.endpoint}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const filled = new Set<PostsMetricField>();
      const lowConfidence: PostsMetricField[] = [];
      const formValues: Partial<Record<PostsMetricField, number>> = {};

      for (const field of extractionConfig.fields) {
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
      setAllMetrics(data.allMetrics ?? []);
    } catch (error) {
      console.error("Error extracting insights from screenshots", error);
      setWarnings([
        "Failed to extract data from the screenshot(s) — please fill in the fields manually.",
      ]);
    } finally {
      setExtracting(false);
    }
  };

  const fieldExtra = (field: PostsMetricField) => {
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

        {extractionConfig && (
          <Form.Item label="Import from screenshot">
            <Space direction="vertical" style={{ width: "100%" }}>
              <Upload
                multiple
                listType="picture"
                fileList={screenshotFiles}
                beforeUpload={() => false}
                onChange={({ fileList }) =>
                  setScreenshotFiles(
                    fileList.slice(0, extractionConfig.maxFiles)
                  )
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

              {allMetrics.length > 0 && (
                <Descriptions
                  size="small"
                  bordered
                  column={1}
                  title="All metrics found in screenshot(s)"
                >
                  {allMetrics.map((item, index) => (
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
          extra={fieldExtra("saves")}
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

/* eslint-disable @next/next/no-img-element */
"use client";

import {
  DeleteButton,
  Edit,
  EditButton,
  ShowButton,
  useForm,
  useModalForm,
  useSelect,
} from "@refinedev/antd";
import { EyeOutlined } from "@ant-design/icons";
import { BaseRecord, useModal, useOne, useTable } from "@refinedev/core";
import {
  Form,
  Input,
  InputNumber,
  Upload,
  Button,
  List,
  Table,
  Space,
  Modal,
  Select,
  DatePicker,
} from "antd";

const { TextArea } = Input;
import { UploadOutlined } from "@ant-design/icons";
import { useParams } from "next/navigation";
import axios from "axios";
import {
  BACKEND_API_URL,
  dataProvider,
  LOCAL_API_URL,
} from "@providers/data-provider";
import { RcFile } from "antd/es/upload";
import { useState, useEffect } from "react";
import {
  CreatorService,
  ICreatorsSearch,
  ICreatorsSearchResponse,
} from "@database/services/CreatorService";
import { Posts } from "@types";
import Link from "next/link";

export default function UsersEdit() {
  const params = useParams<{ id: string }>();
  const { formProps, saveButtonProps } = useForm({});
  const { data, isLoading } = useOne({ resource: "campaigns", id: params.id });
  const { selectProps: usersSelectProps, queryResult: usersResult } = useSelect(
    {
      resource: "users",
      optionLabel: "email",
      optionValue: "id",
    }
  );
  const baseApiUrl = dataProvider.getApiUrl();

  const { selectProps: categoriesSelectProps, queryResult: categoriesResult } =
    useSelect({
      resource: "categories",
      optionLabel: "category",
      optionValue: "id",
      // defaultValue:
      //   isLoading === false && Array.isArray(data?.data.categories)
      //     ? data?.data.categories.map((item: { id: number }) => item.id)
      //     : [],
    });

  const [searchTerm, setSearchTerm] = useState("");
  const [creatorsSearch, setCreatorsSearch] = useState("");
  const [creators, setCreators] = useState<ICreatorsSearchResponse>([]);
  const [selectedPostsCreatorId, setSelectedPostsCreatorId] = useState<
    string | null
  >(null);

  const [creatorsLoading, setCreatorsLoading] = useState(false);

  const [creatorsData, setCreatorsData] = useState<ICreatorsSearchResponse>([]);
  const [creatorsDataFiltered, setCreatorsDataFiltered] =
    useState<ICreatorsSearchResponse>([]);
  const [creatorsDataLoading, setCreatorsDataLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPostsModalCreatorId, setSelectedPostsModalCreatorId] =
    useState<string | null>(null);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const {
    tableQueryResult: { data: attachments, isLoading: attachmentsIsLoading },
    current: attachmentsCurrentPage,
    setCurrent: attachmentsSetCurrentPage,
    // pageCount: attachmentsPageCount,
    pageSize: attachmentsCurrentPageSize,
    setPageSize: attachmentsSetCurrentPageSize,
  } = useTable({
    syncWithLocation: false,
    resource: "attachments",
    meta: {
      email: data?.data.email,
    },
    pagination: { current: 1, pageSize: 20 },
    sorters: {
      initial: [{ field: "id", order: "asc" }],
    },
  });

  const {
    tableQueryResult: { data: posts, isLoading: postsIsLoading },
    current: postsCurrentPage,
    setCurrent: postsSetCurrentPage,
    // pageCount,
    pageSize: postsCurrentPageSize,
    setPageSize: postsSetCurrentPageSize,
  } = useTable<Posts>({
    syncWithLocation: false,
    resource: "posts",
    meta: {
      email: data?.data.email,
    },
    pagination: { current: 1, pageSize: 20 },
    sorters: {
      initial: [{ field: "id", order: "asc" }],
    },
  });

  const {
    modalProps: createModalProps,
    formProps: createFormProps,
    show: createModalShow,
    onFinish: createModalOnFinish,
    close: createModalClose,
  } = useModalForm({
    syncWithLocation: false,
    action: "create",
    resource: "posts",
    autoResetForm: true,
    autoSubmitClose: false,
    warnWhenUnsavedChanges: false,
  });

  const modalProps = useModal();

  const handleUploadCsv = async ({ file }: { file: RcFile }) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_email", data?.data.email);

    try {
      const response = await axios.post(`${baseApiUrl}/csvs/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return true;
    } catch (error) {
      console.error("Error uploading file", error);
      return false;
    }
  };

  const handleUploadProfileImage = async ({ file }: { file: RcFile }) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_email", data?.data.email);

    try {
      const response = await axios.post(
        `${baseApiUrl}/users/upload-profile-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return true;
    } catch (error) {
      console.error("Error uploading file", error);
      return false;
    }
  };

  const handleUploadAttachment = async ({ file }: { file: RcFile }) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_email", data?.data.email);

    try {
      const response = await axios.post(
        `${baseApiUrl}/users/upload-attachment`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return true;
    } catch (error) {
      console.error("Error uploading file", error);
      return false;
    }
  };

  const handleUploadCampaignImage = async ({
    file,
    campaignId,
  }: {
    file: RcFile;
    campaignId: number;
  }) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("campaignId", `${campaignId}`);

    try {
      const response = await axios.post(
        `${baseApiUrl}/users/upload-campaign-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return true;
    } catch (error) {
      console.error("Error uploading file", error);
      return false;
    }
  };

  const creatorsService = new CreatorService();

  const handleSearchCreatorsByName = async (input: string) => {
    try {
      setCreatorsLoading(true);
      const response = await creatorsService.searchByCreatorName(input);

      if (!response) {
        return;
      }

      setCreators(response);
    } catch (error) {
      console.error("Error handleSearchCreatorsByName", error);
    } finally {
      setCreatorsLoading(false);
    }
  };

  const handleSearchCreatorsById = async (input: string) => {
    try {
      setCreatorsLoading(true);
      return await creatorsService.searchByCreatorId(input);
    } catch (error) {
      console.error("Error handleSearchCreatorsById", error);
    } finally {
      setCreatorsLoading(false);
    }
  };

  useEffect(() => {
    const fetchCreatorsData = async () => {
      if (posts && posts.data.length > 0) {
        setCreatorsDataLoading(true);

        console.log(posts, "posts");

        // Get unique creator IDs
        const unduplicatedCreatorsIds = Array.from(
          posts.data
            .filter((item) => item.userEmail === data?.data.email)
            .reduce(
              (map, item) => map.set(`${item.creatorId}`, item.creatorId),
              new Map<string, string>()
            )
            .values()
        );

        try {
          // Fetch creator data
          const creatorsData = await Promise.all(
            unduplicatedCreatorsIds.map((id) => handleSearchCreatorsById(id))
          );

          // Filter out undefined values
          const creatorsDataWithoutUndefined = creatorsData.filter(
            (item) => item !== undefined
          );

          // Count posts per creator
          const postCounts = posts.data.reduce((acc, post) => {
            acc[post.creatorId] = (acc[post.creatorId] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          // Update creatorsData with post counts
          const creatorsDataWithPostCount = creatorsDataWithoutUndefined.map(
            (creator) => ({
              ...creator,
              postCount: postCounts[creator.creator_id] || 0,
            })
          );

          console.log("creatorsDataWithPostCount", creatorsDataWithPostCount);

          setCreatorsData(creatorsDataWithPostCount);
          setCreatorsDataFiltered(creatorsDataWithPostCount);
        } catch (error) {
          console.error("Error fetching creators data:", error);
        } finally {
          setCreatorsDataLoading(false);
        }
      } else {
        setCreatorsData([]);
      }
    };

    fetchCreatorsData();
  }, [posts]);

  if (isLoading || attachmentsIsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Campaign Name"
          name="name"
          initialValue={data?.data.name}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Campaign Image" name="imageUrl">
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {data?.data.imageUrl ? (
              <img
                src={baseApiUrl + data?.data.imageUrl}
                alt={data?.data.name}
                style={{ maxWidth: "250px", borderRadius: 30 }}
              />
            ) : (
              "Nenhuma Foto de Perfil existente para esse usuario"
            )}
            <Upload
              beforeUpload={async (file) =>
                await handleUploadCampaignImage({
                  file,
                  campaignId: +params.id,
                })
              }
            >
              <Button icon={<UploadOutlined />}>
                {data?.data.imageUrl
                  ? "Clique para substituir a Imagem"
                  : "Cique para fazer o upload da Imagem"}
              </Button>
            </Upload>
          </div>
        </Form.Item>

        <Form.Item
          label="Table URL"
          name="urlTable"
          initialValue={data?.data.urlTable}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={"Usar dados dos Posts dos Creators"}
          name={"byPosts"}
          rules={[
            {
              required: true,
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
          label={"Categories"}
          name={["categories"]}
          rules={[
            {
              required: true,
              message: "Select the Categories this Creator has",
            },
          ]}
          getValueProps={(categories?: { id: number }[]) => {
            // console.log(categories, "categoeis");
            return { value: categories?.map((item) => item?.id) };
          }}
          getValueFromEvent={(args: number[]) => {
            return args.map((item) => ({
              id: item,
            }));
          }}
        >
          <Select
            {...categoriesSelectProps}
            mode="multiple"
            onChange={(value) => {
              console.log(value, "value");
              // formProps.form?.setFieldValue("categories", value);
            }}
          />
        </Form.Item>

        <Form.Item
          label={"O que rolou em geral? (Feedback)"}
          name={["campaignOverview"]}
          rules={[
            {
              required: false,
              message: "Insira o texto a ser mostrado no relatório da campanha",
            },
          ]}
        >
          <TextArea
            placeholder="Durante o período da campanha, foram realizados 46 posts, que alcançaram um impacto bruto de 34.459 visualizações. Esses números mostram o poder de distribuição do conteúdo e a eficácia em atrair a atenção do público. Além disso, a campanha teve uma taxa de cliques de 4,5%, o que indica que o conteúdo gerado conseguiu engajar bem a audiência, levando-os a interagir com os links e chamadas para ação. O total de interações chegou a 540, o que inclui curtidas, compartilhamentos, comentários e outras formas de engajamento direto com as postagens."
            allowClear
            rows={5}

            // onChange={onChange}
          />
        </Form.Item>

        <Form.Item
          label={"Análise Final (Feedback)"}
          name={["finalAnalysis"]}
          rules={[
            {
              required: false,
              message: "Insira o texto a ser mostrado no relatório da campanha",
            },
          ]}
        >
          <TextArea
            placeholder="A campanha de social media da Movida não apenas alcançou um público relevante, como também obteve uma excelente performance em termos de engajamento e interação com os usuários.

A taxa de cliques de 4,5% é um indicativo claro de que o conteúdo foi atrativo e despertou o interesse dos seguidores, incentivando a participação e o envolvimento com a marca.

Recomendamos manter a estratégia de trabalhar com influenciadores relevantes, como Alanzoka, e continuar explorando conteúdos que aumentem o engajamento da comunidade. A campanha demonstrou que a combinação de conteúdo relevante e parcerias estratégicas pode ser uma fórmula eficaz para aumentar o alcance e a presença da Movida no cenário digital."
            allowClear
            rows={5}
            // onChange={onChange}
          />
        </Form.Item>
      </Form>

      {/* <Form.Item label="Foto de Perfil">
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {data?.data.urlProfilePicture ? (
            <img
              src={baseApiUrl + data?.data.urlProfilePicture}
              alt={data?.data.name}
              style={{ maxWidth: "500px" }}
            />
          ) : (
            "Nenhuma Foto de Perfil existente para esse usuario"
          )}
          <Upload
            beforeUpload={async (file) =>
              await handleUploadProfileImage({ file: file })
            }
          >
            <Button icon={<UploadOutlined />}>
              {data?.data.urlProfilePicture
                ? "Clique para substituir a Foto de Perfil"
                : "Cique para fazer o upload da Foto de Perfil"}
            </Button>
          </Upload>
        </div>
      </Form.Item> */}

      {!data?.data.byPosts && (
        <Form.Item label="Arquivo CSV">
          <div>
            {data?.data.performances[0]?.originalFilename ??
              "Nenhum CSV existente para esse usuario"}
          </div>
          <Upload
            beforeUpload={async (file) => await handleUploadCsv({ file: file })}
          >
            <Button icon={<UploadOutlined />}>
              {data?.data.performances[0]?.originalFilename
                ? "Clique para substituir o CSV"
                : "Cique para fazer o upload do CSV"}
            </Button>
          </Upload>
        </Form.Item>
      )}

      {/* <Form.Item label="Creator Images">
        <Upload
          beforeUpload={async (file) =>
            await handleUploadCreatorImage({ file: file })
          }
        >
          <Button icon={<UploadOutlined />}>
            Cique para fazer o upload da Imagem de um Influencer
          </Button>
        </Upload>
        <List>
          <Table
            scroll={{
              x: true,
            }}
            rowKey="id"
            dataSource={attachments?.data.filter((item) =>
              item.uniqueFilename.includes("-creatorImage-")
            )}
            pagination={{
              current: attachmentsCurrentPage,
              pageSize: attachments?.data.filter((item) =>
                item.uniqueFilename.includes("-creatorImage-")
              ).length,
              total: attachments?.data.filter((item) =>
                item.uniqueFilename.includes("-creatorImage-")
              ).length,
              onChange: (page, pageSize) => {
                attachmentsSetCurrentPage(page);
                attachmentsSetCurrentPageSize(pageSize);
              },
            }}
          >
            <Table.Column dataIndex="id" title="ID" />
            <Table.Column dataIndex="originalFilename" title="Nome Original" />
            <Table.Column
              dataIndex="lintToAtachment"
              title="Link da Imagem"
              render={(_, record: BaseRecord) => (
                <Link
                  href={`${BACKEND_API_URL}/public/${record.uniqueFilename}`}
                >{`${BACKEND_API_URL}/public/${record.uniqueFilename}`}</Link>
              )}
            />
            <Table.Column dataIndex="createdAt" title="Criado em" />
            <Table.Column
              title="Actions"
              dataIndex="actions"
              render={(_, record: BaseRecord) => (
                <Space>
                  <DeleteButton
                    hideText
                    resource="attachments"
                    size="small"
                    recordItemId={record.id}
                  />
                </Space>
              )}
            />
          </Table>
        </List>
      </Form.Item> */}

      <Form.Item label="Anexos">
        <Upload
          beforeUpload={async (file) =>
            await handleUploadAttachment({ file: file })
          }
        >
          <Button icon={<UploadOutlined />}>
            Cique para fazer o upload de um Anexo
          </Button>
        </Upload>
        <List>
          <Table
            scroll={{
              x: true,
            }}
            rowKey="id"
            dataSource={attachments?.data.filter(
              (item) => !item.uniqueFilename.includes("-creatorImage-")
            )}
            pagination={{
              current: attachmentsCurrentPage,
              pageSize: attachments?.data.filter(
                (item) => !item.uniqueFilename.includes("-creatorImage-")
              ).length,
              total: attachments?.data.filter(
                (item) => !item.uniqueFilename.includes("-creatorImage-")
              ).length,
              onChange: (page, pageSize) => {
                attachmentsSetCurrentPage(page);
                attachmentsSetCurrentPageSize(pageSize);
              },
            }}
          >
            <Table.Column dataIndex="id" title="ID" />
            <Table.Column dataIndex="originalFilename" title="Nome Original" />
            <Table.Column dataIndex="createdAt" title="Criado em" />
            <Table.Column
              title="Actions"
              dataIndex="actions"
              render={(_, record: BaseRecord) => (
                <Space>
                  <DeleteButton
                    hideText
                    resource="attachments"
                    size="small"
                    recordItemId={record.id}
                  />
                </Space>
              )}
            />
          </Table>
        </List>
      </Form.Item>
      {/* 
      <Form.Item label="Posts">
        <Input
          placeholder="Filter Posts By Creator Name"
          style={{ width: "calc(100% - 200px)", marginRight: "8px" }}
        />
        <Button type="primary" style={{ marginRight: "8px" }}>
          Search
        </Button>
        <Button
          //  onClick={() => createModalShow()}
          type="primary"
        >
          Criar Novo
        </Button>
        <List>
          <Table
            rowKey="id"
            dataSource={posts?.data}
            loading={postsIsLoading}
            scroll={{
              x: true,
            }}
            pagination={{
              current: postsCurrentPage,
              pageSize: postsCurrentPageSize,
              total: posts?.total,
              onChange: (page, pageSize) => {
                postsSetCurrentPage(page);
                postsSetCurrentPageSize(pageSize);
              },
            }}
          >
            <Table.Column dataIndex="type" title="Type" />
            <Table.Column
              dataIndex="isVideo"
              title="Is Video"
              render={(value) => (value ? "Sim" : "Não")}
            />
            <Table.Column dataIndex="impressions" title="Impressions" />
            <Table.Column dataIndex="interactions" title="Interactions" />
            <Table.Column dataIndex="clicks" title="Clicks" />
            <Table.Column dataIndex="videoViews" title="Video Views" />
            <Table.Column dataIndex="engagement" title="Engagement" />
            <Table.Column dataIndex="price" title="Price" />
            <Table.Column dataIndex="postDate" title="Post Date" />
            <Table.Column dataIndex="creatorName" title="Creator Name" />
            <Table.Column dataIndex="userEmail" title="User Email" />
            <Table.Column
              title="Actions"
              dataIndex="actions"
              render={(_, record: ICreatorsSearch) => (
                <Space>
                  <EditButton
                    hideText
                    resource="posts"
                    size="small"
                    recordItemId={record.id}
                  />
                  <ShowButton
                    hideText
                    resource="posts"
                    size="small"
                    recordItemId={record.id}
                  />
                  <DeleteButton
                    size="small"
                    hideText
                    resource="posts"
                    recordItemId={record.id}
                  />
                </Space>
              )}
            />
          </Table>
        </List>
      </Form.Item>

      <Form.Item label="Creators">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "start",
            gap: "8px",
          }}
        >
          <Input
            placeholder="Filter Posts By Creator Name"
            value={creatorsSearch}
            onChange={(e) => {
              console.log(posts?.data);

              console.log(creatorsData);

              const search = e.target.value.trimStart().toLowerCase();
              setCreatorsSearch(() => search);

              if (search.length === 0 || search === "") {
                return setCreatorsDataFiltered(creatorsData);
              }

              const res = creatorsData.filter((item) =>
                item.name.toLowerCase().includes(search)
              );

              return setCreatorsDataFiltered(res);
            }}
            style={{ minWidth: "100%", marginRight: "8px" }}
          />
        </div>
        <List>
          <Table
            rowKey="id"
            dataSource={creatorsDataFiltered}
            loading={creatorsDataLoading}
            scroll={{
              x: true,
            }}
            pagination={{
              current: postsCurrentPage,
              pageSize: postsCurrentPageSize,
              total: posts?.data.length,
              onChange: (page, pageSize) => {
                postsSetCurrentPage(page);
                postsSetCurrentPageSize(pageSize);
              },
            }}
          >
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
            <Table.Column dataIndex="name" title="Creator Name" />
            <Table.Column dataIndex="postCount" title="Posts Quantity" />
            <Table.Column
              title="Actions"
              dataIndex="actions"
              render={(_, record: ICreatorsSearch) => (
                <Button
                  onClick={() => {
                    showModal();
                    setSelectedPostsModalCreatorId(record.creator_id);
                  }}
                  size="small"
                  icon={<EyeOutlined />}
                />
              )}
            />
          </Table>
        </List>
      </Form.Item>

      <Modal {...createModalProps}>
        <Form
          {...createFormProps}
          onFinish={async (values) => {
            setSelectedPostsCreatorId(() => null);
            createFormProps.form?.resetFields();
            const finishResults = await createModalOnFinish(values);
            createModalClose();
            return finishResults;
          }}
          layout="vertical"
        >
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
            label={"Creator"}
            name={["creatorId"]}
            rules={[
              {
                required: true,
                message: "Please select an Creator",
              },
            ]}
          >
            <div>
              <Input
                placeholder="Search Creators"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: "calc(100% - 100px)", marginRight: "8px" }}
              />
              <Button
                onClick={() => handleSearchCreatorsByName(searchTerm)}
                type="primary"
              >
                Search
              </Button>
              <Table
                scroll={{
                  x: true,
                }}
                rowKey="id"
                dataSource={creators}
                pagination={false}
                loading={creatorsLoading}
                onRow={(record) => ({
                  onClick: () => {
                    setSelectedPostsCreatorId(record.creator_id);
                    createFormProps.form?.setFieldValue(
                      "creatorId",
                      record.creator_id
                    );
                    createFormProps.form?.setFieldValue(
                      "creatorName",
                      record.name
                    );
                  },
                  style: {
                    cursor: "pointer",
                    backgroundColor:
                      record.creator_id === selectedPostsCreatorId
                        ? "#65a30d"
                        : undefined,
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
            label={"Creator Name"}
            name={["creatorName"]}
            rules={[
              {
                required: true,
                message: "Please select an Creator",
              },
            ]}
          >
            <Input disabled style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label={"User Email"}
            name={["userEmail"]}
            initialValue={data?.data.email}
            rules={[
              {
                required: true,
                type: "string",
                message: "Please enter a valid User Email",
              },
            ]}
          >
            <Input disabled type="email" style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        width={"100%"}
        style={{ maxWidth: "80vw" }}
      >
        <p>
          <List>
            <Table
              rowKey="id"
              dataSource={posts?.data.filter(
                (item) => item.creatorId === selectedPostsModalCreatorId
              )}
              loading={postsIsLoading}
              scroll={{
                x: true,
              }}
              pagination={{
                current: postsCurrentPage,
                pageSize: postsCurrentPageSize,
                total: posts?.total,
                onChange: (page, pageSize) => {
                  postsSetCurrentPage(page);
                  postsSetCurrentPageSize(pageSize);
                },
              }}
            >
              <Table.Column dataIndex="type" title="Type" />
              <Table.Column
                dataIndex="isVideo"
                title="Is Video"
                render={(value) => (value ? "Sim" : "Não")}
              />
              <Table.Column dataIndex="impressions" title="Impressions" />
              <Table.Column dataIndex="interactions" title="Interactions" />
              <Table.Column dataIndex="clicks" title="Clicks" />
              <Table.Column dataIndex="videoViews" title="Video Views" />
              <Table.Column dataIndex="engagement" title="Engagement" />
              <Table.Column dataIndex="price" title="Price" />
              <Table.Column dataIndex="postDate" title="Post Date" />
              <Table.Column dataIndex="creatorName" title="Creator Name" />
              <Table.Column dataIndex="userEmail" title="User Email" />
              <Table.Column
                title="Actions"
                dataIndex="actions"
                render={(_, record: ICreatorsSearch) => (
                  <Space>
                    <DeleteButton
                      size="small"
                      hideText
                      resource="posts"
                      recordItemId={record.id}
                    />
                  </Space>
                )}
              />
            </Table>
          </List>
        </p>
      </Modal> */}
    </Edit>
  );
}

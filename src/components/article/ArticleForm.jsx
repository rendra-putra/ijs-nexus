import { UploadOutlined } from "@ant-design/icons";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
import { Button, Form, Image, Input, Select, Typography, Upload } from "antd";
import { useEffect, useRef, useState } from "react";
import "../../styles/text-editor.css";
import { toBase64 } from "../../utils/imageUtil";

const { Title, Text } = Typography;

export default function ArticleForm({
  initialValues = {},
  onSubmit,
  loading,
  title = "Article Form",
  submitText = "Submit",
}) {
  const [form] = Form.useForm();
  const editorRef = useRef();

  const [coverPreview, setCoverPreview] = useState(initialValues.coverImage || null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [editorError, setEditorError] = useState(false);

  const isUpdate = Boolean(initialValues.content);

  // Initialize form and editor
  useEffect(() => {
    const fileList = initialValues.coverImage
      ? [
        {
          uid: "-1",
          name: "cover.png",
          status: "done",
          url: initialValues.coverImage,
        },
      ]
      : [];

    form.setFieldsValue({
      title: initialValues.title,
      tags: initialValues.tags,
      coverImage: fileList,
    });

    setCoverPreview(initialValues.coverImage || null);

    if (editorRef.current) {
      editorRef.current.getInstance().setMarkdown(isUpdate ? initialValues.content : "");
    }

    // Show errors immediately on first render
    updateFormValidation(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateFormValidation = (forceShowErrors = false) => {
    const hasErrors = form.getFieldsError().some(({ errors }) => errors.length > 0);
    const titleValue = form.getFieldValue("title")?.trim() || "";
    const editorContent = editorRef.current?.getInstance().getMarkdown().trim() || "";

    if (forceShowErrors) {
      setEditorError(editorContent === "");
    }

    setIsFormValid(!hasErrors && titleValue !== "" && editorContent !== "");
  };

  const handlePreview = async (file) => {
    let src = file.url;

    if (!src && file.originFileObj) {
      src = await toBase64(file.originFileObj);
    }

    setPreviewImage(src);
    setPreviewOpen(true);
  };

  const handleEditorChange = () => {
    const editorContent = editorRef.current?.getInstance().getMarkdown().trim() || "";
    setEditorError(editorContent === "");
    updateFormValidation();
  };

  const handleFinish = async (values) => {
    let base64Image = coverPreview;

    if (values.coverImage?.[0]?.originFileObj) {
      base64Image = await toBase64(values.coverImage[0].originFileObj);
    }

    const content = editorRef.current?.getInstance().getMarkdown() || "";

    if (!content) {
      setEditorError(true);
      return;
    }

    onSubmit({
      ...values,
      content,
      coverImage: base64Image,
    });
  };

  return (
    <>
      <Title level={2}>{title}</Title>

      <Form
        layout="vertical"
        form={form}
        onFinish={handleFinish}
        onFieldsChange={() => updateFormValidation(true)} // validate on field change
        onKeyDown={(e) => {
          if (e.key === "Enter") e.preventDefault();
        }}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Title is required" }]}
          validateTrigger="onChange"
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="coverImage"
          label="Cover Image"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
        >
          <Upload
            beforeUpload={() => false}
            maxCount={1}
            listType="picture"
            onPreview={handlePreview}
          >
            <Button icon={<UploadOutlined />}>Upload Cover</Button>
          </Upload>
        </Form.Item>

        <Form.Item name="tags" label="Tags">
          <Select mode="tags" placeholder="Add tags" />
        </Form.Item>

        <Form.Item label="Content" required className="editor-light-wrapper">
          <div className="editor-light">
            <Editor
              ref={editorRef}
              initialValue={isUpdate ? initialValues.content : ""}
              initialEditType="markdown"
              previewStyle="vertical"
              height="500px"
              useCommandShortcut
              placeholder="Write your article content here..."
              onChange={handleEditorChange}
            />
          </div>

          {editorError && <Text type="danger">Content is required</Text>}
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading} size="large" disabled={!isFormValid}>
          {submitText}
        </Button>
      </Form>

      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            src: previewImage,
            onVisibleChange: (visible) => setPreviewOpen(visible),
          }}
        />
      )}
    </>
  );
}
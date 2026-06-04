import "@toast-ui/editor/dist/toastui-editor.css";
import "../../styles/text-editor.css";

import { Editor } from "@toast-ui/react-editor";
import { Button, Form, Input, Space, Tag, Typography } from "antd";
import { useEffect, useRef, useState } from "react";

const { Text } = Typography;

export default function DiscussionForm({
  form,
  initialValues = {},
  onSubmit,
  loading = false,
  submitText = "Submit",
}) {
  const editorRef = useRef();
  const titleInputRef = useRef();

  const [tags, setTags] = useState(initialValues.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [editorError, setEditorError] = useState(false);

  const isUpdate = Boolean(initialValues.detail);

  useEffect(() => {
    if (editorRef.current) {
      const editor = editorRef.current.getInstance();
      editor.setMarkdown(isUpdate ? initialValues.detail : "");
    }

    if (initialValues.tags) setTags(initialValues.tags);

    setTimeout(() => {
      titleInputRef.current?.focus();
    }, 0);

    updateSubmitButton(true);
  }, []);

  const updateSubmitButton = (forceShowErrors = false) => {
    const hasErrors = form.getFieldsError().some(({ errors }) => errors.length > 0);
    const title = form.getFieldValue("question")?.trim() || "";
    const detail = editorRef.current?.getInstance().getMarkdown().trim() || "";

    if (forceShowErrors) setEditorError(detail === "");

    setIsFormValid(!hasErrors && title !== "" && detail !== "");
  };

  const handleEditorChange = () => {
    const detail = editorRef.current?.getInstance().getMarkdown().trim() || "";
    setEditorError(detail === "");
    updateSubmitButton();
  };

  const handleAddTag = () => {
    const value = tagInput.trim();
    if (!value || tags.includes(value)) return;
    setTags([...tags, value]);
    setTagInput("");
  };

  const handleSubmit = (values) => {
    const detail = editorRef.current?.getInstance().getMarkdown().trim() || "";

    if (!detail) {
      setEditorError(true);
      return;
    }

    onSubmit({ ...values, detail, tags });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleSubmit}
      onFieldsChange={() => updateSubmitButton(true)}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.preventDefault();
      }}
    >
      {/* Question */}
      <Form.Item
        label="Question"
        name="question"
        rules={[{ required: true, message: "Please enter a question" }]}
        validateTrigger="onChange"
      >
        <Input
          ref={titleInputRef}
          size="large"
          placeholder="Be specific and imagine you're asking a question to another person"
        />
      </Form.Item>

      {/* Editor */}
      <Form.Item label="Detail" required className="editor-light-wrapper">
        <div className="editor-light">
          <Editor
            ref={editorRef}
            initialValue={isUpdate ? initialValues.detail : ""}
            initialEditType="markdown"
            previewStyle="vertical"
            height="400px"
            useCommandShortcut
            placeholder="Start writing your detail here..."
            onChange={handleEditorChange}
          />
        </div>

        {editorError && <Text type="danger">Please enter detail</Text>}
      </Form.Item>

      {/* Tags */}
      <Form.Item label="Tags">
        <Space direction="vertical" style={{ width: "100%" }}>
          <Space.Compact style={{ width: "100%" }}>
            <Input
              placeholder="Add a tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onPressEnter={handleAddTag}
            />
            <Button onClick={handleAddTag}>Add</Button>
          </Space.Compact>

          <Space wrap>
            {tags.map((tag) => (
              <Tag
                key={tag}
                closable
                color="blue"
                onClose={() => setTags(tags.filter((t) => t !== tag))}
              >
                {tag}
              </Tag>
            ))}
          </Space>
        </Space>
      </Form.Item>

      {/* Submit */}
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          size="large"
          disabled={!isFormValid}
        >
          {submitText}
        </Button>
      </Form.Item>
    </Form>
  );
}
import "@toast-ui/editor/dist/toastui-editor.css";
import "../../../styles/text-editor.css";

import { Editor } from "@toast-ui/react-editor";
import { Button, Grid, Space } from "antd";
import { useRef } from "react";

const { useBreakpoint } = Grid;

export default function AnswerForm({
  onSend,
  onCancel,
  loading,
  initialValue = ""
}) {
  const editorRef = useRef();
  const screens = useBreakpoint();

  const handleSend = () => {
    const content =
      editorRef.current?.getInstance().getMarkdown();

    if (!content?.trim()) return;

    onSend(content);

    editorRef.current
      ?.getInstance()
      .setMarkdown("");
  };

  const handleCancel = () => {
    editorRef.current
      ?.getInstance()
      .setMarkdown("");

    onCancel?.();
  };

  return (
    <div
      className="editor-light-wrapper"
      style={{ width: "100%" }}
    >
      <div className="editor-light">
        <Editor
          ref={editorRef}
          initialValue={initialValue}
          height={screens.xs ? "200px" : "250px"}
          initialEditType="wysiwyg"
          previewStyle="vertical"
          hideModeSwitch
        />
      </div>

      <div style={{ marginTop: 12 }}>
        <Space
          style={{
            width: "100%",
            justifyContent: screens.xs
              ? "flex-start"
              : "flex-end",
            flexWrap: "wrap",
            gap: 8
          }}
        >
          <Button onClick={handleCancel}>
            Cancel
          </Button>

          <Button
            type="primary"
            onClick={handleSend}
            loading={loading}
          >
            Send
          </Button>
        </Space>
      </div>
    </div>
  );
}
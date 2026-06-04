import { Input, Modal, Typography } from "antd";

export default function RenameBookmarkModal({
  open,
  name,
  onChange,
  onSave,
  onCancel,
}) {
  return (
    <Modal
      title="Rename Bookmark"
      open={open}
      onOk={onSave}
      onCancel={onCancel}
      okText="Save"
      cancelText="Cancel"
    >
      <div style={{ marginTop: 20, marginBottom: 10 }}>
        <Typography.Text strong>New name</Typography.Text>
        <Input
          value={name}
          onChange={onChange}
          placeholder="Enter new name.."
          style={{ marginTop: 8 }}
          onPressEnter={onSave}
        />
      </div>
    </Modal>
  );
}
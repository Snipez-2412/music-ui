import React, { useEffect, useState } from "react";
import { List, Dropdown, Menu, Button, Modal, Form, Input } from "antd";
import { EllipsisOutlined, ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";
import useArtistStore from "../../zustand/store/ArtistStore";

function ManageArtists() {
  const { artists, fetchAllArtists, updateArtist, deleteArtist, addArtist } = useArtistStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingArtist, setEditingArtist] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAllArtists();
  }, [fetchAllArtists]);

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this artist?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => deleteArtist(id),
    });
  };

  const handleEdit = (artist) => {
    setEditingArtist(artist);
    form.setFieldsValue(artist);
    setIsModalVisible(true);
  };

  const handleAdd = () => {
    setEditingArtist(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (editingArtist) {
        await updateArtist({ ...editingArtist, ...values });
      } else {
        await addArtist(values);
      }
      setIsModalVisible(false);
      setEditingArtist(null);
    } catch (error) {
      console.error("Failed to save artist:", error);
    }
  };

  const renderMenu = (artist) => (
    <Menu>
      <Menu.Item key="edit" onClick={() => handleEdit(artist)}>
        Edit
      </Menu.Item>
      <Menu.Item key="delete" danger onClick={() => handleDelete(artist.id)}>
        Delete
      </Menu.Item>
    </Menu>
  );

  return (
    <div>
      <h1>Manage Artists</h1>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAdd}
        style={{ marginBottom: 16 }}
      >
        Add Artist
      </Button>
      <List
        dataSource={artists}
        renderItem={(artist) => (
          <List.Item
            actions={[
              <Dropdown overlay={renderMenu(artist)} trigger={["click"]}>
                <Button icon={<EllipsisOutlined />} />
              </Dropdown>,
            ]}
          >
            <List.Item.Meta title={artist.name} />
          </List.Item>
        )}
      />

      {/* Add/Edit Artist Modal */}
      <Modal
        title={editingArtist ? "Edit Artist" : "Add Artist"}
        visible={isModalVisible}
        onOk={handleSave}
        onCancel={() => setIsModalVisible(false)}
        okText="Save"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Artist Name"
            rules={[{ required: true, message: "Please enter the artist's name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="genre"
            label="Genre"
            rules={[{ required: true, message: "Please enter the genre" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ManageArtists;
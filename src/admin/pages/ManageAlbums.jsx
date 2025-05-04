import React, { useEffect, useState } from "react";
import { List, Dropdown, Menu, Button, Modal, Form, Input, Upload, Select } from "antd";
import { EllipsisOutlined, ExclamationCircleOutlined, UploadOutlined } from "@ant-design/icons";
import useAlbumStore from "../../zustand/store/AlbumStore";
import useArtistStore from "../../zustand/store/ArtistStore"; // Import artist store

const { Option } = Select;

function ManageAlbums() {
  const { albums, fetchAllAlbums, updateAlbum, deleteAlbum, addAlbum } = useAlbumStore();
  const { artists, fetchAllArtists } = useArtistStore(); // Fetch artists for the dropdown
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [form] = Form.useForm();
  const [coverFile, setCoverFile] = useState(null);

  useEffect(() => {
    fetchAllAlbums();
    fetchAllArtists(); // Fetch artists when the component loads
  }, [fetchAllAlbums, fetchAllArtists]);

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this album?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => deleteAlbum(id),
    });
  };

  const handleEdit = (album) => {
    setEditingAlbum(album);
    form.setFieldsValue(album);
    setCoverFile(null); // Reset the cover file
    setIsModalVisible(true);
  };

  const handleAdd = () => {
    setEditingAlbum(null);
    form.resetFields();
    setCoverFile(null); // Reset the cover file
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (editingAlbum) {
        await updateAlbum({ ...editingAlbum, ...values }, coverFile);
      } else {
        await addAlbum(values, coverFile);
      }
      setIsModalVisible(false);
      setEditingAlbum(null);
    } catch (error) {
      console.error("Failed to save album:", error);
    }
  };

  const handleCoverChange = ({ file }) => {
    setCoverFile(file.originFileObj);
  };

  const renderMenu = (album) => (
    <Menu>
      <Menu.Item key="edit" onClick={() => handleEdit(album)}>
        Edit
      </Menu.Item>
      <Menu.Item key="delete" danger onClick={() => handleDelete(album.albumID)}>
        Delete
      </Menu.Item>
    </Menu>
  );

  return (
    <div>
      <h1>Manage Albums</h1>
      <Button
        type="primary"
        icon={<UploadOutlined />}
        onClick={handleAdd}
        style={{ marginBottom: 16 }}
      >
        Add Album
      </Button>
      <List
        dataSource={albums}
        renderItem={(album) => (
          <List.Item
            actions={[
              <Dropdown overlay={renderMenu(album)} trigger={["click"]}>
                <Button icon={<EllipsisOutlined />} />
              </Dropdown>,
            ]}
          >
            <List.Item.Meta
              title={album.title}
              description={`Artist: ${album.artistName}`}
            />
          </List.Item>
        )}
      />

      {/* Add/Edit Album Modal */}
      <Modal
        title={editingAlbum ? "Edit Album" : "Add Album"}
        visible={isModalVisible}
        onOk={handleSave}
        onCancel={() => setIsModalVisible(false)}
        okText="Save"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Album Title"
            rules={[{ required: true, message: "Please enter the album title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="artistName"
            label="Artist Name"
            rules={[{ required: true, message: "Please select an artist" }]}
          >
            <Select
              showSearch
              placeholder="Select an artist"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {artists.map((artist) => (
                <Option key={artist.id} value={artist.name}>
                  {artist.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Cover Image">
            <Upload
              beforeUpload={() => false}
              onChange={handleCoverChange}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Upload Cover</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ManageAlbums;
import React, { useEffect, useState } from "react";
import { List, Dropdown, Menu, Button, Modal, Form, Input, Select } from "antd";
import { EllipsisOutlined, ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useUserStore } from "../../zustand/store/UserStore";

const { Option } = Select;
const { Search } = Input;

function ManageUsers() {
  const { users, fetchUsers, updateUser, removeUser, addUser } = useUserStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    let filtered = users;

    // Filter by role
    if (selectedRole) {
      filtered = filtered.filter((user) => user.roles.includes(selectedRole));
    }

    // Filter by search query
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter((user) =>
        user.username.toLowerCase().includes(lowerCaseQuery)
      );
    }

    setFilteredUsers(filtered);
  }, [users, selectedRole, searchQuery]);

  const handleRoleFilterChange = (value) => {
    setSelectedRole(value);
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this user?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => removeUser(id),
    });
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      username: user.username,
      email: user.email,
      role: user.roles,
    });
    setIsModalVisible(true);
  };

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (editingUser) {
        await updateUser(editingUser.id, { ...editingUser, ...values });
      } else {
        await addUser(values);
      }
      setIsModalVisible(false);
      setEditingUser(null);
    } catch (error) {
      console.error("Failed to save user:", error);
    }
  };

  const renderMenu = (user) => (
    <Menu>
      <Menu.Item key="edit" onClick={() => handleEdit(user)}>
        Edit
      </Menu.Item>
      <Menu.Item key="delete" danger onClick={() => handleDelete(user.id)}>
        Delete
      </Menu.Item>
    </Menu>
  );

  return (
    <div>
      <h1>Manage Users</h1>

      {/* Search Bar */}
      <div style={{ marginBottom: "16px" }}>
        <Search
          placeholder="Search by username"
          allowClear
          onSearch={handleSearch}
          style={{ width: "100%" }}
        />
      </div>

      {/* Role Filter */}
      <div style={{ marginBottom: "16px" }}>
        <Select
          placeholder="Filter by Role"
          allowClear
          onChange={handleRoleFilterChange}
          style={{ width: 200 }}
        >
          <Option value="ROLE_ADMIN">Admin</Option>
          <Option value="ROLE_USER">User</Option>
        </Select>
      </div>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAdd}
        style={{ marginBottom: 16 }}
      >
        Add User
      </Button>
      <List
        dataSource={filteredUsers}
        renderItem={(user) => (
          <List.Item
            actions={[
              <Dropdown overlay={renderMenu(user)} trigger={["click"]}>
                <Button icon={<EllipsisOutlined />} />
              </Dropdown>,
            ]}
          >
            <List.Item.Meta
              title={user.username}
              description={`Role: ${user.roles
                .map((role) => (role === "ROLE_ADMIN" ? "Admin" : "User"))
                .join(", ")}`}
            />
          </List.Item>
        )}
        style={{
          maxHeight: "400px",
          overflowY: "auto",
          border: "1px solid #f0f0f0",
          padding: "8px",
        }}
      />

      {/* Add/Edit User Modal */}
      <Modal
        title={editingUser ? "Edit User" : "Add User"}
        visible={isModalVisible}
        onOk={handleSave}
        onCancel={() => setIsModalVisible(false)}
        okText="Save"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please enter the username" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: false, message: "Please enter the email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select placeholder="Select a role">
              <Option value="ROLE_ADMIN">Admin</Option>
              <Option value="ROLE_USER">User</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ManageUsers;
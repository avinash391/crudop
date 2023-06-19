import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import { Button, TextField } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

const API_KEY = '648c396d1d8af4398d88e506';
const BASE_URL = 'https://dummyapi.io/data/v1';

const CrudPage = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    picture: '',
  });

  const [editMode, setEditMode] = useState(false);
  const [editUserId, setEditUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user`, {
        headers: { 'app-id': API_KEY },
      });
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleInputChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  };

  const handleAddUser = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/user/create`, {
        ...formData,
        id: generateRandomId(),
        title: 'miss',
        email: 'avinash@gmail.com'
      }, {
        headers: { 'app-id': API_KEY },
      });
      setUsers((prevUsers) => [...prevUsers, response.data]);
      setFormData({
        firstName: '',
        lastName: '',
        picture: '',
      });
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/user/${id}`, {
        headers: { 'app-id': API_KEY },
      });
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEditUser = (id) => {
    const userToEdit = users.find((user) => user.id === id);
    setFormData({
      firstName: userToEdit.firstName,
      lastName: userToEdit.lastName,
      picture: userToEdit.picture,
    });
    setEditMode(true);
    setEditUserId(id);
  };

  const handleUpdateUser = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(`${BASE_URL}/user/${editUserId}`, formData, {
        headers: { 'app-id': API_KEY },
      });
      const updatedUser = response.data;
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );
      setFormData({
        firstName: '',
        lastName: '',
        picture: '',
      });
      setEditMode(false);
      setEditUserId(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleCancelUpdate = () => {
    setFormData({
      firstName: '',
      lastName: '',
      picture: '',
    });
    setEditMode(false);
    setEditUserId(null);
  };

  const generateRandomId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  return (
    <div>
      <h1>CRUD Operations</h1>

      <form onSubmit={editMode ? handleUpdateUser : handleAddUser}>
        <TextField
          type="text"
          name="firstName"
          value={formData.firstName}
          label="First Name"
          onChange={handleInputChange}
        />
        <TextField
          type="text"
          name="lastName"
          value={formData.lastName}
          label="Last Name"
          onChange={handleInputChange}
        />
        <TextField
          type="text"
          name="picture"
          value={formData.picture}
          label="Picture URL"
          onChange={handleInputChange}
        />
        {editMode ? (
          <>
            <Button variant="contained" type="submit">Update User</Button>
            <Button variant="contained" onClick={handleCancelUpdate}>Cancel</Button>
          </>
        ) : (
          <Button variant="contained" type="submit">Add User</Button>
        )}
      </form>

      <h2>Users</h2>
      <List>
        {users.map((user) => (
          <ListItem key={user.id}>
            <img src={user.picture} alt={`${user.firstName} ${user.lastName}`} />
            <ListItemText primary={`${user.firstName} ${user.lastName}`} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteUser(user.id)}>
                <Delete />
              </IconButton>
              <IconButton edge="end" aria-label="edit" onClick={() => handleEditUser(user.id)}>
                <Edit />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default CrudPage;

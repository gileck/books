import { Delete, Edit } from '@mui/icons-material';
import { Button, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, List, ListItem, ListItemButton, ListItemSecondaryAction, ListItemText, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
export default function Admin() {
    const [data, setData] = useState(null);
    const [editUser, setEditUser] = useState(null);
    const [openUsers, setOpenUsers] = useState({});
    const toggleUser = (username) => {
        setOpenUsers({ ...openUsers, [username]: !openUsers[username] });
    }
    const getData = async () => {
        const data = await fetch('/api/getAll').then(res => res.json());
        setData(data);
    }
    useEffect(() => {
        getData()
    }, []);

    function saveUser(userContent) {
        setEditUser(null)
        fetch(`/api/admin/saveUser`, {
            method: 'POST',
            body: userContent,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            getData()
        })
    }

    if (!data) {
        return <div></div>;
    }
    const { users, trainingPlans } = data || {};

    console.log({
        users,
        trainingPlans

    });

    function deleteUser(username) {
        const res = confirm('Are you sure you want to delete user: ' + username);
        if (!res) {
            return;
        }

        fetch(`/api/admin/deleteUser/${username}`, {
        }).then(res => {
            getData()
        })
    }

    return (
        <div>
            <h1>Users</h1>
            <List>
                {users.map((user) => (
                    <>
                        <ListItem key={user.username}
                            onClick={() => toggleUser(user.username)}
                        >
                            <ListItemText
                                primary={user.name}
                            />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" onClick={() => setEditUser(user)} >
                                    <Edit />
                                </IconButton>
                                <IconButton edge="end" onClick={() => deleteUser(user.username)}>
                                    <Delete />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                        <Collapse in={openUsers[user.username]} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItem>
                                    <ListItemText primary={`username: ${user.username}`} />
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary={`Name: ${user.name}`} />
                                </ListItem>
                            </List>
                        </Collapse>
                        <Divider />
                    </>
                ))}
            </List>
            <EditUserDialog
                editUserDialogOpen={!!editUser}
                onClose={() => setEditUser(null)}
                user={editUser}
                saveUser={saveUser}
            />
        </div>
    );
}

function EditUserDialog({
    editUserDialogOpen,
    onClose,
    user,
    saveUser
}) {

    if (!user) {
        return null;
    }

    function isValidJSON(str) {
        try {
            JSON.parse(str);
            return true;
        }
        catch (e) {
            console.log(e);
            return false;

        }
    }

    const [userConent, setUserContent] = useState(JSON.stringify(user, null, 2));

    function onChange(event) {
        setUserContent(event.target.value);

    }

    function saveUserInternal() {
        if (!isValidJSON(userConent)) {
            return;
        }
        saveUser(userConent)
    }


    return (
        <Dialog
            open={editUserDialogOpen}
            onClose={onClose}
            fullWidth={true}
        >
            <DialogTitle>
                Edit User: {user.username}
            </DialogTitle>
            <DialogContent>
                <TextField
                    multiline={true}
                    fullWidth={true}
                    value={userConent}
                    onChange={onChange}
                    error={!isValidJSON(userConent)}
                    helperText={!isValidJSON(userConent) ? 'Invalid JSON' : ''}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    variant='contained'
                    disabled={!isValidJSON(userConent)}
                    onClick={saveUserInternal}>Save</Button>
            </DialogActions>
        </Dialog>
    )
}
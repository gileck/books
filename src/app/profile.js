import React, { useContext, useEffect, useState } from 'react';
import { Box, TextField, Button, Avatar, Typography, Alert, CircularProgress } from '@mui/material';
import { AppContext } from '@/app/AppContext';

export const Profile = () => {
    const { user } = useContext(AppContext);
    console.log({ user });
    const [profilePic, setProfilePic] = useState(user.profilePic); // URL or base64 image
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [isSaved, setIsSaved] = useState(false);
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setIsSaved(false);
        setIsError(false);
        setLoading(true);
        const res = await fetch('/api/updateUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                profilePic,
                name,
                email,
            }),
        }).then((res) => res.json())
            .catch((e) => {
                console.error(e);
                setIsError(true);
                setLoading(false);
            })
        setLoading(false);

        if (res?.result?.acknowledged) {
            setIsSaved(true);
            setIsError(false);
        } else {
            setIsSaved(false);
            setIsError(true);
        }

    };

    const handlePaste = (event) => {
        const items = event.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const blob = items[i].getAsFile();
                const reader = new FileReader();
                reader.onload = () => {
                    setProfilePic(reader.result);
                };
                reader.readAsDataURL(blob);
            }
        }
    };

    useEffect(() => {
        window.addEventListener('paste', handlePaste);
        return () => {
            window.removeEventListener('paste', handlePaste);
        };
    }, []);


    const handleProfilePicChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setProfilePic(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            mt={5}
        >
            <Avatar
                alt="Profile Picture"
                src={profilePic}
                sx={{ width: 100, height: 100, mb: 2 }}
            />
            <Button
                variant="contained"
                component="label"
                sx={{ mb: 2 }}
            >
                Upload Profile Picture
                <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleProfilePicChange}
                />
            </Button>
            <Alert severity="info">You can also paste an image</Alert>
            <br />
            <TextField
                label={name ? '' : 'Name'}
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{ mb: 2, width: '300px' }}
            />
            <TextField
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2, width: '300px' }}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={loading}
            >
                {loading ? <CircularProgress size={24} sx={{ ml: 1, color: 'white' }} /> : 'Save'}
            </Button>
            {isSaved && <Alert severity="success">Profile saved successfully</Alert>}
            {isError && <Alert severity="error">Error saving profile</Alert>}

        </Box>
    );
};


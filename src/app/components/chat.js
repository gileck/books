import React, { useState, useRef, useEffect } from "react";
import { Delete, Repeat, Replay, Send } from "@mui/icons-material";
import { Box, Container, Divider, IconButton, Paper, TextField, Typography } from "@mui/material";
import { localStorageAPI } from "../localStorageAPI";
import PendingIcon from '@mui/icons-material/Pending';
import ReactMarkdown from 'react-markdown';
import { styled } from '@mui/material/styles';

const TypingIndicator = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    fontSize: '1rem',
    marginTop: '20px',
    marginLeft: '5px',
    '& span': {
        display: 'inline-block',
        width: '8px',
        height: '8px',
        margin: '0 2px',
        borderRadius: '50%',
        backgroundColor: '#888',
        animation: 'typing 1.2s infinite',
    },
    '& span:nth-of-type(1)': {
        animationDelay: '0s',
    },
    '& span:nth-of-type(2)': {
        animationDelay: '0.2s',
    },
    '& span:nth-of-type(3)': {
        animationDelay: '0.4s',
    },
    '@keyframes typing': {
        '0%': {
            transform: 'translateY(0)',
            opacity: 0.3,
        },
        '50%': {
            transform: 'translateY(-6px)',
            opacity: 1,
        },
        '100%': {
            transform: 'translateY(0)',
            opacity: 0.3,
        }
    }
}))

export function Chat({
    getResponse,
    chatId,
    height
}) {
    const localMessages = localStorageAPI().getData(chatId)
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState(localMessages || []);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    function deleteAllMessages() {
        setMessages([]);
        localStorageAPI().saveData(chatId, []);
    }

    useEffect(() => {
        localStorageAPI().saveData(chatId, messages)
    }, [messages]);


    useEffect(() => {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage) {
            document.getElementById(lastMessage.id)?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    async function sendMessage(message) {
        setMessages([...messages, message]);
        setLoading(true);
        setInput('');
        try {
            const response = await getResponse({ input })
            setMessages(prevMessages => [...prevMessages, { user: 'AI', text: response.result, apiPrice: response.apiPrice, id: Date.now(), Comp: response.Comp }]);
        } catch (e) {
            console.error(e)
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }
    async function handleSendMessage() {
        if (!input) {
            return
        }
        const message = { user: 'You', text: input, id: Date.now() }
        await sendMessage(message)
    }

    async function resendMessage(message) {
        sendMessage({
            ...message,
            id: Date.now()
        })
    }

    return <div id="chat_container">
        <Container maxWidth="sm" sx={{ marginTop: '10px' }}>
            <Paper elevation={3} sx={{ height: height || '79vh', display: 'flex', flexDirection: 'column', }}>

                <Box sx={{ flex: 1, overflowY: 'auto', padding: 2 }}>
                    {messages.map((message, index) => (
                        <Box key={index} sx={{ position: 'relative', '&:hover .resend-button': { display: 'block' } }}>
                            <div id={message.id}></div>
                            {
                                message.user === 'You' ? <Typography key={index}
                                    variant="body1"
                                    sx={{
                                        mb: 1,
                                        paddingRight: 1,
                                        paddingLeft: 1,
                                        border: '1px solid gray',
                                        borderRadius: '10px',
                                        backgroundColor: '#e2ebf4'
                                    }}>
                                    <ReactMarkdown>{`**${message.user}**: ${message.text}`}</ReactMarkdown>
                                </Typography> : <Typography key={index}
                                    variant="body1"
                                    sx={{}}
                                    align={message.user === 'You' ? 'right' : 'left'}>
                                    <ReactMarkdown>{`**${message.user}**: ${message.text}`}</ReactMarkdown>
                                </Typography>
                            }
                            {message.Comp && <message.Comp />}


                            {message.apiPrice && <Typography
                                sx={{
                                    mb: 1,
                                    p: 1
                                }}
                                variant="caption" color="textSecondary">Price: {message.apiPrice}</Typography>}

                            {message.user === 'You' ? <IconButton
                                className="resend-button"
                                sx={{ display: 'none', position: 'absolute', top: 0, right: 0 }}
                                onClick={() => resendMessage(message)}
                            >
                                <Replay />
                            </IconButton> : null}
                        </Box>
                    ))}
                    {loading && (
                        <TypingIndicator>
                            <span></span>
                            <span></span>
                            <span></span>
                        </TypingIndicator>
                    )}

                </Box >
                <Box sx={{ display: 'flex', padding: 2 }}>
                    <TextField
                        placeholder="Type a message..."
                        fullWidth
                        variant="outlined"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') handleSendMessage();
                        }}
                    />
                    <IconButton color="primary" onClick={handleSendMessage}>
                        <Send />
                    </IconButton>
                </Box>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'right',
                    justifyContent: 'right',
                    padding: 1,
                    borderTop: '0.5px solid #ddd'
                }}>
                    <Delete
                        float="right"
                        onClick={() => deleteAllMessages()} />
                </Box>
            </Paper>
        </Container>
    </div>
}
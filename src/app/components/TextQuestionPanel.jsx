import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, IconButton, Box, CircularProgress, Paper, Fade, TextField, Button, Chip, Drawer, Tooltip, Menu, MenuItem, Avatar, InputAdornment, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MinimizeIcon from '@mui/icons-material/Minimize';
import SendIcon from '@mui/icons-material/Send';
import HelpIcon from '@mui/icons-material/Help';
import WhyIcon from '@mui/icons-material/Psychology';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import ReactMarkdown from 'react-markdown';
import { useState, useEffect, useRef } from 'react';

// Define a unique key for local storage
const CHAT_HISTORY_KEY = 'books_ai_chat_history';

export function TextQuestionPanel({ selectedText, question, questionType, onClose, open, context }) {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const [answer, setAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const [customQuestion, setCustomQuestion] = useState('');
    // const [minimized, setMinimized] = useState(false);
    const [newTextAdded, setNewTextAdded] = useState(false);
    const [presetMenuAnchor, setPresetMenuAnchor] = useState(null);
    const [messageMenuAnchor, setMessageMenuAnchor] = useState(null);
    const [selectedMessageId, setSelectedMessageId] = useState(null);
    const [headerMenuAnchor, setHeaderMenuAnchor] = useState(null);
    const [editMode, setEditMode] = useState(false);

    const chatContainerRef = useRef(null);
    const chatEndRef = useRef(null);

    // Load chat history from local storage on initial render
    useEffect(() => {
        const savedHistory = localStorage.getItem(CHAT_HISTORY_KEY);
        if (savedHistory) {
            try {
                setChatHistory(JSON.parse(savedHistory));
            } catch (e) {
                console.error('Error parsing chat history from localStorage:', e);
                // If there's an error parsing, start with empty history
                setChatHistory([]);
            }
        }
    }, []);

    // Save chat history to local storage whenever it changes
    useEffect(() => {
        if (chatHistory.length > 0) {
            localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(chatHistory));
        }
    }, [chatHistory]);

    // Scroll to bottom of chat when new messages are added
    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            const scrollContainer = chatContainerRef.current;
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
    };

    useEffect(() => {
        if (open) {
            // Use setTimeout to ensure the DOM has updated before scrolling
            setTimeout(scrollToBottom, 100);
        }
    }, [chatHistory, open, isLoading]);

    // Handle new text selection or question when panel is opened
    useEffect(() => {
        if (!open) return;

        // If there's selected text and a question type, add it to the chat
        if (selectedText && (questionType || question)) {
            const existingQuestion = chatHistory.find(
                item => item.type === 'user-text' && item.content === selectedText
            );

            if (!existingQuestion) {
                // Add the selected text as a user message
                const newMessage = {
                    id: Date.now(),
                    type: 'user-text',
                    content: selectedText,
                    timestamp: new Date().toISOString()
                };

                setChatHistory(prev => [...prev, newMessage]);
                setNewTextAdded(true);

                // If there's a question type, fetch the answer
                if (questionType || question) {
                    fetchAnswer(selectedText, questionType, question, context);
                }
            }
        }
    }, [open, selectedText, questionType, question]);



    const fetchAnswer = async (text, type, customQ, ctx) => {
        setIsLoading(true);
        setError(null);

        // Add the question to chat history
        const questionContent = type === 'explain' ? 'Can you explain this text?' :
            type === 'why' ? 'Why is this important or significant?' :
                customQ;

        const questionMessage = {
            id: Date.now(),
            type: 'user-question',
            content: questionContent,
            selectedText: text,
            timestamp: new Date().toISOString()
        };

        setChatHistory(prev => [...prev, questionMessage]);

        try {
            console.log('Sending request to /api/ai/question');
            const response = await fetch('/api/ai/question', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: text,
                    question: questionContent,
                    context: ctx
                })
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('API error response:', errorData);
                throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('API success response received');

            // Add the AI response to chat history
            const aiMessage = {
                id: Date.now(),
                type: 'ai-response',
                content: data.result,
                timestamp: new Date().toISOString()
            };

            setChatHistory(prev => [...prev, aiMessage]);
            setAnswer(data.result);
            setNewTextAdded(false);
        } catch (error) {
            console.error('Error fetching AI answer:', error);

            // Add the error message to chat history
            const errorMessage = {
                id: Date.now(),
                type: 'error',
                content: error.message || 'Sorry, there was an error getting the answer. Please try again.',
                timestamp: new Date().toISOString()
            };

            setChatHistory(prev => [...prev, errorMessage]);
            setError(error.message || 'Sorry, there was an error getting the answer. Please try again.');
            setAnswer('');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendCustomQuestion = () => {
        if (customQuestion.trim()) {
            // Get the most recent user text from chat history
            const recentText = chatHistory.findLast(item => item.type === 'user-text')?.content || selectedText;

            if (recentText) {
                fetchAnswer(recentText, 'custom', customQuestion, context);
                setCustomQuestion('');
            }
        }
    };

    const handlePredefinedQuestion = (type) => {
        // Get the most recent user text from chat history
        const recentText = chatHistory.findLast(item => item.type === 'user-text')?.content || selectedText;

        if (recentText) {
            fetchAnswer(recentText, type, '', context);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendCustomQuestion();
        }
    };

    const handleClose = () => {
        if (onClose) {
            onClose();
        }
    };

    const handlePresetMenuOpen = (event) => {
        setPresetMenuAnchor(event.currentTarget);
    };

    const handlePresetMenuClose = () => {
        setPresetMenuAnchor(null);
    };

    const handlePresetQuestionSelect = (type) => {
        handlePredefinedQuestion(type);
        handlePresetMenuClose();
    };

    const handleClearChat = () => {
        setChatHistory([]);
        localStorage.removeItem(CHAT_HISTORY_KEY);
        setHeaderMenuAnchor(null);
    };

    const handleMessageMenuOpen = (event, messageId) => {
        event.stopPropagation();
        setSelectedMessageId(messageId);
        setMessageMenuAnchor(event.currentTarget);
    };

    const handleMessageMenuClose = () => {
        setMessageMenuAnchor(null);
    };

    const handleDeleteMessage = () => {
        if (selectedMessageId) {
            setChatHistory(prev => prev.filter(message => message.id !== selectedMessageId));
            // Update localStorage
            const updatedHistory = chatHistory.filter(message => message.id !== selectedMessageId);
            if (updatedHistory.length > 0) {
                localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(updatedHistory));
            } else {
                localStorage.removeItem(CHAT_HISTORY_KEY);
            }
        }
        handleMessageMenuClose();
    };

    const handleHeaderMenuOpen = (event) => {
        setHeaderMenuAnchor(event.currentTarget);
    };

    const handleHeaderMenuClose = () => {
        setHeaderMenuAnchor(null);
    };

    const toggleEditMode = () => {
        setEditMode(prev => !prev);
        setHeaderMenuAnchor(null);
    };

    const renderChatMessage = (message) => {
        const timestamp = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        switch (message.type) {
            case 'user-text':
                return (
                    <Box sx={{ position: 'relative', alignSelf: 'flex-end', maxWidth: '85%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 0.5 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                                {timestamp}
                            </Typography>
                            <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>
                                <PersonIcon sx={{ fontSize: 16 }} />
                            </Avatar>
                        </Box>
                        <Paper
                            elevation={0}
                            sx={{
                                backgroundColor: 'primary.main',
                                color: 'primary.contrastText',
                                p: 1.5,
                                borderRadius: '16px 16px 4px 16px',
                                mb: 1,
                                maxWidth: '100%',
                                position: 'relative',
                                boxShadow: isDarkMode
                                    ? '0 2px 8px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)'
                                    : '0 2px 6px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            <Typography
                                variant="body2"
                                component="div"
                                sx={{
                                    fontSize: '0.9rem',
                                    lineHeight: 1.4
                                }}
                            >
                                {message.content}
                            </Typography>
                        </Paper>
                        {editMode && (
                            <IconButton
                                size="small"
                                sx={{
                                    position: 'absolute',
                                    top: 32,
                                    right: -28,
                                    backgroundColor: theme.palette.background.paper,
                                    boxShadow: theme.shadows[2],
                                    '&:hover': { backgroundColor: theme.palette.action.hover }
                                }}
                                onClick={(e) => handleMessageMenuOpen(e, message.id)}
                            >
                                <MoreVertIcon fontSize="small" />
                            </IconButton>
                        )}
                    </Box>
                );

            case 'user-question':
                return (
                    <Box sx={{ position: 'relative', alignSelf: 'flex-end', mb: 2, maxWidth: '85%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 0.5 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                                {timestamp}
                            </Typography>
                            <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>
                                <PersonIcon sx={{ fontSize: 16 }} />
                            </Avatar>
                        </Box>
                        {message.selectedText && (
                            <Paper
                                elevation={0}
                                sx={{
                                    backgroundColor: isDarkMode ? 'rgba(40, 40, 45, 0.9)' : 'rgba(240, 240, 245, 0.95)',
                                    p: 1.5,
                                    borderRadius: '16px 16px 16px 16px',
                                    mb: 1.5,
                                    maxWidth: '100%',
                                    boxShadow: isDarkMode
                                        ? '0 1px 4px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.1)'
                                        : '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)',
                                    borderLeft: '3px solid',
                                    borderLeftColor: 'info.main'
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    component="div"
                                    sx={{
                                        fontSize: '0.9rem',
                                        lineHeight: 1.4,
                                        color: 'text.primary'
                                    }}
                                >

                                    <Typography
                                        component="div"
                                        variant="body2"
                                        sx={{
                                            fontStyle: 'italic',
                                            color: isDarkMode ? 'text.secondary' : 'text.primary',
                                            fontSize: '0.9rem',
                                            lineHeight: 1.5,
                                            pl: 0.5
                                        }}
                                    >
                                        {message.selectedText}
                                    </Typography>
                                </Typography>
                            </Paper>
                        )}
                        <Paper
                            elevation={0}
                            sx={{
                                backgroundColor: 'primary.main',
                                color: 'primary.contrastText',
                                py: 0.75,
                                px: 1.5,
                                borderRadius: '16px 16px 4px 16px',
                                maxWidth: '100%',
                                boxShadow: isDarkMode
                                    ? '0 2px 8px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)'
                                    : '0 2px 6px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                                {message.content}
                            </Typography>
                        </Paper>
                        {editMode && (
                            <IconButton
                                size="small"
                                sx={{
                                    position: 'absolute',
                                    top: 32,
                                    right: -28,
                                    backgroundColor: theme.palette.background.paper,
                                    boxShadow: theme.shadows[2],
                                    '&:hover': { backgroundColor: theme.palette.action.hover }
                                }}
                                onClick={(e) => handleMessageMenuOpen(e, message.id)}
                            >
                                <MoreVertIcon fontSize="small" />
                            </IconButton>
                        )}
                    </Box>
                );

            case 'ai-response':
                return (
                    <Box sx={{ position: 'relative', alignSelf: 'flex-start', maxWidth: '85%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 0.5 }}>
                            <Avatar sx={{ width: 24, height: 24, bgcolor: 'secondary.main' }}>
                                <SmartToyIcon sx={{ fontSize: 16 }} />
                            </Avatar>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                                {timestamp}
                            </Typography>
                        </Box>
                        <Paper
                            elevation={0}
                            sx={{
                                backgroundColor: isDarkMode ? 'rgba(66, 66, 77, 0.9)' : 'rgba(248, 249, 250, 0.95)',
                                p: 2,
                                borderRadius: '16px 16px 16px 4px',
                                width: '100%',
                                mb: 1,
                                position: 'relative',
                                boxShadow: isDarkMode
                                    ? '0 2px 8px rgba(0, 0, 0, 0.4), 0 1px 3px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                                    : '0 2px 6px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
                                border: '1px solid',
                                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
                            }}
                        >
                            <Box
                                sx={{
                                    fontSize: '0.9rem',
                                    color: 'text.primary',
                                    '& h3': {
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        mt: 1.5,
                                        mb: 1,
                                        color: isDarkMode ? 'primary.light' : 'primary.dark'
                                    },
                                    '& strong': {
                                        fontWeight: 600,
                                        color: isDarkMode ? 'secondary.light' : 'secondary.dark'
                                    },
                                    '& p': {
                                        mt: 0.5,
                                        mb: 0.5,
                                        lineHeight: 1.5
                                    },
                                    '& ul, & ol': {
                                        pl: 2,
                                        '& li': {
                                            mb: 0.5
                                        }
                                    },
                                    '& a': {
                                        color: 'primary.main',
                                        textDecoration: 'none',
                                        '&:hover': {
                                            textDecoration: 'underline'
                                        }
                                    },
                                    '& code': {
                                        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.05)',
                                        padding: '2px 4px',
                                        borderRadius: '4px',
                                        fontFamily: 'monospace',
                                        fontSize: '0.85em'
                                    },
                                    '& pre': {
                                        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.05)',
                                        padding: '8px 12px',
                                        borderRadius: '6px',
                                        overflowX: 'auto',
                                        '& code': {
                                            backgroundColor: 'transparent',
                                            padding: 0
                                        }
                                    }
                                }}
                            >
                                <ReactMarkdown>
                                    {message.content}
                                </ReactMarkdown>
                            </Box>
                        </Paper>
                        {editMode && (
                            <IconButton
                                size="small"
                                sx={{
                                    position: 'absolute',
                                    top: 32,
                                    left: -28,
                                    backgroundColor: theme.palette.background.paper,
                                    boxShadow: theme.shadows[2],
                                    '&:hover': { backgroundColor: theme.palette.action.hover }
                                }}
                                onClick={(e) => handleMessageMenuOpen(e, message.id)}
                            >
                                <MoreVertIcon fontSize="small" />
                            </IconButton>
                        )}
                    </Box>
                );

            case 'error':
                return (
                    <Box sx={{ position: 'relative', alignSelf: 'center', maxWidth: '85%', my: 2 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                py: 1,
                                px: 2,
                                borderRadius: '12px',
                                backgroundColor: isDarkMode ? 'error.dark' : 'error.light',
                                border: '1px solid',
                                borderColor: 'error.main',
                                width: '100%',
                                boxShadow: isDarkMode
                                    ? '0 2px 8px rgba(211, 47, 47, 0.3), 0 1px 3px rgba(211, 47, 47, 0.2)'
                                    : '0 2px 6px rgba(211, 47, 47, 0.15), 0 1px 3px rgba(211, 47, 47, 0.1)'
                            }}
                        >
                            <Typography
                                variant="body2"
                                color={isDarkMode ? 'error.light' : 'error.dark'}
                                sx={{
                                    whiteSpace: 'pre-wrap',
                                    fontSize: '0.875rem',
                                    textAlign: 'center'
                                }}
                            >
                                {message.content}
                            </Typography>
                        </Paper>
                        {editMode && (
                            <IconButton
                                size="small"
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    right: -28,
                                    transform: 'translateY(-50%)',
                                    backgroundColor: theme.palette.background.paper,
                                    boxShadow: theme.shadows[2],
                                    '&:hover': { backgroundColor: theme.palette.action.hover }
                                }}
                                onClick={(e) => handleMessageMenuOpen(e, message.id)}
                            >
                                <MoreVertIcon fontSize="small" />
                            </IconButton>
                        )}
                    </Box>
                );

            default:
                return null;
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            TransitionComponent={Fade}
            transitionDuration={300}
            maxWidth="md"
            fullWidth
            PaperProps={{
                elevation: 8,
                sx: {
                    borderRadius: 3,
                    overflow: 'hidden',
                    height: '80vh',
                    display: 'flex',
                    flexDirection: 'column'
                }
            }}
        >
            <DialogTitle sx={{
                p: 2,
                backgroundColor: isDarkMode ? 'primary.dark' : 'primary.main',
                color: 'primary.contrastText',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid',
                borderColor: isDarkMode ? 'primary.light' : 'primary.dark'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SmartToyIcon />
                    <Typography variant="subtitle1" fontWeight="medium">
                        AI Chat Assistant
                    </Typography>
                </Box>
                <Box>
                    <IconButton
                        onClick={handleHeaderMenuOpen}
                        size="small"
                        sx={{ color: 'primary.contrastText', mr: 1 }}
                    >
                        <MoreHorizIcon fontSize="small" />
                    </IconButton>

                    <IconButton
                        onClick={handleClose}
                        size="small"
                        sx={{ color: 'primary.contrastText' }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
            </DialogTitle>

            {/* Header Menu */}
            <Menu
                anchorEl={headerMenuAnchor}
                open={Boolean(headerMenuAnchor)}
                onClose={handleHeaderMenuClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={toggleEditMode}>
                    <EditIcon fontSize="small" sx={{ mr: 1 }} />
                    {editMode ? 'Exit edit mode' : 'Enter edit mode'}
                </MenuItem>
                <MenuItem onClick={handleClearChat}>
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                    Clear chat history
                </MenuItem>
            </Menu>

            {/* Message Menu */}
            <Menu
                anchorEl={messageMenuAnchor}
                open={Boolean(messageMenuAnchor)}
                onClose={handleMessageMenuClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <MenuItem onClick={handleDeleteMessage}>
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                    Delete message
                </MenuItem>
            </Menu>

            <DialogContent sx={{
                p: 0,
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                overflow: 'hidden',
                bgcolor: isDarkMode ? 'grey.900' : 'grey.50'
            }}>
                {/* Chat history */}
                <Box
                    ref={chatContainerRef}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1,
                        overflowY: 'auto',
                        p: 3,
                        gap: 3
                    }}
                >
                    {chatHistory.length === 0 ? (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                opacity: isDarkMode ? 0.5 : 0.7,
                                py: 3
                            }}
                        >
                            <SmartToyIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2, opacity: 0.8 }} />
                            <Typography variant="body1" color="text.secondary" align="center" sx={{ fontWeight: 500 }}>
                                Welcome to AI Chat Assistant
                            </Typography>
                            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                                Select text and ask questions about it.
                                <br />
                                Your conversation history will be saved here.
                            </Typography>
                        </Box>
                    ) : (
                        chatHistory.map(message => (
                            <Box key={message.id}>
                                {renderChatMessage(message)}
                            </Box>
                        ))
                    )}

                    {/* Loading indicator */}
                    {isLoading && (
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            alignSelf: 'flex-start',
                            ml: 4
                        }}>
                            <CircularProgress size={16} thickness={5} sx={{ color: 'secondary.main' }} />
                            <Typography variant="caption" color="text.secondary">
                                AI is thinking...
                            </Typography>
                        </Box>
                    )}

                    {/* New text added indicator */}
                    {newTextAdded && !isLoading && (
                        <Chip
                            label="New text added to chat"
                            color="success"
                            size="small"
                            sx={{
                                alignSelf: 'center',
                                mb: 2,
                                borderRadius: '12px',
                                '& .MuiChip-label': {
                                    px: 2
                                }
                            }}
                        />
                    )}

                    {/* Invisible element to scroll to */}
                    <div ref={chatEndRef} style={{ height: '1px', width: '100%' }} />
                </Box>

                {/* Input area */}
                <Box sx={{
                    p: 2,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    bgcolor: isDarkMode ? 'grey.900' : 'background.paper'
                }}>
                    <Box sx={{
                        display: 'flex',
                        gap: 1.5,
                        alignItems: 'flex-end'
                    }}>
                        <TextField
                            fullWidth
                            multiline
                            maxRows={4}
                            placeholder="Type your message..."
                            value={customQuestion}
                            onChange={(e) => setCustomQuestion(e.target.value)}
                            onKeyPress={handleKeyPress}
                            variant="outlined"
                            size="small"
                            InputProps={{
                                sx: {
                                    borderRadius: 3,
                                    backgroundColor: isDarkMode ? 'grey.800' : 'grey.50',
                                    '&:hover': {
                                        backgroundColor: isDarkMode ? 'grey.700' : 'grey.100'
                                    }
                                },
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={handlePresetMenuOpen}
                                        >
                                            <AttachFileIcon fontSize="small" />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={!customQuestion.trim()}
                            onClick={handleSendCustomQuestion}
                            sx={{
                                minWidth: 'auto',
                                width: 48,
                                height: 40,
                                borderRadius: 3
                            }}
                        >
                            <SendIcon />
                        </Button>
                    </Box>
                </Box>

                {/* Preset Questions Menu */}
                <Menu
                    anchorEl={presetMenuAnchor}
                    open={Boolean(presetMenuAnchor)}
                    onClose={handlePresetMenuClose}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                >
                    <MenuItem onClick={() => handlePresetQuestionSelect('explain')}>
                        <HelpIcon fontSize="small" sx={{ mr: 1 }} />
                        Explain this
                    </MenuItem>
                    <MenuItem onClick={() => handlePresetQuestionSelect('why')}>
                        <WhyIcon fontSize="small" sx={{ mr: 1 }} />
                        Why is this important?
                    </MenuItem>
                </Menu>
            </DialogContent>
        </Dialog>
    );
}
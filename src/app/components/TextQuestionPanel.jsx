import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, IconButton, Box, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect } from 'react';

export function TextQuestionPanel({ selectedText, question, questionType, onClose, open, context }) {
    const [answer, setAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!open) return;

        const fetchAnswer = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/ai/question', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        text: selectedText,
                        question: questionType === 'explain' ? 'Can you explain this text?' :
                            questionType === 'why' ? 'Why is this important or significant?' :
                                question,
                        context: context
                    })
                });

                const data = await response.json();
                setAnswer(data.result);
            } catch (error) {
                console.error('Error fetching AI answer:', error);
                setAnswer('Sorry, there was an error getting the answer. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnswer();
    }, [selectedText, questionType, question, open, context]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            sx={{
            }}
        >
            <DialogTitle sx={{ p: 2, pb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">
                        {questionType === 'explain' ? 'Explain this:' :
                            questionType === 'why' ? 'Why?' :
                                'Custom Question: ' + question}
                    </Typography>
                    <IconButton onClick={onClose} size="small" edge="end">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent dividers>
                <Typography variant="body1" component="div" sx={{
                    backgroundColor: 'action.selected',
                    p: 2,
                    borderRadius: 1,
                    mb: 2
                }}>
                    "{selectedText}"
                </Typography>

                <Box sx={{ position: 'relative', minHeight: 60 }}>
                    {isLoading ? (
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            width: '100%'
                        }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Typography variant="body1" color="text.primary" sx={{
                            whiteSpace: 'pre-wrap',
                            lineHeight: 1.6 // Improved readability
                        }}>
                            {answer}
                        </Typography>
                    )}
                </Box>
            </DialogContent>
        </Dialog>
    );
}
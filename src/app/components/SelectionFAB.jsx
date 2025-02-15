import { SpeedDial, SpeedDialAction, SpeedDialIcon, Dialog, DialogTitle, DialogContent, TextField, Button, Box } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import WhyIcon from '@mui/icons-material/Psychology';
import CustomIcon from '@mui/icons-material/Create';
import { useState } from 'react';

export function SelectionFAB({ selectedText, onAction, visible }) {
    const [customDialogOpen, setCustomDialogOpen] = useState(false);
    const [customQuestion, setCustomQuestion] = useState('');

    if (!visible) return null;

    const handleCustomAction = () => {
        if (customQuestion.trim()) {
            onAction('custom', customQuestion);
            setCustomDialogOpen(false);
            setCustomQuestion('');
        }
    };

    const actions = [
        { icon: <HelpIcon />, name: 'explain', tooltip: 'Explain' },
        { icon: <WhyIcon />, name: 'why', tooltip: 'Why?' },
        { icon: <CustomIcon />, name: 'custom-open', tooltip: 'Custom Question' },
    ];

    const handleActionClick = (actionName) => {
        if (actionName === 'custom-open') {
            setCustomDialogOpen(true);
        } else {
            onAction(actionName);
        }
    };

    return (
        <>
            <SpeedDial
                ariaLabel="Text selection actions"
                sx={{
                    position: 'fixed',
                    bottom: '22vh',
                    right: 16,
                }}
                icon={<SpeedDialIcon />}
                direction="left"
            >
                {actions.map((action) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.tooltip}
                        onClick={() => handleActionClick(action.name)}
                    />
                ))}
            </SpeedDial>

            <Dialog open={customDialogOpen} onClose={() => setCustomDialogOpen(false)}>
                <DialogTitle>Ask a Custom Question</DialogTitle>
                <DialogContent>
                    <Box sx={{ p: 2 }}>
                        <TextField
                            fullWidth
                            multiline
                            rows={2}
                            value={customQuestion}
                            onChange={(e) => setCustomQuestion(e.target.value)}
                            placeholder="Type your question here..."
                        />
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Button onClick={() => setCustomDialogOpen(false)}>Cancel</Button>
                            <Button variant="contained" onClick={handleCustomAction}>Ask</Button>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
}
import React, { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';
import { CopyAll, Person as PersonIcon } from '@mui/icons-material';
import { Box, Dialog, DialogContent, DialogTitle, Divider, IconButton, MenuItem, MenuList, Paper, Typography } from '@mui/material';
import { AppContext } from '../AppContext';
import { TrainingPlansList } from './TrainingPlans';
import { useExercisesAPI } from '../exercisesAPI';
import LinearProgress from '@mui/material/LinearProgress';

function UserTrainingPlanMenu({
    open, onClose, planId, trainingPlans, importTrainingPlan,
}) {

    if (!planId) {
        return null;
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle
                sx={{
                    backgroundColor: 'lightblue'
                }}
            >
            </DialogTitle>
            <DialogContent>
                <MenuList>
                    <MenuItem
                        onClick={() => {
                            importTrainingPlan(planId);
                            onClose();
                        }}
                    >
                        <IconButton>
                            <CopyAll />
                        </IconButton>
                        Import
                    </MenuItem>
                </MenuList>
            </DialogContent>
        </Dialog>
    );
}

export function User() {
    const { createTrainingPlanActions, importTrainingPlan } = useExercisesAPI()
    const { params: { username }, setRoute } = React.useContext(AppContext);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [data, setData] = React.useState(null);
    const [trainingPlanMenuOpenId, setTrainingPlanMenuOpenId] = useState(null)
    console.log({ trainingPlanMenuOpenId });

    function onTrainingPlanMenuOpenClicked(id) {
        setTrainingPlanMenuOpenId(id)
    }


    React.useEffect(() => {
        Promise.all([
            fetch('/api/userData?username=' + username).then(res => res.json()),
            fetch('/api/trainingPlans?username=' + username).then(res => res.json())
        ])
            .then(([{ user }, { plans }]) => {
                setData({
                    user,
                    trainingPlans: plans
                });
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            })
    }, [])

    async function importTrainingPlanClicked(id) {
        const trainingPlan = data.trainingPlans.find(plan => plan.id === id);
        
        await importTrainingPlan({ plan: trainingPlan, name: `${trainingPlan.name} (${data.user.name})` });
        setRoute('training_plans');

    }

    if (loading) return <LinearProgress color="secondary" />

    if (error) return <div>Error: {error.message}</div>
    return (
        <Paper sx={{
            p: 2,
            height: '74vh',
            m: '10px',
            overflowY: 'auto',

        }}>
            <Box sx={{
                display: 'flex',
                mb: 4,

            }}>
                <Avatar
                    sx={{
                        width: 45,
                        height: 45
                    }}
                    src={data.user.profilePic} />
                <Typography
                    sx={{
                        ml: 2,
                        fontSize: 32
                    }}
                >{data.user.name}</Typography>
            </Box>
            <Box>
                {trainingPlanMenuOpenId ? <UserTrainingPlanMenu

                    importTrainingPlan={importTrainingPlanClicked}

                    open={trainingPlanMenuOpenId !== null}
                    planId={trainingPlanMenuOpenId}
                    onClose={() => setTrainingPlanMenuOpenId(null)}
                /> : null}
                <TrainingPlansList
                    trainingPlans={data.trainingPlans}
                    currentTrainingPlan={null}
                    createTrainingPlanActions={createTrainingPlanActions}
                    trainingPlansOpen={() => { }}
                    onTrainingPlanMenuOpenClicked={onTrainingPlanMenuOpenClicked}
                    toggleTrainingPlan={() => { }}
                    selectTrainingPlanClicked={() => { }}
                />
            </Box>
        </Paper>
    )
}


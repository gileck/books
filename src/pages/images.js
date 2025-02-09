import React, { useState, useCallback, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
// import exercisesJSON from '../api'
import _ from 'lodash'
import Image from 'next/image';
import { CopyAll } from '@mui/icons-material';
const exercisesJSON = {}

const ExercisesAutocomplete = () => {
    const exercises = Object.values(exercisesJSON);

    const [inputValue, setInputValue] = useState('');
    const [debouncedInputValue, setDebouncedInputValue] = useState('');
    const [visibleCount, setVisibleCount] = useState(500); // Initial load count

    const debouncedSetInputValue = useCallback(
        _.debounce((value) => setDebouncedInputValue(value), 300),
        []
    );

    const handleInputChange = (event) => {
        const value = event.target.value;
        setInputValue(value);
        debouncedSetInputValue(value);
    };

    const handleLoadMore = () => {
        setVisibleCount(prevCount => prevCount + 500); // Load 500 more images
    };

    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
        handleLoadMore();
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const filteredExercises = exercises.filter(exercise =>
        exercise.name.toLowerCase().includes(debouncedInputValue.toLowerCase())
    ).slice(0, visibleCount); // Limit the number of displayed exercises

    return (
        <div>
            <TextField
                label="Search Exercises"
                variant="outlined"
                value={inputValue}
                onChange={handleInputChange}
                fullWidth
            />
            <Box mt={2} display="flex" flexWrap="wrap" justifyContent="space-around">
                {filteredExercises.map((exercise) => (
                    <Box key={exercise.id} display="flex" flexDirection="column" alignItems="center" mb={2} mx={1}>
                        <img
                            src={`./images/${exercise.image}`}
                            style={{ width: 300, height: 300, mb: 1 }}
                        />
                        <Typography variant="h6" align="center">{exercise.name}</Typography>
                        <CopyAll onClick={() => navigator.clipboard.writeText(`${exercise.image}`)} />
                    </Box>
                ))}
            </Box>
        </div>
    );
};

export default ExercisesAutocomplete;

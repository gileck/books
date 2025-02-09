import React from 'react';
import { Checkbox, Chip, Box, FormControlLabel, FormGroup, InputLabel, ListItemText, Menu, MenuItem, Paper, Radio, Select, TextField, Slider, Tooltip, Divider } from "@mui/material";
import { Info, InfoOutlined } from '@mui/icons-material';

const types = {
    'singleSelect': {
        Comp: Select,
        childrenFunc: (children, formValue) => children.map((child) => {
            return <MenuItem selected={child === formValue} key={child.value} value={child.value}>
                {child.label}
            </MenuItem>
        }),
    },
    'multiSelect': {
        Comp: Select,
        childrenFunc: (children, formValue) => children.map((child) => {
            return <MenuItem key={child.value} value={child.value}>
                <Checkbox checked={_.isArray(formValue) ? formValue.includes(child.value) : formValue === child.value} />
                <ListItemText primary={child.label} />
            </MenuItem>
        }),
        renderValue: children => (selected) => (
            < Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {
                    selected.map((value) => (
                        <Chip key={value} label={children.find(c => c.value === value).label} />
                    ))
                }
            </Box >
        ),
    },
    'text': {
        Comp: TextField
    },
    'Slider': {
        Comp: Slider
    }
}
export function FormBuilder({ formElements, onChange }) {
    const defaultValues = _.mapValues(formElements, 'default');
    const [formValues, setFormValues] = React.useState(defaultValues)

    console.log({ formValues });

    function onFormValueChange(key, validate) {

        return (e) => {
            const value = e.target.value
            console.log({ key, value });

            if (value !== '' && validate && !validate(value)) return;

            setFormValues({
                ...formValues,
                [key]: value
            })

            onChange({
                ...formValues,
                [key]: value
            })
        }
    }
    return <FormGroup
        sx={{
            padding: '20px'

        }}
    >
        {
            Object.keys(formElements).map((key, index) => {
                const value = formValues[key]
                const { type, labelFn, label, options, children, validate, inline, description } = formElements[key];

                console.log({ children });

                const { renderValue, Comp: Component, childrenFunc } = types[type];
                return <div
                    style={{
                        marginTop: '10px',
                        display: inline ? 'flex' : 'block',
                    }}
                >
                    <InputLabel
                        id={`id-${key}-label`}
                        sx={{
                            marginRight: '10px',
                            alignSelf: 'center',
                            marginTop: '10px',

                        }}
                    >
                        <span style={{ display: "flex" }}>
                            <span>
                                {labelFn ? labelFn(value) : label}
                            </span>
                            <span>
                                {description ? <Tooltip title={description}>
                                    <InfoOutlined sx={{ marginTop: '-1px', marginLeft: '30px' }} />
                                </Tooltip> : ''}
                            </span>
                        </span>


                    </InputLabel>
                    <Component
                        key={index}
                        labelId={`id-${key}-label`}
                        id={key}
                        value={value}
                        onChange={onFormValueChange(key, validate)}
                        {...renderValue ? { renderValue: renderValue(children) } : ''}
                        {...options}>
                        {childrenFunc ? childrenFunc(children, value) : ''}

                    </Component>
                    <Divider
                        sx={{ marginTop: '20px' }}
                    />
                </div>
            })
        }
    </FormGroup >



}
import React, { useState, FC } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

interface OptionType {
    label: string;
    value: string;
}

interface AutocompleteFieldProps {
    label: string;
    value: string;
    onChange: (event: React.SyntheticEvent<Element, Event>, newValue: OptionType | null) => void;
    options: OptionType[];
}

const AutocompleteField: FC<AutocompleteFieldProps> = ({ label, value, onChange, options }) => {
    const [inputValue, setInputValue] = useState('');
    const handleInputChange = (event: React.SyntheticEvent, newInputValue: string) => {
        setInputValue(newInputValue);
    };
    const filteredOptions = options.filter(option => option.label.toLowerCase().includes(inputValue.toLowerCase()));
    return (
        <Autocomplete
            options={filteredOptions}
            getOptionLabel={(option) => option.label}
            value={options.find(option => option.value === value) || null}
            onChange={onChange}
            inputValue={inputValue}
            onInputChange={handleInputChange}
            noOptionsText="No data available"
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    variant="outlined"
                    InputProps={{
                        ...params.InputProps,
                        style: {
                            borderColor: 'white',
                            color: 'white',
                            caretColor: 'white'
                        }
                    }}
                    InputLabelProps={{
                        ...params.InputLabelProps,
                        style: { color: 'white' }
                    }}
                    style={{
                        borderColor: 'white',
                        color: 'white'
                    }}
                />
            )}
        />
    );
};

export default AutocompleteField;

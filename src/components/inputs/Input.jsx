import { useState } from 'react';
import inputStyles from './css/input.module.css';

export function Input({
    labelText,
    name,
    type,
    ariaLabel,
    pattern,
    autoComplete,
    defaultValue,
    isRequired,
}) {
    const [hasFocus, setHasFocus] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    function getTypeForLabelPositioning() {
        if (hasValue || hasFocus) {
            return 'date';
        } else {
            return 'text';
        }
    }

    return (
        <div className={inputStyles.container}>
            <input
                id={name}
                name={name}
                type={type === 'date' ? getTypeForLabelPositioning() : type}
                aria-label={ariaLabel}
                placeholder="" // for floating label when not in focus
                pattern={pattern}
                autoComplete={autoComplete}
                defaultValue={defaultValue}
                required={isRequired}
                onFocus={() => setHasFocus(true)}
                onBlur={() => setHasFocus(false)}
                onChange={(e) => setHasValue(Boolean(e.target.value))}
            />
            <label htmlFor={name}>{isRequired ? `${labelText} (required)` : labelText}</label>
        </div>
    );
}

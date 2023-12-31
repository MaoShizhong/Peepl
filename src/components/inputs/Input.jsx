import { useState } from 'react';
import { PASSWORD_REQUIREMENTS_PATTERN } from '../../helpers/constants';
import inputStyles from './css/input.module.css';

export function Input({
    labelText,
    name,
    type,
    ariaLabel,
    autoComplete,
    defaultValue,
    onInput,
    isRequired,
}) {
    const [hasFocus, setHasFocus] = useState(false);
    const [hasValue, setHasValue] = useState(Boolean(defaultValue));

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
                pattern={type === 'password' ? PASSWORD_REQUIREMENTS_PATTERN : undefined}
                autoComplete={autoComplete}
                defaultValue={defaultValue}
                required={isRequired}
                onFocus={() => setHasFocus(true)}
                onBlur={() => setHasFocus(false)}
                onInput={(e) => {
                    if (onInput) onInput(e);
                }}
                onChange={(e) => setHasValue(Boolean(e.target.value))}
            />
            <label htmlFor={name}>{isRequired ? `${labelText} (required)` : labelText}</label>
        </div>
    );
}

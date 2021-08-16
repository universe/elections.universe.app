import './Checkbox.css';
import React from 'react';

export interface CheckboxProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  children?: JSX.Element | string | JSX.Element[] | string[];
  disabled?: boolean;
}

export default function Checkbox(props: CheckboxProps) {
  return (
    <div className="checkbox">
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style={{position: 'fixed', top: 0, left: 0, width: 0, height: 0}}>
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -7" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      <input className={`checkbox__input ${props.disabled ? 'disabled' : ''}}`} type="checkbox" checked={props.checked} onChange={() => {if(!props.disabled){ props.onChange(!props.checked)}}} />
      <label className="checkbox__label">{props.children}</label>
      <svg className="checkbox__check" width="15" height="14" viewBox="0 0 15 14" fill="none">
        <path d="M2 8.36364L6.23077 12L13 2" />
      </svg>
    </div>
  );
}

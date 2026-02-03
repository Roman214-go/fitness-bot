import { useState } from 'react';

import { FaChevronDown } from 'react-icons/fa';

interface IHiddenText {
  text: string;
}

export const HiddenText = ({ text }: IHiddenText) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        onClick={() => setOpen(!open)}
        style={{
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <FaChevronDown
          color='yellow'
          style={{
            transition: 'transform 0.3s',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </div>

      <div
        style={{
          maxHeight: open ? '11200px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.3s ease',
          marginTop: '8px',
        }}
      >
        <p style={{ color: '#8F9AA2', textAlign: 'center', lineHeight: 2 }}>{text}</p>
      </div>
    </>
  );
};

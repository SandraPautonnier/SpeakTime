import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';

const Dropdown = ({ title, options, onSelect, selectedValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);
  const toggle = () => setIsOpen(!isOpen);

  const handleSelectOption = (value) => {
    onSelect(value);
    setIsOpen(false);
  };

  const selectedLabel = options.find(opt => opt.value === selectedValue)?.label || title;

  return (
    <div className="container-dropdown">
      <div className="click-toggle" onClick={toggle}>
        <h3>{selectedLabel}</h3>
        <button type="button">
          <FontAwesomeIcon
            icon={faChevronUp}
            style={{
              transition: 'transform 0.2s ease-in-out',
              transform: isOpen ? 'rotate(-180deg)' : 'rotate(0deg)',
            }}
          />
        </button>
      </div>
      <div
        className={`content-dropdown ${isOpen ? "open" : "closed"}`}
        ref={contentRef}
        style={{
          height: isOpen ? `${contentRef.current?.scrollHeight}px` : "0px",
          overflow: "hidden",
          transition: "height 0.2s ease-in-out",
        }}
      >
        <ul className="content-drop">
          {options.map((option) => (
            <li 
              key={option.value} 
              onClick={() => handleSelectOption(option.value)}
              className={selectedValue === option.value ? 'selected' : ''}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dropdown;

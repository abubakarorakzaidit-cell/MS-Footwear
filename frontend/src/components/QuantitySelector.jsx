import React from "react";
import { FiMinus, FiPlus } from "react-icons/fi";

const QuantitySelector = ({ value, onChange, min = 1, max = 99 }) => {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  return (
    <div className="inline-flex items-center rounded-full border border-line">
      <button
        type="button"
        onClick={dec}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className="flex h-9 w-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-primary-light hover:text-primary disabled:opacity-30"
      >
        <FiMinus size={14} />
      </button>
      <span className="w-8 text-center text-sm font-semibold">{value}</span>
      <button
        type="button"
        onClick={inc}
        disabled={value >= max}
        aria-label="Increase quantity"
        className="flex h-9 w-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-primary-light hover:text-primary disabled:opacity-30"
      >
        <FiPlus size={14} />
      </button>
    </div>
  );
};

export default QuantitySelector;

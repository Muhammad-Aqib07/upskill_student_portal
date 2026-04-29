"use client";

export function PrintButton() {
  return (
    <button className="secondary-button w-fit" onClick={() => window.print()} type="button">
      Print Certificate
    </button>
  );
}

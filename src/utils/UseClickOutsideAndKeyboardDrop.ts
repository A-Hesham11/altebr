import { useEffect, useRef, useState } from "react";

export function UseClickOutsideAndKeyboardDrop<T>(
  items: T[],
  setSelectedItem: any,
  containerRef: any,
  tableId: string,
  activeTable: string | null,
  setActiveTable: (id: string | null) => void
) {
  const [selectedRow, setSelectedRow] = useState<number | null>(0);

  const buttonId = "view-details-button";

  const handleClickOutside = (event: MouseEvent) => {
    const buttonElement = buttonId ? document.getElementById(buttonId) : null;
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node) &&
      (!buttonElement || !buttonElement.contains(event.target as Node))
    ) {
      if (activeTable === tableId) {
        setActiveTable(null);
        setSelectedRow(null);
      }
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (activeTable === tableId) {
      if (event.key === "ArrowDown") {
        setSelectedRow((prev) =>
          prev !== null && prev < items.length - 1 ? prev + 1 : prev
        );
      } else if (event.key === "ArrowUp") {
        setSelectedRow((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
      }
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    setSelectedItem(selectedRow !== null ? items[selectedRow ?? 0] : null);

    return () => {
      window.removeEventListener("click", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedRow]);

  useEffect(() => {
    if (activeTable !== tableId) {
      setSelectedRow(null);
    }
  }, [activeTable]);

  return { selectedRow, setSelectedRow };
}

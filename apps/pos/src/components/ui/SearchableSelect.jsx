"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

export default function SearchableSelect({
  options = [],
  value,
  onChange,
  placeholder = "Select...",
  getLabel = (opt) => opt.name || opt.label || opt.toString(),
  getValue = (opt) => opt._id || opt.value || opt,
  renderOption,
  disabled = false,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dropdownStyle, setDropdownStyle] = useState({});
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const selectedOption = options.find((o) => getValue(o) === value);

  const prevOpen = useRef(isOpen);
  useEffect(() => {
    if (prevOpen.current && !isOpen) {
      setSearch("");
      setHighlightedIndex(-1);
    }
    prevOpen.current = isOpen;
  }, [isOpen]);

  const filtered = search
    ? options.filter((o) =>
        getLabel(o).toLowerCase().includes(search.toLowerCase())
      )
    : options;

  const updatePosition = useCallback(() => {
    if (!isOpen || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const dropdownHeight = Math.min(options.length * 48 + 16, 384);
    const openUp = spaceBelow < dropdownHeight && rect.top > spaceBelow;

    setDropdownStyle({
      position: "fixed",
      left: `${rect.left}px`,
      width: `${Math.max(rect.width, 420)}px`,
      ...(openUp
        ? { bottom: `${window.innerHeight - rect.top + 4}px` }
        : { top: `${rect.bottom + 4}px` }),
      zIndex: 9999,
    });
  }, [isOpen, options.length]);

  useEffect(() => {
    if (!isOpen) return;
    updatePosition();
  }, [isOpen, updatePosition]);

  // Re-position on scroll/resize
  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen, updatePosition]);

  // Click outside handler
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target) &&
        listRef.current &&
        !listRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleKeyDown = (e) => {
    if (!isOpen && (e.key === "ArrowDown" || e.key === "Enter")) {
      e.preventDefault();
      setIsOpen(true);
      return;
    }
    if (!isOpen) return;

    switch (e.key) {
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        break;
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filtered.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filtered.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filtered.length) {
          const selected = filtered[highlightedIndex];
          onChange(getValue(selected));
          setIsOpen(false);
        }
        break;
      case "Tab":
        setIsOpen(false);
        break;
    }
  };

  const handleInputChange = (e) => {
    setSearch(e.target.value);
    setHighlightedIndex(-1);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div
        onClick={() => {
          if (!disabled) {
            setIsOpen((prev) => !prev);
            setTimeout(() => inputRef.current?.focus(), 50);
          }
        }}
        className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm cursor-pointer select-none"
      >
        <input
          ref={inputRef}
          readOnly={!isOpen}
          value={isOpen ? search : (selectedOption ? getLabel(selectedOption) : "")}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={isOpen ? "Type to search..." : placeholder}
          className="flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground cursor-pointer"
          onFocus={() => !disabled && !isOpen && setIsOpen(true)}
        />
        <svg
          className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && typeof window === "object" && createPortal(
        <div
          ref={listRef}
          style={dropdownStyle}
          onMouseDown={(e) => e.stopPropagation()}
          className="max-h-96 overflow-y-auto rounded-lg border border-border bg-card p-1 shadow-2xl animate-in fade-in"
        >
          {filtered.length === 0 ? (
            <div className="px-3 py-6 text-center text-xs text-muted-foreground">
              No results found
            </div>
          ) : (
            filtered.map((opt, index) => {
              const val = getValue(opt);
              const isHighlighted = index === highlightedIndex;
              return (
                <div
                  key={val}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(val);
                    setIsOpen(false);
                  }}
                  className={`rounded-md px-3 py-2 text-sm cursor-pointer transition-colors ${
                    val === value
                      ? "bg-primary/10 text-primary font-medium"
                      : isHighlighted
                      ? "bg-accent"
                      : "text-foreground hover:bg-accent"
                  }`}
                >
                  {renderOption ? renderOption(opt) : getLabel(opt)}
                </div>
              );
            })
          )}
        </div>,
        document.body
      )}
    </div>
  );
}

import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Clock, ArrowUpRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = "https://himprash-backend.onrender.com/api"
const STORAGE_KEY = "himprash_recent_searches";
const MAX_RECENT = 5;
const MAX_SUGGESTIONS = 8;

function getRecentSearches() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch { return []; }
}

function saveSearch(term) {
  if (!term.trim()) return;
  const recent = getRecentSearches().filter((s) => s !== term.trim());
  recent.unshift(term.trim());
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)));
}

export default function SearchBar({ onSearch, onCategorySelect, selectedCategory, searchQuery: externalQuery }) {
  const [query, setQuery] = useState(externalQuery || "");
  const [categories, setCategories] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const wrapperRef = useRef(null);
  const debounceRef = useRef(null);
  const navigate = useNavigate();

  // Fetch categories once
  useEffect(() => {
    axios.get(`${API}/categories`).then((r) => setCategories(r.data)).catch(() => {});
  }, []);

  // Sync external query
  useEffect(() => {
    if (externalQuery !== undefined) setQuery(externalQuery);
  }, [externalQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Debounced autocomplete
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoadingSuggestions(true);
      try {
        const res = await axios.get(`${API}/products?search=${encodeURIComponent(query.trim())}`);
        setSuggestions(res.data.slice(0, MAX_SUGGESTIONS));
      } catch {
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 200);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  const handleFocus = () => {
    setRecentSearches(getRecentSearches());
    setShowDropdown(true);
  };

  const executeSearch = useCallback((term) => {
    const t = term || query;
    if (t.trim()) saveSearch(t.trim());
    setShowDropdown(false);
    if (onSearch) {
      onSearch(t);
    } else {
      navigate(`/products?search=${encodeURIComponent(t)}`);
    }
  }, [query, onSearch, navigate]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") executeSearch();
    if (e.key === "Escape") setShowDropdown(false);
  };

  const handleSuggestionClick = (product) => {
    saveSearch(product.name);
    setShowDropdown(false);
    navigate(`/products/${product.id}`);
  };

  const handleRecentClick = (term) => {
    setQuery(term);
    executeSearch(term);
  };

  const clearSearch = () => {
    setQuery("");
    setSuggestions([]);
    if (onSearch) onSearch("");
  };

  const hasQuery = query.trim().length > 0;
  const showRecent = !hasQuery && recentSearches.length > 0;
  const showSuggestions = hasQuery && (suggestions.length > 0 || loadingSuggestions);
  const showEmpty = hasQuery && !loadingSuggestions && suggestions.length === 0;

  return (
    <div data-testid="search-bar" className="w-full bg-[#131820] border-b border-[#1F2937]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-3">
        <div className="flex items-center gap-3">
          {/* Search input with dropdown */}
          <div className="flex-1 relative" ref={wrapperRef}>
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B78] z-10" strokeWidth={1.5} />
            <input
              data-testid="search-input"
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setShowDropdown(true); }}
              onFocus={handleFocus}
              onKeyDown={handleKeyDown}
              placeholder="Search parts by name..."
              autoComplete="off"
              className="w-full bg-[#0E1117] border border-[#1F2937] text-[#E8E8ED] placeholder-[#6B6B78] pl-10 pr-10 py-2.5 text-sm rounded-md focus:outline-none focus:border-[#0A84FF] focus:ring-1 focus:ring-[#0A84FF] transition-all"
            />
            {query && (
              <button
                data-testid="search-clear"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B78] hover:text-[#E8E8ED] transition-colors z-10"
              >
                <X className="w-4 h-4" strokeWidth={1.5} />
              </button>
            )}

            {/* Dropdown */}
            {showDropdown && (showRecent || showSuggestions || showEmpty) && (
              <div
                data-testid="search-dropdown"
                className="absolute top-full left-0 right-0 mt-1.5 bg-[#161B22] border border-[#1F2937] rounded-md shadow-xl shadow-black/30 overflow-hidden z-50"
              >
                {/* Recent searches */}
                {showRecent && (
                  <div data-testid="recent-searches">
                    <p className="px-3.5 pt-3 pb-1.5 text-[10px] uppercase tracking-[0.15em] text-[#6B6B78] font-semibold">
                      Recent Searches
                    </p>
                    {recentSearches.map((term, i) => (
                      <button
                        key={i}
                        data-testid={`recent-search-${i}`}
                        onClick={() => handleRecentClick(term)}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm text-[#A0A0AB] hover:bg-[#0A84FF]/10 hover:text-[#E8E8ED] transition-colors text-left"
                      >
                        <Clock className="w-3.5 h-3.5 flex-shrink-0 text-[#6B6B78]" strokeWidth={1.5} />
                        <span className="truncate">{term}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Live suggestions */}
                {showSuggestions && (
                  <div data-testid="search-suggestions">
                    {!showRecent && (
                      <p className="px-3.5 pt-3 pb-1.5 text-[10px] uppercase tracking-[0.15em] text-[#6B6B78] font-semibold">
                        Suggestions
                      </p>
                    )}
                    {suggestions.map((product) => (
                      <button
                        key={product.id}
                        data-testid={`suggestion-${product.id}`}
                        onClick={() => handleSuggestionClick(product)}
                        className="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 hover:bg-[#0A84FF]/10 transition-colors text-left group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Search className="w-3.5 h-3.5 flex-shrink-0 text-[#6B6B78]" strokeWidth={1.5} />
                          <div className="min-w-0">
                            <p className="text-sm text-[#E8E8ED] truncate">{product.name}</p>
                            <p className="text-[11px] text-[#6B6B78]">{product.category}</p>
                          </div>
                        </div>
                        <ArrowUpRight className="w-3.5 h-3.5 flex-shrink-0 text-[#6B6B78] group-hover:text-[#0A84FF] transition-colors" strokeWidth={1.5} />
                      </button>
                    ))}
                  </div>
                )}

                {/* Empty state */}
                {showEmpty && (
                  <div data-testid="search-no-results" className="px-3.5 py-5 text-center">
                    <p className="text-sm text-[#6B6B78]">No products found</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Category dropdown */}
          <Select
            value={selectedCategory || "all"}
            onValueChange={(val) => {
              if (onCategorySelect) onCategorySelect(val === "all" ? "" : val);
            }}
          >
            <SelectTrigger
              data-testid="search-category-dropdown"
              className="w-48 bg-[#0E1117] border-[#1F2937] text-[#E8E8ED] text-sm h-[42px] rounded-md focus:ring-[#0A84FF]"
            >
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="bg-[#161B22] border-[#1F2937] text-[#E8E8ED]">
              <SelectItem value="all" className="focus:bg-[#1F2937] focus:text-[#E8E8ED]">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat} className="focus:bg-[#1F2937] focus:text-[#E8E8ED]">
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Search button */}
          <button
            data-testid="search-submit"
            onClick={() => executeSearch()}
            className="bg-[#0A84FF] text-white hover:bg-[#339DFF] px-5 py-2.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}

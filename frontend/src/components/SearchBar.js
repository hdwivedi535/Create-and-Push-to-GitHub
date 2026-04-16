import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function SearchBar({ onSearch, onCategorySelect, selectedCategory, searchQuery: externalQuery }) {
  const [query, setQuery] = useState(externalQuery || "");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API}/categories`);
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (externalQuery !== undefined) setQuery(externalQuery);
  }, [externalQuery]);

  const handleSearch = useCallback(() => {
    if (onSearch) {
      onSearch(query);
    } else {
      navigate(`/products?search=${encodeURIComponent(query)}`);
    }
  }, [query, onSearch, navigate]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const clearSearch = () => {
    setQuery("");
    if (onSearch) onSearch("");
  };

  return (
    <div
      data-testid="search-bar"
      className="w-full bg-[#131820] border-b border-[#1F2937]"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-3">
        <div className="flex items-center gap-3">
          {/* Search input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B78]" strokeWidth={1.5} />
            <input
              data-testid="search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search parts by name..."
              className="w-full bg-[#0E1117] border border-[#1F2937] text-[#E8E8ED] placeholder-[#6B6B78] pl-10 pr-10 py-2.5 text-sm rounded-md focus:outline-none focus:border-[#0A84FF] focus:ring-1 focus:ring-[#0A84FF] transition-all"
            />
            {query && (
              <button
                data-testid="search-clear"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B78] hover:text-[#E8E8ED] transition-colors"
              >
                <X className="w-4 h-4" strokeWidth={1.5} />
              </button>
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
            onClick={handleSearch}
            className="bg-[#0A84FF] text-white hover:bg-[#339DFF] px-5 py-2.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}

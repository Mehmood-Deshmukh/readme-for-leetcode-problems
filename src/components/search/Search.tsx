"use client";
import React, { useState, ChangeEvent } from "react";
import { Search, X } from "lucide-react";

interface SearchInputProps {
	placeholder?: string;
	onSearch?: (value: string) => void;
	className?: string;
}

const getMatch = async (query: string) => {
	try {
		const response = await fetch(`/api/getmatchresults?title=${query}`);
		const data = await response.json();
		return data.data;
	} catch (e) {
		console.error("Error:", e);
	}
};

const SearchInput: React.FC<SearchInputProps> = ({
	placeholder = "Search...",
	onSearch,
	className = "",
}) => {
	const [searchValue, setSearchValue] = useState("");
	const [searchResults, setSearchResults] = useState([]);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchValue(value);

		if(value.length < 3) {
			setSearchResults([]);
			return;
		}
		let match = getMatch(value);
		match.then((result) => {
			setSearchResults(result);
		});
		onSearch?.(value);
	};

	const clearSearch = () => {
		setSearchValue("");
		setSearchResults([]);
		onSearch?.("");
	};

	return (
		<div className={`relative ${className}`}>
			<div className="relative flex items-center">
				<Search
					className="absolute left-3 h-4 w-4 text-gray-400"
					aria-hidden="true"
				/>
				<input
					type="text"
					value={searchValue}
					onChange={handleChange}
					placeholder={placeholder}
					className="h-10 w-full rounded-md border border-gray-200 bg-white pl-10 pr-8 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
				/>
				{searchValue && (
					<button
						onClick={clearSearch}
						className="absolute right-2 p-1 text-gray-400 hover:text-gray-600"
						aria-label="Clear search"
					>
						<X className="h-4 w-4" />
					</button>
				)}
				{searchResults.length > 0 && (
					<div className="absolute top-10 w-full bg-white rounded-md border border-gray-200 shadow-lg text-black">
						{searchResults.map((result: any) => (
							<div
								key={result.stat.question_id}
								className="p-2 hover:bg-gray-100 cursor-pointer"
							>
								{result.stat.question__title}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default SearchInput;

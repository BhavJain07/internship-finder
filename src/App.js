import './index.css';
import React, { useState, useCallback, useMemo } from 'react';
import * as XLSX from 'xlsx';

const FileUpload = ({ onFileUpload }) => (
  <div className="mb-4">
    <input
      type="file"
      accept=".xlsx, .xls"
      onChange={onFileUpload}
      multiple
      className="block w-full text-sm text-gray-500
        file:mr-4 file:py-2 file:px-4
        file:rounded-full file:border-0
        file:text-sm file:font-semibold
        file:bg-blue-50 file:text-blue-700
        hover:file:bg-blue-100"
    />
  </div>
);

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => (
  <div className="mb-4">
    <select
      value={selectedCategory}
      onChange={(e) => onCategoryChange(e.target.value)}
      className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
    >
      <option value="">All Categories</option>
      {categories.map((category, index) => (
        <option key={index} value={category}>{category}</option>
      ))}
    </select>
  </div>
);

const SearchBar = ({ onSearch }) => (
  <div className="mb-4">
    <input
      type="text"
      placeholder="Search..."
      onChange={(e) => onSearch(e.target.value)}
      className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
    />
  </div>
);

const PageSizeSelector = ({ pageSize, onPageSizeChange }) => (
  <div className="mb-4">
    <select
      value={pageSize}
      onChange={(e) => onPageSizeChange(Number(e.target.value))}
      className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
    >
      <option value={50}>50 per page</option>
      <option value={100}>100 per page</option>
      <option value={250}>250 per page</option>
      <option value={500}>500 per page</option>
      <option value={1000}>1000 per page</option>
    </select>
  </div>
);

const DataTable = ({ data, onSort }) => {
  if (data.length === 0) return null;

  const headers = Object.keys(data[0]);

  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="px-6 py-3 cursor-pointer hover:bg-gray-100" onClick={() => onSort(header)}>
                {header}
                <span className="ml-1">↕️</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="bg-white border-b hover:bg-gray-50">
              {headers.map((header, cellIndex) => (
                <td key={cellIndex} className="px-6 py-4 whitespace-nowrap">
                  {row[header] || ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex justify-center items-center space-x-2 mt-4">
    {[...Array(totalPages).keys()].map(number => (
      <button
        key={number}
        onClick={() => onPageChange(number + 1)}
        className={`px-3 py-1 rounded ${currentPage === number + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        {number + 1}
      </button>
    ))}
  </div>
);

function App() {
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(250);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = useCallback((event) => {
    setIsLoading(true);
    setError(null);
    const files = Array.from(event.target.files);
    
    Promise.all(files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const workbook = XLSX.read(e.target.result, { type: 'array' });
            const allSheetData = workbook.SheetNames.flatMap(sheetName => {
              const worksheet = workbook.Sheets[sheetName];
              const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                header: 1,
                defval: '',
                blankrows: false
              });
              
              // Find the header row (first non-empty row)
              const headerRowIndex = jsonData.findIndex(row => row.some(cell => cell !== ''));
              if (headerRowIndex === -1) return [];

              const headers = jsonData[headerRowIndex].map(header => header.trim());
              
              return jsonData.slice(headerRowIndex + 1).map(row => {
                const item = {};
                headers.forEach((header, index) => {
                  if (row[index] !== undefined && row[index] !== '') {
                    item[header] = row[index];
                  }
                });
                return item;
              });
            });
            resolve(allSheetData);
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });
    }))
    .then(results => {
      const flattenedData = results.flat().filter(item => Object.keys(item).length > 0);
      if (flattenedData.length === 0) {
        setError("No valid data found in the uploaded file(s).");
      } else {
        setData(prevData => [...prevData, ...flattenedData]);
      }
      setIsLoading(false);
    })
    .catch(error => {
      setError(`Error processing file(s): ${error.message}`);
      console.error("File upload error:", error);
      setIsLoading(false);
    });
  }, []);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedData = useMemo(() => {
    let result = data;
    if (selectedCategory) {
      result = result.filter(item => item[selectedCategory] && item[selectedCategory] !== '');
    }
    if (searchTerm) {
      result = result.filter(item => 
        Object.values(item).some(value => 
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return result;
  }, [data, selectedCategory, searchTerm, sortConfig]);

  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(filteredAndSortedData.length / pageSize);

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(filteredAndSortedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Filtered Data");
    XLSX.writeFile(wb, "filtered_data.xlsx");
  };

  const categories = useMemo(() => {
    return Array.from(new Set(data.flatMap(Object.keys)));
  }, [data]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Internship Opportunity Analyzer</h1>
      
      <FileUpload onFileUpload={handleFileUpload} />
      
      {isLoading && <p className="text-blue-500">Loading data...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      <div className="flex space-x-4 mb-4">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        <SearchBar onSearch={setSearchTerm} />
        <PageSizeSelector
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
        />
        <button
          onClick={handleExport}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Export Data
        </button>
      </div>
      
      {paginatedData.length > 0 ? (
        <>
          <DataTable data={paginatedData} onSort={handleSort} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <p>No data to display. Please upload an XLSX file.</p>
      )}
    </div>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

const FilterInput = ({ placeholder, value, onChange, onClear }) => (
  <div className="relative">
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border rounded-md pr-8"
    />
    {value && (
      <button
        onClick={onClear}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        ×
      </button>
    )}
  </div>
);

const InternshipCard = ({ internship }) => (
  <div className="bg-white p-4 rounded-lg shadow-md mb-4 hover:shadow-lg transition-shadow duration-300">
    <h3 className="text-lg font-semibold text-blue-600">{internship.Name}</h3>
    <p className="text-sm text-gray-600 mb-2">{internship.Details}</p>
    <div className="grid grid-cols-2 gap-2 text-sm">
      <span><strong>State:</strong> {internship.State}</span>
      <span><strong>Price:</strong> {internship.Price}</span>
      <span><strong>Subject:</strong> {internship.Subject}</span>
      <span><strong>Grade Level:</strong> {internship.GradeLevel}</span>
    </div>
    <a 
      href={internship.URL} 
      target="_blank" 
      rel="noopener noreferrer"
      className="text-blue-500 hover:underline mt-2 inline-block"
    >
      Learn More
    </a>
  </div>
);

function App() {
  const [internships, setInternships] = useState([]);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    details: '',
    state: '',
    price: '',
    subject: '',
    gradeLevel: [9, 12],
  });

  useEffect(() => {
    const filtered = internships.filter(internship => 
      internship.Name.toLowerCase().includes(filters.name.toLowerCase()) &&
      internship.Details.toLowerCase().includes(filters.details.toLowerCase()) &&
      internship.State.toLowerCase().includes(filters.state.toLowerCase()) &&
      internship.Price.toLowerCase().includes(filters.price.toLowerCase()) &&
      internship.Subject.toLowerCase().includes(filters.subject.toLowerCase()) &&
      (internship.GradeLevel >= filters.gradeLevel[0] && internship.GradeLevel <= filters.gradeLevel[1])
    );
    setFilteredInternships(filtered);
  }, [internships, filters]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const processedData = jsonData.map(item => ({
        ...item,
        GradeLevel: parseInt(item.GradeLevel) || 9
      }));

      setInternships(processedData);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleFilterChange = (name, value) => {
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
  };

  const clearFilter = (name) => {
    setFilters(prevFilters => ({ ...prevFilters, [name]: '' }));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">XLSX Internship Finder</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <label htmlFor="file-upload" className="cursor-pointer flex items-center justify-center w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300">
          Upload XLSX File
        </label>
        <input 
          id="file-upload" 
          type="file" 
          accept=".xlsx, .xls" 
          onChange={handleFileUpload} 
          className="hidden"
        />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          Filters
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <FilterInput
            placeholder="Filter by Name"
            value={filters.name}
            onChange={(e) => handleFilterChange('name', e.target.value)}
            onClear={() => clearFilter('name')}
          />
          <FilterInput
            placeholder="Filter by Details"
            value={filters.details}
            onChange={(e) => handleFilterChange('details', e.target.value)}
            onClear={() => clearFilter('details')}
          />
          <FilterInput
            placeholder="Filter by State"
            value={filters.state}
            onChange={(e) => handleFilterChange('state', e.target.value)}
            onClear={() => clearFilter('state')}
          />
          <FilterInput
            placeholder="Filter by Price"
            value={filters.price}
            onChange={(e) => handleFilterChange('price', e.target.value)}
            onClear={() => clearFilter('price')}
          />
          <FilterInput
            placeholder="Filter by Subject"
            value={filters.subject}
            onChange={(e) => handleFilterChange('subject', e.target.value)}
            onClear={() => clearFilter('subject')}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Grade Level Range: {filters.gradeLevel[0]} - {filters.gradeLevel[1]}
          </label>
          <input
            type="range"
            min={9}
            max={12}
            step={1}
            value={filters.gradeLevel[1]}
            onChange={(e) => handleFilterChange('gradeLevel', [filters.gradeLevel[0], parseInt(e.target.value)])}
            className="w-full"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInternships.map((internship, index) => (
          <InternshipCard key={index} internship={internship} />
        ))}
      </div>
    </div>
  );
}

export default App;
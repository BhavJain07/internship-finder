import './index.css';
import Anthropic from '@anthropic-ai/sdk';
const anthropic = new Anthropic({
  apiKey: process.env.REACT_APP_ANTHROPIC_API_KEY,
});
//insert API key above.

//OLD CODE BELOW

/* import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import * as XLSX from 'xlsx';

const Input = ({ type, placeholder, value, onChange }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="w-full px-3 py-2 border rounded-md"
  />
);

const Slider = ({ min, max, value, onChange, label }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700">{label}: {value}</label>
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={onChange}
      className="w-full"
    />
  </div>
);

const Card = ({ title, details, state, price, subject, url }) => (
  <div className="border rounded-md p-4 mb-4 bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
    <h3 className="text-lg font-semibold text-blue-600">{title}</h3>
    <p className="text-sm text-gray-600">{details}</p>
    <div className="mt-2 grid grid-cols-2 gap-2">
      <span className="text-sm"><strong>State:</strong> {state}</span>
      <span className="text-sm"><strong>Price:</strong> {price}</span>
      <span className="text-sm"><strong>Subject:</strong> {subject}</span>
      <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">Learn More</a>
    </div>
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
    url: '',
    gradeLevel: 9,
  });

  useEffect(() => {
    const filtered = internships.filter(internship => 
      internship.Name.toLowerCase().includes(filters.name.toLowerCase()) &&
      internship.Details.toLowerCase().includes(filters.details.toLowerCase()) &&
      internship.State.toLowerCase().includes(filters.state.toLowerCase()) &&
      internship.Price.toLowerCase().includes(filters.price.toLowerCase()) &&
      internship.Subject.toLowerCase().includes(filters.subject.toLowerCase()) &&
      internship.URL.toLowerCase().includes(filters.url.toLowerCase())
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

      setInternships(jsonData);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleFilterChange = (name, value) => {
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
  };

  return (
    <div className="p-4 max-w-4xl mx-auto bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">XLSX Internship Finder</h1>
      
      <div className="mb-6">
        <label htmlFor="file-upload" className="cursor-pointer flex items-center justify-center w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300">
          <Upload className="mr-2" size={20} />
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
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="text"
            placeholder="Filter by Name"
            value={filters.name}
            onChange={(e) => handleFilterChange('name', e.target.value)}
          />
          <Input
            type="text"
            placeholder="Filter by Details"
            value={filters.details}
            onChange={(e) => handleFilterChange('details', e.target.value)}
          />
          <Input
            type="text"
            placeholder="Filter by State"
            value={filters.state}
            onChange={(e) => handleFilterChange('state', e.target.value)}
          />
          <Input
            type="text"
            placeholder="Filter by Price"
            value={filters.price}
            onChange={(e) => handleFilterChange('price', e.target.value)}
          />
          <Input
            type="text"
            placeholder="Filter by Subject"
            value={filters.subject}
            onChange={(e) => handleFilterChange('subject', e.target.value)}
          />
          <Input
            type="text"
            placeholder="Filter by URL"
            value={filters.url}
            onChange={(e) => handleFilterChange('url', e.target.value)}
          />
        </div>
        <Slider 
          min={9} 
          max={12} 
          value={filters.gradeLevel} 
          onChange={(e) => handleFilterChange('gradeLevel', parseInt(e.target.value))}
          label="Maximum Grade Level"
        />
      </div>
      
      <div>
        {filteredInternships.map((internship, index) => (
          <Card
            key={index}
            title={internship.Name}
            details={internship.Details}
            state={internship.State}
            price={internship.Price}
            subject={internship.Subject}
            url={internship.URL}
          />
        ))}
      </div>
    </div>
  );
}

export default App;

*/
//DO NOT UNCOMMENT ^^ CODE



// Basic cat function
const categorizeData = (item) => {
  const lowercaseKeys = Object.keys(item).map(key => key.toLowerCase());
  
  const getCategory = (keywords) => {
    return lowercaseKeys.find(key => keywords.some(keyword => key.includes(keyword)));
  };

  const gradeLevel = getCategory(['grade', 'class', 'year']) || 'Grade Level';
  const cost = getCategory(['cost', 'price', 'fee']) || 'Cost';
  const deadline = getCategory(['deadline', 'due date', 'application close']) || 'Application Deadline';
  const eligibility = getCategory(['eligibility', 'requirements', 'qualifications']) || 'Eligibility Requirements';

  return {
    'Grade Level': item[gradeLevel] || 'N/A',
    'Cost': item[cost] || 'N/A',
    'Application Deadline': item[deadline] || 'N/A',
    'Eligibility Requirements': item[eligibility] || 'N/A',
    ...item
  };
};

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

const DataTable = ({ data }) => {
  const categories = ['Grade Level', 'Cost', 'Application Deadline', 'Eligibility Requirements'];
  const otherColumns = Object.keys(data[0] || {}).filter(key => !categories.includes(key));

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            {categories.concat(otherColumns).map((key, index) => (
              <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {categories.concat(otherColumns).map((key, cellIndex) => (
                <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {row[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

function App() {
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const categories = ['Grade Level', 'Cost', 'Application Deadline', 'Eligibility Requirements'];

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const workbook = XLSX.read(e.target.result, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        const categorizedData = jsonData.map(categorizeData);
        setData(prevData => [...prevData, ...categorizedData]);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const filteredData = selectedCategory
    ? data.filter(item => item[selectedCategory] !== 'N/A')
    : data;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Internship Opportunity Analyzer</h1>
      
      <FileUpload onFileUpload={handleFileUpload} />
      
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      
      {filteredData.length > 0 ? (
        <DataTable data={filteredData} />
      ) : (
        <p>No data to display. Please upload an XLSX file.</p>
      )}
    </div>
  );
}

export default App;




/*

CLAUDE BASED AI CATEGORIZATION FUNCTION

const categorizeData = async (item) => {
  const prompt = `
Human: Categorize the following data into Grade Level, Cost, Application Deadline, and Eligibility Requirements. If a category is not applicable, use "N/A". Return only the JSON object with the categorized information.

Data:
${JSON.stringify(item)}

Assistant: Here's the categorized data:

{
  "Grade Level": "N/A",
  "Cost": "N/A",
  "Application Deadline": "N/A",
  "Eligibility Requirements": "N/A"
}

CLAUDE BASED AI HANDLEFILEUPLOAD FUNCTION

const handleFileUpload = async (event) => {
  setIsLoading(true);
  setError(null);
  try {
    const files = Array.from(event.target.files);
    
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      const categorizedData = await Promise.all(jsonData.map(categorizeData));
      setData(prevData => [...prevData, ...categorizedData]);
    }
  } catch (error) {
    setError("Error processing file. Please try again.");
    console.error("File upload error:", error);
  } finally {
    setIsLoading(false);
  }
};

*/
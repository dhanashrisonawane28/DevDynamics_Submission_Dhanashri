import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Devloperlist.css'; // Make sure the path to your CSS file is correct

interface Developer {
  name: string;
}

const DeveloperList: React.FC = () => {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const dataUrl = 'https://dhanashrisonawane28.github.io/DevDynamic_Assignment_Dhanashri/sample-data.json';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(dataUrl);
        const data = await response.json();
        setDevelopers(data.data.AuthorWorklog.rows);
      } catch (error) {
        console.error('Error fetching the data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredDevelopers = developers.filter(developer =>
    developer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="developer-detail">
      <div className="navbar1">
        <h1>Developer Activity Dashboard</h1>
      </div>
      <main>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by developer name"
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
        <table className="active-days-table1">
          <thead>
            <tr>
              <th>Developer</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredDevelopers.map((developer, index) => (
              <tr key={index}>
                <td>{developer.name}</td>
                <td>
                  <Link to={`/developer/${index}`}>
                    <button className="view-all-button">View Activity</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
      <footer className='footer'>
        <p>&copy; 2024 Developer Activity Dashboard. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default DeveloperList;

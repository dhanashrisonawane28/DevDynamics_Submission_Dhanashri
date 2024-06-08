import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import './DeveloperDetail.css';

interface RouteParams {
  [key: string]: string | undefined;
}

interface Developer {
  name: string;
  activeDays: {
    days: number;
    insight: string[];
  };
  dayWiseActivity: {
    date: string;
    items: {
      children: { label: string; count: string }[];
    };
  }[];
  totalActivity: {
    name: string;
    value: string;
  }[];
}

interface ActivityMeta {
  label: string;
  fillColor: string;
}

const DeveloperDetail: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [activityMeta, setActivityMeta] = useState<ActivityMeta[]>([]);
  const [showAllData, setShowAllData] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [displayedData, setDisplayedData] = useState<any[]>([]);
  const dataUrl =
    'https://dhanashrisonawane28.github.io/DevDynamic_Assignment_Dhanashri/sample-data.json';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(dataUrl);
        const data = await response.json();
        setDeveloper(data.data.AuthorWorklog.rows[id ? parseInt(id) : 0]);
        setActivityMeta(data.data.AuthorWorklog.activityMeta);
      } catch (error) {
        console.error('Error fetching the data:', error);
      }
    };

    fetchData();
  }, [id]);

  if (!developer) {
    return <div>Loading...</div>;
  }

  const activityData = developer.dayWiseActivity.map((day) => ({
    date: day.date,
    ...day.items.children.reduce(
      (acc, item) => ({ ...acc, [item.label]: parseInt(item.count) }),
      {}
    ),
  }));

  const totalActivityData = developer.totalActivity.map((activity) => ({
    name: activity.name,
    value: parseInt(activity.value),
    fillColor:
      activityMeta.find((meta) => meta.label === activity.name)?.fillColor ||
      '#000',
  }));

  const filteredActivityData = activityData.filter((day) =>
    Object.values(day)
      .slice(1)
      .some((value) => value != '0')
  );

  const noActivityDays = activityData.filter(
    (day) =>
      !Object.values(day)
        .slice(1)
        .some((value) => value != '0')
  );

  const handleShowAllData = () => {
    setShowAllData(true);
    setSelectedDate('');
    setFilteredData([]);
    setDisplayedData(filteredActivityData);
  };

  const handleFilterByDate = () => {
    if (selectedDate) {
      const filtered = filteredActivityData.filter(
        (item) => item.date === selectedDate
      );
      setFilteredData(filtered);
      setDisplayedData(filtered);
      setShowAllData(false);
    }
  };

  const activityAverages = developer.totalActivity.map((activity) => {
    const totalValue = parseInt(activity.value);
    const avgValue = (totalValue / developer.activeDays.days).toFixed(2);
    return {
      name: activity.name,
      avgValue,
    };
  });

  return (
    <div className="developer-detail">
      <header className="navbar">
        <h1>Developer Activity Tracker</h1>
      </header>
      <main>
        <table className="active-days-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Active Days</th>
              <th>Insight</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{developer.name}</td>
              <td>{developer.activeDays.days}</td>
              <td>{developer.activeDays.insight.join(', ') || 'No insights available'}</td>
            </tr>
          </tbody>
        </table>

        <div className="total-activity-container">
          <div className="total-activity-table-container">
            <table className="total-activity-table">
              <thead>
                <tr>
                  <th>Activity</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                {developer.totalActivity.map((activity, index) => (
                  <tr
                    key={index}
                    style={{
                      backgroundColor: `${activityMeta.find(
                        (meta) => meta.label === activity.name
                      )?.fillColor}20`,
                    }}
                  >
                    <td>{activity.name}</td>
                    <td>{activity.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="total-activity-pie-chart-container">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={totalActivityData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  fill="#8884d8"
                  label
                >
                  {totalActivityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fillColor} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="activity-buttons">
            <h2>Graph Visualization of Data</h2> 
            <br /> {/* Line break */}
  <button className="view-all-button" onClick={handleShowAllData}>
    View All Activity Data
  </button>
  <div className="filter-by-date">
    <select
      value={selectedDate}
      onChange={(e) => setSelectedDate(e.target.value)}
    >
      <option value="">Select Date</option>
      {filteredActivityData.map((item, index) => (
        <option key={index} value={item.date}>
          {item.date}
        </option>
      ))}
    </select>
    <button className="submit-button" onClick={handleFilterByDate}>
      Submit
    </button>
  </div>
</div>


        <div className='activity-buttons'>{/* Render the appropriate BarChart based on showAllData and selectedDate states */}
        {displayedData.length > 0 && (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={displayedData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {activityMeta.map((meta, index) => (
                <Bar
                  key={index}
                  dataKey={meta.label}
                  stackId={!showAllData && selectedDate ? `stack-${displayedData[0].date}` : undefined}
                  fill={meta.fillColor}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )}

        {showAllData && noActivityDays.length > 0 && (
          <table className="no-activity-days-table">
            <thead>
              <tr>
                <th>No Activity Dates</th>
              </tr>
            </thead>
            <tbody>
              {noActivityDays.map((day, index) => (
                <tr key={index}>
                  <td>{day.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
</div>
        
        <div className="average-activity-table-container">
          <table className="average-activity-table">
            <thead>
              <tr>
                <th>Activity</th>
                <th>Average Per Active Day</th>
              </tr>
            </thead>
            <tbody>
              {activityAverages.map((activity, index) => (
                <tr key={index}>
                  <td>{activity.name}</td>
                  <td>{activity.avgValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <footer>
        <p>&copy; 2024 Developer Activity Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default DeveloperDetail;

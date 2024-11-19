import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Label } from 'recharts';
import { Card, CardContent, Typography, Grid } from '@mui/material';

// Dummy data for the line chart
const data = [
  { name: 'Jan', users: 400, sales: 2400 },
  { name: 'Feb', users: 300, sales: 2210 },
  { name: 'Mar', users: 500, sales: 2290 },
  { name: 'Apr', users: 278, sales: 2000 },
  { name: 'May', users: 189, sales: 2181 },
  { name: 'Jun', users: 239, sales: 2500 },
];

// Dummy data for the pie chart
const pieData = [
  { name: 'Dons', value: 400 },
  { name: 'Parrainages', value: 300 },
  { name: 'Éducation', value: 300 },
  { name: 'Santé', value: 200 },
];

// Colors for the pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const recentActivities = [
  { activity: 'Nouveau parrain inscrit', date: '2024-09-27' },
  { activity: 'Dons reçus', date: '2024-09-26' },
  { activity: 'Enfant ajouté', date: '2024-09-25' },
];

const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>

      {/* Grid to display cards with stats */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Parrain</Typography>
              <Typography variant="h4">024</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Enfants</Typography>
              <Typography variant="h4">560</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Dons</Typography>
              <Typography variant="h4">23</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Sommes actuels</Typography>
              <Typography variant="h4">$125000</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Grid for Chart and Recent Activities */}
      <Grid container spacing={3} style={{ marginTop: '40px' }}>
        {/* Line Chart */}
        <Grid item xs={12} md={6}>
          <div style={{ height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="sales" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Grid>

        {/* Pie Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Répartition des Dons</Typography>
              <div style={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                      <Label value="Dons" position="center" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">Récentes Activités</Typography>
              <ul>
                {recentActivities.map((activity, index) => (
                  <li key={index}>
                    <Typography variant="body2">{activity.activity} - <i>{activity.date}</i></Typography>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default Dashboard;

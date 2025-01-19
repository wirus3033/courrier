import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";
import { MailOutline, Outbox, Business, People } from "@mui/icons-material"; // Import des icônes

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const styles = {
  dashboard: {
    padding: "20px",
    backgroundColor: "#f5f5f5",
    minHeight: "100vh",
  },
  title: {
    marginBottom: "30px",
    color: "#1976d2",
    fontWeight: "bold",
  },
  card: {
    transition: "transform 0.3s",
    display: "flex",
    alignItems: "center",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    },
  },
  icon: {
    fontSize: "50px",
    marginRight: "20px",
  },
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    courrierEntrant: 0,
    courrierSortant: 0,
    directions: 0,
    utilisateurs: 0,
  });
  const [monthlyStats, setMonthlyStats] = useState([]);

  const pieData = [
    { name: "Courriers Entrants", value: stats.courrierEntrant },
    { name: "Courriers Sortants", value: stats.courrierSortant },
    { name: "Directions", value: stats.direction },
    { name: "Utilisateurs", value: stats.utilisateurs },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const fetchCounts = async () => {
          try {
            const entrantRes = await fetch(
              "http://localhost:4000/api/entrant/count",
              { method: "GET" }
            );
            const sortantRes = await fetch(
              "http://localhost:4000/api/sortant/count",
              { method: "GET" }
            );
            const directionRes = await fetch(
              "http://localhost:4000/api/directions/count/total",
              { method: "GET" }
            );
            const usersRes = await fetch(
              "http://localhost:4000/api/users/count/total",
              { method: "GET" }
            );

            // Extraire les données JSON de chaque réponse
            const entrant = await entrantRes.json();
            const sortant = await sortantRes.json();
            const direction = await directionRes.json();
            const users = await usersRes.json();
            console.log(entrant, sortant, direction, users);

            setStats({
              courrierEntrant: entrant.count,
              courrierSortant: sortant.count,
              direction: direction.total,
              utilisateurs: users.total,
            });
          } catch (error) {
            console.error(
              "Erreur lors de la récupération des données :",
              error
            );
          }
        };

        // Appeler la fonction
        fetchCounts();

        // Fetch monthly stats
        const monthlyResponse = await fetch(
          "http://localhost:4000/api/mounth/monthly"
        );
        const monthlyData = await monthlyResponse.json();
        setMonthlyStats(monthlyData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <div style={styles.dashboard}>
      <Typography variant="h4" style={styles.title}>
        Tableau de Bord
      </Typography>

      {/* Cartes avec icônes */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ ...styles.card, backgroundColor: "#0088FE" }}>
            <CardContent>
              <div style={{ display: "flex", alignItems: "center" }}>
                <MailOutline style={{ ...styles.icon, color: "#fff" }} />
                <div>
                  <Typography variant="h6" style={{ color: "#fff" }}>
                    Courriers Entrants
                  </Typography>
                  <Typography variant="h4" style={{ color: "#fff" }}>
                    {stats.courrierEntrant}
                  </Typography>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ ...styles.card, backgroundColor: "#00C49F" }}>
            <CardContent>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Outbox style={{ ...styles.icon, color: "#fff" }} />
                <div>
                  <Typography variant="h6" style={{ color: "#fff" }}>
                    Courriers Sortants
                  </Typography>
                  <Typography variant="h4" style={{ color: "#fff" }}>
                    {stats.courrierSortant}
                  </Typography>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ ...styles.card, backgroundColor: "#FFBB28" }}>
            <CardContent>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Business style={{ ...styles.icon, color: "#fff" }} />
                <div>
                  <Typography variant="h6" style={{ color: "#fff" }}>
                    Directions
                  </Typography>
                  <Typography variant="h4" style={{ color: "#fff" }}>
                    {stats.direction}
                  </Typography>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ ...styles.card, backgroundColor: "#FF8042" }}>
            <CardContent>
              <div style={{ display: "flex", alignItems: "center" }}>
                <People style={{ ...styles.icon, color: "#fff" }} />
                <div>
                  <Typography variant="h6" style={{ color: "#fff" }}>
                    Utilisateurs
                  </Typography>
                  <Typography variant="h4" style={{ color: "#fff" }}>
                    {stats.utilisateurs}
                  </Typography>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Graphiques */}
      <Grid container spacing={3} style={{ marginTop: "40px" }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Statistiques Mensuelles</Typography>
              <div style={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="entrants"
                      stroke="#8884d8"
                      name="Courriers Entrants"
                    />
                    <Line
                      type="monotone"
                      dataKey="sortants"
                      stroke="#82ca9d"
                      name="Courriers Sortants"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Répartition Globale</Typography>
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
                      label
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;

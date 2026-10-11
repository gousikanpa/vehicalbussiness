
import React, { useEffect, useState } from "react";
import Api from "../Service/Api";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";
import "./Dashboard.css";

const COLORS = ["#4f46e5", "#f97316"];

function Dashboard() {
    const [data, setData] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        Api.get("/dashboard")
            .then((response) => setData(response.data))
            .catch((err) => {
                console.error("Dashboard error:", err);
                setError("Unable to load dashboard data.");
            });
    }, []);

    if (!data && !error) {
        return <div className="dashboard-loading">Loading dashboard...</div>;
    }

    if (error) {
        return <div className="dashboard-loading">{error}</div>;
    }

    const income = Number(data.totalIncome) || 0;
    const expense = Number(data.totalExpense) || 0;
    const profit = Number(data.totalProfit) || 0;

    const formatMoney = (value) =>
        `₹${value.toLocaleString("en-IN")}`;

    const cards = [
        {
            title: "Total Income",
            value: formatMoney(income),
            icon: "↗",
            theme: "purple",
            description: "Overall earnings",
        },
        {
            title: "Total Expense",
            value: formatMoney(expense),
            icon: "↘",
            theme: "orange",
            description: "Overall spending",
        },
        {
            title: "Total Profit",
            value: formatMoney(profit),
            icon: "₹",
            theme: "green",
            description: "Net business profit",
        },
        {
            title: "Total Vehicles",
            value: data.totalVehicles ?? 0,
            icon: "🚚",
            theme: "blue",
            description: "Registered vehicles",
        },
        {
            title: "Maintenance",
            value: data.totalMaintenance ?? 0,
            icon: "🔧",
            theme: "pink",
            description: "Maintenance records",
        },
    ];

    const pieData = [
        { name: "Income", value: income },
        { name: "Expense", value: expense },
    ];

    const barData = [
        { name: "Income", amount: income },
        { name: "Expense", amount: expense },
        { name: "Profit", amount: profit },
    ];

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div>
                    <span className="dashboard-eyebrow">
                        BUSINESS OVERVIEW
                    </span>
                    <h1>Dashboard</h1>
                    <p>Welcome back! Here's your business summary.</p>
                </div>

                <div className="dashboard-live">
                    <span className="live-dot"></span>
                    Live data
                </div>
            </div>

            <div className="dashboard-cards">
                {cards.map((card) => (
                    <div className="dashboard-card" key={card.title}>
                        <div className="card-top">
                            <span className="card-title">
                                {card.title}
                            </span>
                            <span className={`card-icon ${card.theme}`}>
                                {card.icon}
                            </span>
                        </div>

                        <h2>{card.value}</h2>
                        <p>{card.description}</p>
                    </div>
                ))}
            </div>

            <div className="dashboard-section-heading">
                <div>
                    <h2>Financial Analytics</h2>
                    <p>Understand your income and expenses at a glance.</p>
                </div>
            </div>

            <div className="dashboard-charts">
                <section className="chart-card">
                    <div className="chart-heading">
                        <div>
                            <h3>Income vs Expense</h3>
                            <p>Financial distribution</p>
                        </div>
                    </div>

                    {income === 0 && expense === 0 ? (
                        <div className="chart-empty">
                            No financial data available yet.
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="45%"
                                    innerRadius={65}
                                    outerRadius={95}
                                    paddingAngle={5}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell
                                            key={entry.name}
                                            fill={COLORS[index]}
                                        />
                                    ))}
                                </Pie>

                                <Tooltip
                                    formatter={(value) => formatMoney(value)}
                                />
                                <Legend verticalAlign="bottom" />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </section>

                <section className="chart-card">
                    <div className="chart-heading">
                        <div>
                            <h3>Financial Overview</h3>
                            <p>Income, expense and profit comparison</p>
                        </div>
                    </div>

                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart
                            data={barData}
                            margin={{
                                top: 15,
                                right: 10,
                                left: 5,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(value) =>
                                    value >= 1000
                                        ? `₹${value / 1000}k`
                                        : `₹${value}`
                                }
                            />
                            <Tooltip
                                formatter={(value) => formatMoney(value)}
                            />
                            <Bar
                                dataKey="amount"
                                name="Amount"
                                fill="#4f46e5"
                                radius={[7, 7, 0, 0]}
                                maxBarSize={55}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </section>
            </div>

            <div className="dashboard-footer">
                <span>Vehicle Business Management</span>
                <span>Financial summary from your backend</span>
            </div>
        </div>
    );
}

export default Dashboard;


import { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import Api from "../Service/Api";
import "./Reports.css";

function getToday() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function Reports() {
  const [date, setDate] = useState(getToday());
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchReport = async (selectedDate = date) => {
    if (!selectedDate) {
      setError("Please select a date.");
      return;
    }

    setLoading(true);
    setError("");
    setReport(null);

    try {
      const response = await Api.get("/report", {
        params: { date: selectedDate },
      });

      setReport(response.data);
    } catch (err) {
      console.error("Report error:", err.response?.data || err.message);
      setError(
        err.response?.data?.message ||
          "Unable to load report. Check the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  const money = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;

  const chartData = report
    ? [
        {
          name: "Financial Summary",
          Income: Number(report.totalIncome || 0),
          Expense: Number(report.totalExpense || 0),
          Profit: Number(report.profit || 0),
        },
      ]
    : [];

  return (
    <div className="reports-page">
      <header className="reports-header">
        <div>
          <h1>Business Reports</h1>
          <p>Review your daily income, expenses and profit.</p>
        </div>
      </header>

      <section className="reports-filter">
        <div className="reports-date-field">
          <label htmlFor="report-date">Select Report Date</label>
          <input
            id="report-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <button
          className="reports-generate-btn"
          onClick={() => fetchReport()}
          disabled={loading}
        >
          {loading ? "Loading..." : "Generate Report"}
        </button>
      </section>

      {error && <p className="reports-error">{error}</p>}

      {!report && !loading && !error && (
        <div className="reports-empty">
          <h3>Ready to generate your report</h3>
          <p>Select a date and click Generate Report.</p>
        </div>
      )}

      {loading && <p className="reports-loading">Loading report...</p>}

      {report && !loading && (
        <>
          <div className="reports-selected-date">
            Report for <strong>{report.date}</strong>
          </div>

          <section className="reports-cards">
            <article className="report-card income-card">
              <div className="report-card-icon">↗</div>
              <p>Total Income</p>
              <h2>{money(report.totalIncome)}</h2>
            </article>

            <article className="report-card expense-card">
              <div className="report-card-icon">↘</div>
              <p>Total Expense</p>
              <h2>{money(report.totalExpense)}</h2>
            </article>

            <article className="report-card profit-card">
              <div className="report-card-icon">₹</div>
              <p>Net Profit</p>
              <h2>{money(report.profit)}</h2>
            </article>
          </section>

          <section className="reports-chart-card">
            <h2>Income vs Expense vs Profit</h2>
            <p>Financial summary for the selected date.</p>

            <div className="reports-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => money(value)} />
                  <Legend />
                  <Bar dataKey="Income" fill="#16a34a" radius={[5, 5, 0, 0]} />
                  <Bar dataKey="Expense" fill="#dc2626" radius={[5, 5, 0, 0]} />
                  <Bar dataKey="Profit" fill="#4f46e5" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="reports-details-card">
            <h2>Report Details</h2>
            <div className="report-detail-row">
              <span>Report Date</span>
              <strong>{report.date}</strong>
            </div>
            <div className="report-detail-row">
              <span>Total Income</span>
              <strong>{money(report.totalIncome)}</strong>
            </div>
            <div className="report-detail-row">
              <span>Total Expense</span>
              <strong>{money(report.totalExpense)}</strong>
            </div>
            <div className="report-detail-row">
              <span>Net Profit / Loss</span>
              <strong className={Number(report.profit) < 0 ? "loss-value" : "profit-value"}>
                {money(report.profit)}
              </strong>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default Reports;

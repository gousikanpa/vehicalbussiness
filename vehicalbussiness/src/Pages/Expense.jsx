import "./Expense.css";
import { useEffect, useState } from "react";
import Api from "../Service/Api";
import "./Expense.css";

function Expense() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    vehicleId: "",
    date: "",
    amount: "",
    category: "",
    description: "",
    location: "",
  });

  const loadExpenses = async () => {
    try {
      const response = await Api.get("/shw");
      setExpenses(response.data);
      setError("");
    } catch (err) {
      if (err.response?.status === 404) {
        setExpenses([]);
        setError("");
      } else {
        setError("Unable to load expenses. Check your backend.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,
        amount: Number(form.amount),
      };

      await Api.post("/expanse", payload);

      alert("Expense added successfully!");

      setForm({
        vehicleId: "",
        date: "",
        amount: "",
        category: "",
        description: "",
        location: "",
      });

      await loadExpenses();
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Failed to add expense. Check the backend."
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) {
      return;
    }

    try {
      await Api.delete("/delete", { params: { id } });
      setExpenses((previous) =>
        previous.filter((expense) => expense.id !== id)
      );
    } catch {
      alert("Failed to delete expense.");
    }
  };

  const totalExpense = expenses.reduce(
    (total, expense) => total + Number(expense.amount || 0),
    0
  );

  return (
    <div className="expense-page">
      <div className="expense-header">
        <div>
          <h1>Expense Management</h1>
          <p>Track and manage your vehicle business expenses.</p>
        </div>
        <div className="expense-total">
          <span>Total Expenses</span>
          <h2>₹{totalExpense.toLocaleString("en-IN")}</h2>
        </div>
      </div>

      <section className="expense-form-card">
        <h2>Add New Expense</h2>

        <form className="expense-form" onSubmit={handleSubmit}>
          <div className="expense-field">
            <label>Vehicle ID</label>
            <input
              name="vehicleId"
              value={form.vehicleId}
              onChange={handleChange}
              placeholder="Enter vehicle ID"
              required
            />
          </div>

          <div className="expense-field">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="expense-field">
            <label>Amount (₹)</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              min="0.01"
              step="0.01"
              required
            />
          </div>

          <div className="expense-field">
            <label>Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              <option value="Fuel">Fuel</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Salary">Salary</option>
              <option value="Insurance">Insurance</option>
              <option value="Repair">Repair</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="expense-field">
            <label>Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Enter location"
              required
            />
          </div>

          <div className="expense-field">
            <label>Description</label>
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Optional description"
            />
          </div>

          <button className="expense-submit" type="submit">
            + Add Expense
          </button>
        </form>
      </section>

      <section className="expense-list-card">
        <div className="expense-list-header">
          <h2>Recent Expenses</h2>
          <span>{expenses.length} Records</span>
        </div>

        {loading ? (
          <p className="expense-message">Loading expenses...</p>
        ) : error ? (
          <p className="expense-error">{error}</p>
        ) : expenses.length === 0 ? (
          <p className="expense-message">No expenses found. Add your first expense.</p>
        ) : (
          <div className="expense-table-wrapper">
            <table className="expense-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Vehicle ID</th>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>{expense.id}</td>
                    <td>{expense.vehicleId}</td>
                    <td>{expense.date}</td>
                    <td>
                      <span className="expense-category">
                        {expense.category}
                      </span>
                    </td>
                    <td>{expense.location}</td>
                    <td className="expense-amount">
                      ₹{Number(expense.amount).toLocaleString("en-IN")}
                    </td>
                    <td>{expense.description || "—"}</td>
                    <td>
                      <button
                        className="expense-delete-btn"
                        onClick={() => handleDelete(expense.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default Expense;

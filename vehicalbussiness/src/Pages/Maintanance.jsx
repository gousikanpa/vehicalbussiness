
import { useEffect, useState } from "react";
import Api from "../Service/Api";
import "./Maintanance.css";

function Maintanance() {
  const emptyForm = {
    vehicleId: "",
    date: "",
    type: "",
    amount: "",
    description: "",
  };

  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRecords = async () => {
    try {
      const response = await Api.get("/getvalue");
      setRecords(Array.isArray(response.data) ? response.data : []);
      setError("");
    } catch (err) {
      if (err.response?.status === 404) {
        setRecords([]);
        setError("");
      } else {
        setError("Unable to load maintenance records.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
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

      if (editingId !== null) {
        await Api.put(`/update/${editingId}`, payload);
        alert("Maintenance updated successfully!");
      } else {
        await Api.post("/post", payload);
        alert("Maintenance added successfully!");
      }

      setForm(emptyForm);
      setEditingId(null);
      await loadRecords();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to save maintenance. Check your backend."
      );
    }
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    setForm({
      vehicleId: record.vehicleId ?? "",
      date: record.date ?? "",
      type: record.type ?? "",
      amount: String(record.amount ?? ""),
      description: record.description ?? "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Do you want to delete this maintenance record?")) {
      return;
    }

    try {
      await Api.delete(`/del/${id}`);
      setRecords((previous) =>
        previous.filter((record) => record.id !== id)
      );
    } catch {
      alert("Failed to delete maintenance record.");
    }
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const totalCost = records.reduce(
    (total, record) => total + Number(record.amount || 0),
    0
  );

  return (
    <div className="maintenance-page">
      <header className="maintenance-header">
        <div>
          <h1>Maintenance Management</h1>
          <p>Track vehicle servicing, repairs and maintenance costs.</p>
        </div>

        <div className="maintenance-summary">
          <span>Total Maintenance Cost</span>
          <h2>₹{totalCost.toLocaleString("en-IN")}</h2>
          <small>{records.length} maintenance records</small>
        </div>
      </header>

      <section className="maintenance-form-card">
        <h2>{editingId !== null ? "Edit Maintenance" : "Add Maintenance"}</h2>

        <form className="maintenance-form" onSubmit={handleSubmit}>
          <div className="maintenance-field">
            <label>Vehicle ID</label>
            <input
              name="vehicleId"
              value={form.vehicleId}
              onChange={handleChange}
              placeholder="Enter vehicle ID"
              required
            />
          </div>

          <div className="maintenance-field">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="maintenance-field">
            <label>Maintenance Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              required
            >
              <option value="">Select type</option>
              <option value="Oil Change">Oil Change</option>
              <option value="General Service">General Service</option>
              <option value="Engine Repair">Engine Repair</option>
              <option value="Tyre Replacement">Tyre Replacement</option>
              <option value="Brake Repair">Brake Repair</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="maintenance-field">
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

          <div className="maintenance-field maintenance-description">
            <label>Description</label>
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter additional details (optional)"
            />
          </div>

          <div className="maintenance-actions">
            <button type="submit" className="maintenance-submit">
              {editingId !== null ? "Update Maintenance" : "+ Add Maintenance"}
            </button>

            {editingId !== null && (
              <button
                type="button"
                className="maintenance-cancel"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="maintenance-list-card">
        <div className="maintenance-list-header">
          <h2>Maintenance History</h2>
          <span>{records.length} Records</span>
        </div>

        {loading ? (
          <p className="maintenance-message">Loading records...</p>
        ) : error ? (
          <p className="maintenance-error">{error}</p>
        ) : records.length === 0 ? (
          <p className="maintenance-message">
            No maintenance records found. Add your first record.
          </p>
        ) : (
          <div className="maintenance-table-wrapper">
            <table className="maintenance-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Vehicle ID</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {records.map((record) => (
                  <tr key={record.id}>
                    <td>{record.id}</td>
                    <td>{record.vehicleId}</td>
                    <td>{record.date}</td>
                    <td>
                      <span className="maintenance-type">
                        {record.type}
                      </span>
                    </td>
                    <td className="maintenance-amount">
                      ₹{Number(record.amount).toLocaleString("en-IN")}
                    </td>
                    <td>{record.description || "—"}</td>
                    <td>
                      <div className="maintenance-row-actions">
                        <button
                          className="maintenance-edit"
                          onClick={() => handleEdit(record)}
                        >
                          Edit
                        </button>
                        <button
                          className="maintenance-delete"
                          onClick={() => handleDelete(record.id)}
                        >
                          Delete
                        </button>
                      </div>
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

export default Maintanance;

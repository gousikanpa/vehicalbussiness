
import React, { useEffect, useState } from "react";
import Api from "../Service/Api";
import "./Income.css";

function Income() {
    const [incomes, setIncomes] = useState([]);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        vehicleId: "",
        date: "",
        amount: "",
        source: "",
        location: "",
    });

    useEffect(() => {
        fetchIncomes();
    }, []);

    // Fetch all income records
    const fetchIncomes = async () => {
        try {
            const response = await Api.get("/alldata");

            setIncomes(
                Array.isArray(response.data) ? response.data : []
            );
        } catch (error) {
            console.error("Error fetching income:", error);
            setIncomes([]);
        }
    };

    // Handle form changes
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // Add income
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...form,
                amount: Number(form.amount),
            };

            await Api.post("/income", payload);

            alert("Income added successfully!");

            setForm({
                vehicleId: "",
                date: "",
                amount: "",
                source: "",
                location: "",
            });

            await fetchIncomes();
        } catch (error) {
            console.error(
                "Error adding income:",
                error.response?.data || error
            );

            alert("Failed to add income. Check the backend console.");
        } finally {
            setLoading(false);
        }
    };

    // Delete income
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this income?"
        );

        if (!confirmDelete) return;

        try {
            await Api.delete(`/income/${id}`);

            alert("Income deleted successfully!");

            await fetchIncomes();
        } catch (error) {
            console.error(
                "Error deleting income:",
                error.response?.data || error
            );

            alert("Failed to delete income.");
        }
    };

    return (
        <div className="income-page">
            <div className="income-header">
                <h1>Income Management</h1>
                <p>Record and track your vehicle business income.</p>
            </div>

            {/* Add Income Form */}
            <div className="income-form-card">
                <h2>Add New Income</h2>

                <form className="income-form" onSubmit={handleSubmit}>
                    <div className="income-field">
                        <label>Vehicle ID</label>
                        <input
                            name="vehicleId"
                            placeholder="Enter vehicle ID"
                            value={form.vehicleId}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="income-field">
                        <label>Date</label>
                        <input
                            type="date"
                            name="date"
                            value={form.date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="income-field">
                        <label>Amount (₹)</label>
                        <input
                            type="number"
                            name="amount"
                            placeholder="Enter amount"
                            min="0.01"
                            step="0.01"
                            value={form.amount}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="income-field">
                        <label>Source</label>
                        <input
                            name="source"
                            placeholder="e.g. Trip payment"
                            value={form.source}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="income-field income-full-width">
                        <label>Location</label>
                        <input
                            name="location"
                            placeholder="Enter location"
                            value={form.location}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        className="income-submit"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "+ Add Income"}
                    </button>
                </form>
            </div>

            {/* Income List */}
            <div className="income-list-header">
                <h2>Income Records</h2>

                <span className="income-count">
                    {incomes.length} Records
                </span>
            </div>

            {incomes.length === 0 ? (
                <div className="income-empty">
                    No income records found.
                </div>
            ) : (
                <div className="income-table-wrapper">
                    <table className="income-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Vehicle ID</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Source</th>
                                <th>Location</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {incomes.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.vehicleId}</td>
                                    <td>{item.date}</td>
                                    <td>
                                        ₹
                                        {Number(item.amount).toLocaleString(
                                            "en-IN"
                                        )}
                                    </td>
                                    <td>{item.source}</td>
                                    <td>{item.location}</td>
                                    <td>
                                        <button
                                            className="income-delete-btn"
                                            type="button"
                                            onClick={() =>
                                                handleDelete(item.id)
                                            }
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
        </div>
    );
}

export default Income;

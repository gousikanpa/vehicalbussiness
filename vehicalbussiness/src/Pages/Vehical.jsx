
import React, { useEffect, useState } from "react";
import Api from "../Service/Api";
import "./Vehical.css";

function Vehical() {
    const [vehicles, setVehicles] = useState([]);
    const [form, setForm] = useState({
        vehicleName: "",
        vehicleNumber: "",
        driverName: "",
        status: "",
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchVehicles();
    }, []);

    // Fetch all vehicles
    const fetchVehicles = async () => {
        try {
            const response = await Api.get("/show");
            setVehicles(
                Array.isArray(response.data) ? response.data : []
            );
        } catch (error) {
            console.error("Error fetching vehicles:", error);
        }
    };

    // Handle input changes
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // Add vehicle
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await Api.post("/number", form);

            alert("Vehicle added successfully!");

            setForm({
                vehicleName: "",
                vehicleNumber: "",
                driverName: "",
                status: "",
            });

            await fetchVehicles();
        } catch (error) {
            console.error(
                "Error adding vehicle:",
                error.response?.data || error
            );

            alert(
                typeof error.response?.data === "string"
                    ? error.response.data
                    : "Vehicle could not be added. Check the backend console."
            );
        } finally {
            setLoading(false);
        }
    };

return (
    <div className="vehicle-page">
        <div className="vehicle-header">
            <h1>Vehicle Management</h1>
            <p>Add and manage your business vehicles.</p>
        </div>

        <div className="vehicle-form-card">
            <h2>Add New Vehicle</h2>

            <form className="vehicle-form" onSubmit={handleSubmit}>
                <div className="vehicle-field">
                    <label>Vehicle Name</label>
                    <input
                        name="vehicleName"
                        placeholder="Enter vehicle name"
                        value={form.vehicleName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="vehicle-field">
                    <label>Vehicle Number</label>
                    <input
                        name="vehicleNumber"
                        placeholder="Enter vehicle number"
                        value={form.vehicleNumber}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="vehicle-field">
                    <label>Driver Name</label>
                    <input
                        name="driverName"
                        placeholder="Enter driver name"
                        value={form.driverName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="vehicle-field">
                    <label>Status</label>
                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Status</option>
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                    </select>
                </div>

                <button
                    className="vehicle-submit"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Saving..." : "Add Vehicle"}
                </button>
            </form>
        </div>

        <div className="vehicle-list-header">
            <h2>Vehicle List</h2>
            <span className="vehicle-count">
                {vehicles.length} Vehicles
            </span>
        </div>

        {vehicles.length === 0 ? (
            <div className="vehicle-empty">
                No vehicles found. Add your first vehicle.
            </div>
        ) : (
            <div className="vehicle-list">
                {vehicles.map((vehicle) => (
                    <div className="vehicle-card" key={vehicle.id}>
                        <h3>🚚 {vehicle.vehicleName}</h3>
                        <p><strong>ID:</strong> {vehicle.id}</p>
                        <p><strong>Number:</strong> {vehicle.vehicleNumber}</p>
                        <p><strong>Driver:</strong> {vehicle.driverName}</p>
                        <p><strong>Status:</strong></p>
                        <span className="vehicle-status">
                            {vehicle.status}
                        </span>
                    </div>
                ))}
            </div>
        )}
    </div>
);

}

export default Vehical;

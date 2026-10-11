
import React from "react";
import { NavLink } from "react-router-dom";
import "./Slidebar.css";

const Slidebar = () => {
    const links = [
        { name: "Dashboard", path: "/" },
        { name: "Vehicles", path: "/vehicles" },
        { name: "Income", path: "/income" },
        { name: "Expense", path: "/expense" },
        { name: "Maintenance", path: "/maintenance" },
        { name: "Reports", path: "/reports" },
    ];

    return (
        <aside className="sidebar">
            <h2>Vehicle Business</h2>

            <nav>
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        end={link.path === "/"}
                        className={({ isActive }) =>
                            isActive ? "nav-link active" : "nav-link"
                        }
                    >
                        {link.name}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Slidebar;

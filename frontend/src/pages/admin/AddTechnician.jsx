import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";

import Layout from "../../components/Layout";
import Loader from "../../components/Loader";
import { useToast } from "../../components/ToastProvider";

import adminService from "../../services/adminService";

import "../../assets/css/pages/addTechnician.css";

export default function AddTechnician() {
  const navigate = useNavigate();

  const { showSuccess, showError, showWarning } = useToast();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    email: "",
    password: "",
    phnumber: "",
    spec: "",
    expe: "",
    role: "TECHNICIAN",
    available: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password.trim() ||
      !formData.phnumber.trim() ||
      !formData.spec.trim() ||
      formData.expe === ""
    ) {
      showWarning("Please fill all required fields.");
      return false;
    }

    if (formData.phnumber.length !== 10) {
      showWarning("Phone number must be 10 digits.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      await adminService.addTechnician({
        ...formData,
        expe: Number(formData.expe),
      });

      showSuccess("Technician Registered Successfully.");

      navigate("/admin/technicians", {
        replace: true,
      });
    } catch (error) {
      showError(
        error?.response?.data?.msg ||
          "Unable to register technician."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Add Technician">

      {loading && (
        <Loader
          fullScreen
          text="Registering Technician..."
        />
      )}

      <div className="technician-form-card">

        <div className="form-header">

          <FaUserPlus />

          <h2>Add New Technician</h2>

          <p>
            Register a technician who can receive
            service requests.
          </p>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="row">

            <div className="col-md-6 mb-4">
              <label>Name</label>

              <input
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Technician Name"
              />
            </div>

            <div className="col-md-6 mb-4">
              <label>Email</label>

              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
              />
            </div>

            <div className="col-md-6 mb-4">
              <label>Password</label>

              <input
                type="password"
                className="form-control"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
              />
            </div>

            <div className="col-md-6 mb-4">
              <label>Phone Number</label>

              <input
                className="form-control"
                name="phnumber"
                value={formData.phnumber}
                onChange={handleChange}
                placeholder="9876543210"
              />
            </div>

            <div className="col-md-6 mb-4">
              <label>Specialization</label>

              <select
                className="form-control"
                name="spec"
                value={formData.spec}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option>Hardware</option>
                <option>Software</option>
                <option>Networking</option>
                <option>Laptop Repair</option>
                <option>Desktop Repair</option>
                <option>Printer Repair</option>
              </select>
            </div>

            <div className="col-md-6 mb-4">
              <label>Experience (Years)</label>

              <input
                type="number"
                className="form-control"
                name="expe"
                min="0"
                value={formData.expe}
                onChange={handleChange}
                placeholder="Years of Experience"
              />
            </div>

            <div className="col-12 mb-4">

              <div className="form-check">

                <input
                  type="checkbox"
                  className="form-check-input"
                  name="available"
                  checked={formData.available}
                  onChange={handleChange}
                />

                <label className="form-check-label">
                  Technician Available
                </label>

              </div>

            </div>

          </div>

          <button
            className="save-technician-btn"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : "Register Technician"}
          </button>

        </form>

      </div>

    </Layout>
  );
}
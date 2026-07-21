import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FaUserEdit } from "react-icons/fa";

import Layout from "../../components/Layout";
import Loader from "../../components/Loader";
import { useToast } from "../../components/ToastProvider";

import adminService from "../../services/adminService";

// Reuses the Add Technician form styling — same look & feel, no new CSS file.
import "../../assets/css/pages/addTechnician.css";

export default function EditTechnician() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { showSuccess, showError, showWarning } = useToast();

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

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

  useEffect(() => {
    loadTechnician();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // There is no GET /api/admin/technician/{id} endpoint, so we load the
  // existing technician list (already used by ManageTechnician.jsx) and
  // find the matching record client-side.
  const loadTechnician = async () => {
    try {
      setInitialLoading(true);

      const technicians = await adminService.getTechnicians();

      const technician = (technicians || []).find(
        (tech) => String(tech.id) === String(id)
      );

      if (!technician) {
        setNotFound(true);
        return;
      }

      setFormData({
        id: technician.id,
        name: technician.name || "",
        email: technician.email || "",
        password: "",
        phnumber: technician.phnumber || "",
        spec: technician.spec || "",
        expe: technician.expe ?? "",
        role: technician.role || "TECHNICIAN",
        available: !!technician.available,
      });
    } catch (error) {
      console.error(error);
      showError("Unable to load technician details.");
      setNotFound(true);
    } finally {
      setInitialLoading(false);
    }
  };

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

      const payload = {
        ...formData,
        expe: Number(formData.expe),
      };

      // Don't overwrite the technician's password unless a new one
      // was actually entered.
      if (!payload.password.trim()) {
        delete payload.password;
      }

      await adminService.updateTechnician(payload);

      showSuccess("Technician updated successfully.");

      navigate("/admin/technicians", {
        replace: true,
      });
    } catch (error) {
      showError(
        error?.response?.data?.msg ||
          "Unable to update technician."
      );
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <Layout title="Edit Technician">
        <Loader fullScreen text="Loading Technician..." />
      </Layout>
    );
  }

  if (notFound) {
    return (
      <Layout title="Edit Technician">
        <div className="technician-form-card">
          <div className="form-header">
            <FaUserEdit />
            <h2>Technician Not Found</h2>
            <p>
              We couldn't find a technician with this ID.
            </p>
          </div>

          <Link
            to="/admin/technicians"
            className="save-technician-btn"
            style={{ textDecoration: "none", textAlign: "center", display: "block" }}
          >
            Back to Manage Technicians
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Edit Technician">

      {loading && (
        <Loader
          fullScreen
          text="Updating Technician..."
        />
      )}

      <div className="technician-form-card">

        <div className="form-header">

          <FaUserEdit />

          <h2>Edit Technician</h2>

          <p>
            Update this technician's details.
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
              <label>New Password (leave blank to keep current)</label>

              <input
                type="password"
                className="form-control"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
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
              : "Update Technician"}
          </button>

        </form>

      </div>

    </Layout>
  );
}

import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Loader from "../../components/Loader";
import { useToast } from "../../components/ToastProvider";
import serviceCatalogService from "../../services/serviceCatalogService";
import "../../assets/css/pages/serviceCatalog.css";

export default function ServiceCatalog() {

    const {
        showSuccess,
        showError,
        showWarning
    } = useToast();

    const [loading, setLoading] = useState(false);
    const [services, setServices] = useState([]);
    const [editing, setEditing] = useState(false);

    const [formData, setFormData] = useState({
        id: "",
        serviceName: "",
        basePrice: "",
        estimatedDays: "",
        active: true
    });

    useEffect(() => {
        loadServices();
    }, []);

    const loadServices = async () => {

        try {

            setLoading(true);

            const data = await serviceCatalogService.getAllServices();

            setServices(data || []);

        } catch (error) {

            console.error(error);

            showError("Unable to load services.");

        } finally {

            setLoading(false);

        }

    };

    const handleChange = (e) => {

        const { name, value, type, checked } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));

    };

    const resetForm = () => {

        setEditing(false);

        setFormData({
            id: "",
            serviceName: "",
            basePrice: "",
            estimatedDays: "",
            active: true
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (
            !formData.serviceName.trim() ||
            !formData.basePrice ||
            !formData.estimatedDays
        ) {

            showWarning("Please fill all fields.");

            return;

        }

        try {

            setLoading(true);

            if (editing) {

                await serviceCatalogService.updateService(formData);

                showSuccess("Service Updated Successfully.");

            } else {

                await serviceCatalogService.addService(formData);

                showSuccess("Service Added Successfully.");

            }

            resetForm();

            await loadServices();

        } catch (error) {

            console.error(error);

            showError(
                error?.response?.data?.msg ||
                "Operation Failed."
            );

        } finally {

            setLoading(false);

        }

    };

    const handleEdit = (service) => {

        setEditing(true);

        setFormData({
            id: service.id,
            serviceName: service.serviceName,
            basePrice: service.basePrice,
            estimatedDays: service.estimatedDays ?? "",
            active: service.active
        });

    };

    const handleDelete = async (id, serviceName) => {

        const confirmDelete = window.confirm(
            `Delete "${serviceName}"?`
        );

        if (!confirmDelete) return;

        try {

            setLoading(true);

            await serviceCatalogService.deleteService(id);

            showSuccess("Service Deleted Successfully.");

            await loadServices();

        } catch (error) {

            console.error(error);

            showError(
                error?.response?.data?.msg ||
                "Unable to delete service."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <Layout title="Service Catalog">

            {loading && (
                <Loader
                    fullScreen
                    text="Please wait..."
                />
            )}

            <div className="service-catalog-container">

                <div className="service-form-card">

                    <h3>
                        {editing ? "Update Service" : "Add New Service"}
                    </h3>

                    <form onSubmit={handleSubmit}>

                        <div className="row">

                            <div className="col-md-6 mb-3">
                                <label>Service Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="serviceName"
                                    value={formData.serviceName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>Base Price (₹)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="basePrice"
                                    value={formData.basePrice}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>Estimated Days</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="estimatedDays"
                                    value={formData.estimatedDays}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3 d-flex align-items-center">

                                <div className="form-check mt-4">

                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        name="active"
                                        checked={formData.active}
                                        onChange={handleChange}
                                    />

                                    <label className="form-check-label">
                                        Active
                                    </label>

                                </div>

                            </div>

                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary"
                        >
                            {editing ? "Update Service" : "Add Service"}
                        </button>

                        {editing && (
                            <button
                                type="button"
                                className="btn btn-secondary ms-2"
                                onClick={resetForm}
                            >
                                Cancel
                            </button>
                        )}

                    </form>

                </div>

                <div className="service-table-card mt-4">

                    <h3>Available Services</h3>

                    <div className="table-responsive">

                        <table className="table table-bordered table-hover">

                            <thead>

                                <tr>
                                    <th>#</th>
                                    <th>Service Name</th>
                                    <th>Price</th>
                                    <th>Estimated Days</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>

                            </thead>

                            <tbody>

                                {services.length > 0 ? (
                                    services.map((service, index) => (
                                        <tr key={service.id}>

                                            <td>{index + 1}</td>

                                            <td>{service.serviceName}</td>

                                            <td>₹{service.basePrice}</td>

                                            <td>
                                                {service.estimatedDays
                                                    ? `${service.estimatedDays} Days`
                                                    : "-"}
                                            </td>

                                            <td>

                                                <span
                                                    className={
                                                        service.active
                                                            ? "badge bg-success"
                                                            : "badge bg-danger"
                                                    }
                                                >
                                                    {service.active
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>

                                            </td>

                                            <td>

                                                <button
                                                    className="btn btn-warning btn-sm me-2"
                                                    onClick={() => handleEdit(service)}
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() =>
                                                        handleDelete(
                                                            service.id,
                                                            service.serviceName
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </td>

                                        </tr>
                                    ))
                                ) : (

                                    <tr>

                                        <td
                                            colSpan="6"
                                            className="text-center"
                                        >
                                            No Services Found
                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </Layout>

    );

}
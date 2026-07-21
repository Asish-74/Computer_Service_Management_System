import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPaperPlane } from "react-icons/fa";

import Layout from "../../components/Layout";
import Loader from "../../components/Loader";
import { useToast } from "../../components/ToastProvider";

import userService from "../../services/userService";
import serviceCatalogService from "../../services/serviceCatalogService";

import "../../assets/css/pages/serviceRequest.css";

export default function ServiceRequest() {

  const navigate = useNavigate();

  const {
    showSuccess,
    showError,
    showWarning,
  } = useToast();

  const [loading, setLoading] = useState(false);

  const [services, setServices] = useState([]);

  const [selectedService, setSelectedService] = useState(null);

  const [formData, setFormData] = useState({
    serviceType: "",
    brandName: "",
    modelNumber: "",
    priority: "MEDIUM",
    problemDescription: "",
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {

    try {

      const data =
        await serviceCatalogService.getActiveServices();

      setServices(data || []);

    } catch (error) {

      console.error(error);

      showError("Unable to load services.");

    }

  };

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "serviceType") {

      const service = services.find(
        (item) => item.serviceName === value
      );

      setSelectedService(service || null);

    }

  };

  const validate = () => {

    if (
      !formData.serviceType.trim() ||
      !formData.brandName.trim() ||
      !formData.modelNumber.trim() ||
      !formData.problemDescription.trim()
    ) {

      showWarning("Please fill all required fields.");

      return false;

    }

    return true;

  };
    const handleSubmit = async (e) => {

    e.preventDefault();

    if (!validate()) return;

    try {

      setLoading(true);

      await userService.createServiceRequest(formData);

      showSuccess("Service Request Created Successfully.");

      setFormData({
        serviceType: "",
        brandName: "",
        modelNumber: "",
        priority: "MEDIUM",
        problemDescription: "",
      });

      setSelectedService(null);

      setTimeout(() => {

        navigate("/user/requests");

      }, 1000);

    } catch (error) {

      console.error(error);

      showError(
        error?.response?.data?.msg ||
        "Failed to create service request."
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <Layout title="Create Service Request">

      {loading && (

        <Loader
          fullScreen
          text="Submitting Request..."
        />

      )}

      <div className="request-container">

        <div className="request-card">

          <div className="request-header">

            <h2>Create Service Request</h2>

            <p>
              Fill in your device details to create a repair request.
            </p>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="row">

              <div className="col-md-6 mb-4">

                <label>Service Type</label>

                <select
                  className="form-control"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select Service Type
                  </option>

                  {services.map((service) => (

                    <option
                      key={service.id}
                      value={service.serviceName}
                    >
                      {service.serviceName}
                    </option>

                  ))}

                </select>

                {selectedService && (
                                    <div className="service-price-card">

                    <h5>Estimated Charges</h5>

                    <p className="service-desc">
                      {selectedService.description}
                    </p>

                    <div className="price-row">
                      <span>Base Price</span>
                      <strong>
                        ₹{selectedService.basePrice.toFixed(2)}
                      </strong>
                    </div>

                    <div className="price-row">
                      <span>GST (10%)</span>
                      <strong>
                        ₹{(selectedService.basePrice * 0.10).toFixed(2)}
                      </strong>
                    </div>

                    <div className="price-row">
                      <span>Estimated Time</span>
                      <strong>
                        {selectedService.estimatedDays} Days
                      </strong>
                    </div>

                    <hr />

                    <div className="price-total">
                      <span>Total Estimated Cost</span>
                      <strong>
                        ₹{(selectedService.basePrice * 1.10).toFixed(2)}
                      </strong>
                    </div>

                    <small>
                      GST @10% has been included.
                      <br />
                      Final amount may change after technician inspection.
                    </small>

                  </div>

                )}

              </div>

              <div className="col-md-6 mb-4">

                <label>Brand Name</label>

                <input
                  type="text"
                  className="form-control"
                  name="brandName"
                  placeholder="HP, Dell, Lenovo..."
                  value={formData.brandName}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="col-md-6 mb-4">

                <label>Model Number</label>

                <input
                  type="text"
                  className="form-control"
                  name="modelNumber"
                  placeholder="Enter Model Number"
                  value={formData.modelNumber}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="col-md-6 mb-4">

                <label>Priority</label>

                <select
                  className="form-control"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                >

                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>

                </select>

              </div>

              <div className="col-12 mb-4">

                <label>Problem Description</label>

                <textarea
                  rows="5"
                  className="form-control"
                  name="problemDescription"
                  placeholder="Describe the issue..."
                  value={formData.problemDescription}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

            <button
              type="submit"
              className="submit-request-btn"
              disabled={loading}
            >

              <FaPaperPlane />

              {loading
                ? "Submitting..."
                : "Submit Request"}

            </button>

          </form>

        </div>

      </div>

    </Layout>

  );

}

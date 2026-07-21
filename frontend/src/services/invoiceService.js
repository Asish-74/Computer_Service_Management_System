import axiosClient from "../api/axiosClient";

const invoiceService = {

  async downloadInvoice(requestId) {

    const response = await axiosClient.get(
      `/api/invoice/download/${requestId}`,
      {
        responseType: "blob",
      }
    );

    return response.data;

  },

};

export default invoiceService;
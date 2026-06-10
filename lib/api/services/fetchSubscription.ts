import apiService from "../core";

export interface PaymentNotifyRequest {
  package_key: string;
  amount: number;
  transfer_note: string;
}

export interface PaymentNotifyResponse {
  message: string;
  request_id: string;
}

export const fetchSubscription = {
  notifyPayment: async (data: PaymentNotifyRequest, billImage: File): Promise<PaymentNotifyResponse> => {
    const formData = new FormData();
    formData.append("package_key", data.package_key);
    formData.append("amount", String(data.amount));
    formData.append("transfer_note", data.transfer_note);
    formData.append("bill_image", billImage, billImage.name);

    const response = await apiService.upload<PaymentNotifyResponse>(
      "api/v1/subscriptions/payment-notify",
      formData
    );
    return response.data;
  },
};

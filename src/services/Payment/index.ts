import axios, { AxiosResponse } from "axios";
import { ApiResponse } from "../../models/ApiResponse";
import { PaymentDelete } from "../../models/PaymentDelete";
import { PaymentDetail } from "../../models/PaymentDetail";
import { PaymentPaginate } from "../../models/PaymentPaginate";
import { PaymentUpdate } from "../../models/PaymentUpdate";
export function PaymentService() {
 const token = localStorage.getItem("token");

 const getPayments = async (
  cursor: string | null,
  direction: string
 ): Promise<ApiResponse<PaymentPaginate> | any> => {
  try {
   if (!token) {
    throw new Error("Unauthorized");
   }
   const response: AxiosResponse<ApiResponse<PaymentPaginate>> =
    await axios.get(process.env.REACT_APP_PAYMENT_LIST || "", {
     params: { cursor, direction },
     headers: {
      token: `${token}`,
     },
    });
   return response.data.data;
  } catch (err) {
   throw err;
  }
 };

 const addPayments = async (data: any): Promise<string> => {
  try {
   if (!token) {
    throw new Error("Unauthorized");
   }
   const response: AxiosResponse<string> = await axios.post(
    process.env.REACT_APP_CREATE_PAYMENT || "",
    data,
    {
     headers: {
      token: `${token}`,
     },
    }
   );
   return response.data;
  } catch (err: any) {
   if (err.response && err.response.data && err.response.data.message) {
    return err.response.data.message;
   } else if (err.message) {
    return err.message;
   } else {
    return "An unknown error occurred.";
   }
  }
 };

 const getPaymentById = async (id: string): Promise<ApiResponse<PaymentDetail>> => {
  try {
   if (!token) {
    throw new Error("Unauthorized");
   }
   const response = await axios.get(
    process.env.REACT_APP_PAYMENT_DETAIL + `${id}` || ``,
    {
     headers: {
      token: `${token}`,
     },
    }
   );
   return response.data;
  } catch (err) {
   console.error(err);
   throw err;
  }
 };

 const updatePayment = async (id: string, data: PaymentUpdate) => {
  try {
   if (!token) {
    throw new Error("Unauthorized");
   }

   const response: AxiosResponse<any> = await axios.put(
    process.env.REACT_APP_UPDATE_PAYMENT + `/${id}` || "",
    { Payment: data },
    {
     headers: {
      token: `${token}`,
     },
    }
   );

   return response.data.data;
  } catch (err) {
   throw err;
  }
 }
 const deletePayments = async (id: PaymentDelete[]) => {
  try {

   if (!token) {
    throw new Error("Unauthorized. Please log in.");
   }
   const response: AxiosResponse<string> = await axios.delete(
    process.env.REACT_APP_DELETE_PAYMENT || "",
    {
     headers: {
      token: `${token}`,
     },
     data: { ids: id },
    },

   );
   return response.data;
  } catch (err) {
   throw err;
  }
 }
 return {
  getPayments,
  getPaymentById,
  addPayments,
  deletePayments,
  updatePayment
 };
}
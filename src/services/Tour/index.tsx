import axios, { AxiosResponse } from "axios";
import { ApiResponse } from "../../models/ApiResponse";
import { CloudinaryResponse } from "../../models/CloudinaryResponse";
import { TourDetail } from "../../models/TourDetail";
import { TourListDelete } from "../../models/TourListDelete";
import { TourListResponse } from "../../models/TourListResponse";
import { TourPaginate } from "../../models/TourPaginate";
import { TourUpdate } from "../../models/TourUpdate";

export function TourService() {
  const token = localStorage.getItem("token");

  const getTours = async (
    cursor: string | null,
    direction: string
  ): Promise<ApiResponse<TourPaginate> | any> => {
    try {
      if (!token) {
        throw new Error("Unauthorized");
      }
      const response: AxiosResponse<ApiResponse<TourPaginate>> =
        await axios.get(process.env.REACT_APP_TOUR_LIST || "", {
          params: { cursor, direction },
          headers: {
            token: `${token}`,
          },
        });
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const AddTours = async (data: any): Promise<string> => {
    try {
      if (!token) {
        throw new Error("Unauthorized");
      }
      const response: AxiosResponse<string> = await axios.post(
        process.env.REACT_APP_CREATE_TOUR || "",
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

  const getTourById = async (id: string): Promise<ApiResponse<TourDetail>> => {
    try {
      if (!token) {
        throw new Error("Unauthorized");
      }
      const response = await axios.get(
        process.env.REACT_APP_TOUR_DETAIL + `${id}` || ``,
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

  const uploadImage = async (file: File): Promise<string | undefined> => {
    const uploadImageApi = process.env.REACT_APP_CLOUDINARY_UPLOAD_URL;
    if (!uploadImageApi) {
      return;
    }

    if (!file) {
      return;
    }
    const data = new FormData();
    data.append("file", file);
    data.append(
      "upload_preset",
      process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET_NAME as string
    );
    data.append(
      "cloud_name",
      process.env.REACT_APP_CLOUDINARY_CLOUD_NAME as string
    );

    try {
      const res = await axios.post<CloudinaryResponse>(uploadImageApi, data);
      return res.data.public_id;
    } catch (error: any) {
      console.error("Error uploading image:", error.message);
      return error.message;
    }
  };

  const updateTour = async (data: TourUpdate) => {
    try {
      if (!token) {
        throw new Error("Unauthorized");
      }

      const response: AxiosResponse<string> = await axios.put(
        process.env.REACT_APP_UPDATE_TOUR || "",
        { tour: data },
        {
          headers: {
            token: `${token}`,
          },
        }
      );

      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const deleteTours = async (data: TourListDelete[]) => {
    try {
      if (!token) {
        throw new Error("Unauthorized");
      }
      const response: AxiosResponse<string> = await axios.delete(
        process.env.REACT_APP_DELETE_TOUR || "",
        {
          headers: {
            token: `${token}`,
          },
          data: { tours: data },
        }
      );
      return response.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const tourList = async (): Promise<ApiResponse<TourListResponse> | any> => {
    try {
      if (!token) {
        throw new Error("Unauthorized");
      }
      const response: AxiosResponse<string> = await axios.get(
        process.env.REACT_APP_TOUR_ALL || "",
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

  return {
    getTours,
    AddTours,
    deleteTours,
    updateTour,
    uploadImage,
    getTourById,
    tourList,
  };
}

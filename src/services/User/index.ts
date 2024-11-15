import axios, { AxiosResponse } from "axios";
import { AdminLogin } from "../../models/AdminLogin";
import { LoginResponse } from "../../models/TokenResponse";
import { UserCreation } from "../../models/UserCreation";

export function UserService() {

  const adminLogin = async (loginData: AdminLogin): Promise<string> => {
    try {
      const response = await axios.post<LoginResponse>(
        process.env.REACT_APP_ADMIN_LOGIN || "",
        loginData 
      );
      const token = response.data.data;
      localStorage.setItem("token", token);
      return token;
    } catch (err) {
      throw err;
    }
  };

  const getUsers = async () =>{
   try {
    const token = localStorage.getItem("token");
    if (!token) {
     throw new Error("Unauthorized. Please log in.");
   }
    const response = await axios.get(
      process.env.REACT_APP_GET_USERS || "",
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

  const AddUsers = async (data: UserCreation[]): Promise<string> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Unauthorized. Please log in.");
      }
      const response: AxiosResponse<string> = await axios.post(
        process.env.REACT_APP_A || "",
        data,
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

  const updateUser = async () =>{

  }

  const deleteUSer = async () =>{

  }



  return {
    AddUsers,
    updateUser,
    deleteUSer,
    adminLogin,
    getUsers
  };
}

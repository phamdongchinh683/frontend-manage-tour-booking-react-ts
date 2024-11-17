import axios, { AxiosResponse } from "axios";
// import { UserCreation } from "../../models/UserCreation";

export function RoleService() {

  const getRoles = async () =>{
   try {
    const token = localStorage.getItem("token");
    if (!token) {
     throw new Error("Unauthorized. Please log in.");
   }
    const response = await axios.get(
      process.env.REACT_APP_GET_ROLES || "",
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

  const addRole = async (data: any): Promise<string> => {
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

  const updateRole = async () =>{

  }

  const deleteRole = async () =>{

  }

  return {
   getRoles,
   addRole,
   updateRole,
   deleteRole 
   };
}

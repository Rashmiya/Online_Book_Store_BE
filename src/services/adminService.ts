import AdminRepository from "../repositories/AdminRepository";
import { ApiResponse } from "../utils/interfaces/commonInterface";
import {
  CustomerDetails,
  customerEmailInterface,
  customerIdInterface,
  CustomerLoginModel,
  CustomerRegisterModel,
} from "../utils/interfaces/customerInterface";

const adminService = {
  getAllAdminService: async (): Promise<ApiResponse<any[]>> => {
    try {
      return AdminRepository.getAllAdminsRepo();
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  },
  saveAdminService: async (
    data: CustomerRegisterModel
  ): Promise<ApiResponse<any[]>> => {
    try {
      return await AdminRepository.saveAdminRepo(data);
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  },

  logInAdmin: async (data: CustomerLoginModel): Promise<ApiResponse<any[]>> => {
    try {
      return await AdminRepository.loginAdminRepo(data);
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  },

  refreshService: async (
    data: customerEmailInterface
  ): Promise<ApiResponse<any[]>> => {
    try {
      return await AdminRepository.getAdminDetailsRepo(data);
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  },

  deleteAdminService: async (
    data: customerIdInterface
  ): Promise<ApiResponse<any[]>> => {
    try {
      return await AdminRepository.deleteAdminRepo(data);
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  },
};

export default adminService;

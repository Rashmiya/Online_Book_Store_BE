import CustomerRepository from "../repositories/CustomerRepository";
import { ApiResponse } from "../utils/interfaces/commonInterface";
import {
  CustomerDetails,
  customerEmailInterface,
  customerIdInterface,
  CustomerLoginModel,
  CustomerModel,
  CustomerRegisterModel,
} from "../utils/interfaces/customerInterface";

const CustomerService = {
  getAllCustomerService: async (
    data: CustomerDetails
  ): Promise<ApiResponse<any[]>> => {
    try {
      return CustomerRepository.getAllCustomersRepo(data);
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  },
  saveCustomerService: async (
    data: CustomerRegisterModel
  ): Promise<ApiResponse<any[]>> => {
    try {
      return await CustomerRepository.saveCustomerRepo(data);
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  },
  logInCustomer: async (
    data: CustomerLoginModel
  ): Promise<ApiResponse<any[]>> => {
    try {
      return await CustomerRepository.loginCustomerRepo(data);
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  },
  updateCustomerService: async (
    data: CustomerModel
  ): Promise<ApiResponse<any[]>> => {
    try {
      return await CustomerRepository.updateCustomerRepo(data);
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
      return await CustomerRepository.getCustomerDetailsRepo(data);
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  },
  getUserDetails: async (
    data: customerEmailInterface
  ): Promise<ApiResponse<any[]>> => {
    try {
      return await CustomerRepository.getCustomerDetailsRepo(data);
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  },
  deleteCustomerService: async (
    data: customerIdInterface
  ): Promise<ApiResponse<any[]>> => {
    try {
      return await CustomerRepository.deleteCustomerRepo(data);
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  },
};
export default CustomerService;

import Admin from "../models/admin.model";
import {
  CustomerDetails,
  CustomerRegisterModel,
} from "../utils/interfaces/customerInterface";
import bcrypt from "bcrypt";

const AdminRepository = {
  getAllAdminsRepo: async (): Promise<any> => {
    try {
      const allAdmins = await Admin.find().lean();

      if (!allAdmins) {
        return {
          success: true,
          message: "No Admin users To Fetch!",
          data: [],
        };
      }

      const processCustomers = async (allAdmins: any) =>
        Promise.all(
          allAdmins.map(async (customer: any) => ({
            companyProfileId: customer?._id,
            userName: customer?.username,
            email: customer?.email,
            roleName: customer?.role,
          }))
        );

      const processedCustomers = await processCustomers(allAdmins);
      return {
        success: true,
        message: "Admin Users Fetched Successfully!",
        data: {
          admin_users: processedCustomers,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  },
  saveAdminRepo: async (data: CustomerRegisterModel): Promise<any> => {
    try {
      const existCustomer = await Admin.findOne({
        email: {
          $regex: new RegExp("^" + data.email + "$", "i"),
        },
      });

      if (existCustomer) {
        return {
          success: false,
          message: "Admin Already Exists!",
          data: null,
        };
      }
      // Hash the password
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const admin = new Admin({
        username: data.username,
        email: data.email,
        password: hashedPassword,
        role: data.role,
      });
      const newAdmin = await admin.save();
      return {
        success: true,
        message: "Admin Added Successfully!",
        data: {
          id: newAdmin._id,
          username: newAdmin.username,
          email: newAdmin.email,
          role: newAdmin.role,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  },

  loginAdminRepo: async (data: any): Promise<any> => {
    try {
      const existCustomer = await Admin.findOne({
        email: {
          $regex: new RegExp("^" + data.email + "$", "i"),
        },
      });
      if (!existCustomer) {
        return {
          success: false,
          message: "Email or password is incorrect!",
          data: null,
        };
      }

      const isPasswordValid = await bcrypt.compare(
        data.password,
        existCustomer.password
      );
      if (!isPasswordValid) {
        return {
          success: false,
          message: "Email or password is incorrect!",
          data: null,
        };
      }
      return {
        success: true,
        message: "Admin logged in successfully!",
        data: {
          id: existCustomer._id,
          email: existCustomer.email,
          username: existCustomer.username,
          role: existCustomer.role,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  },

  getAdminDetailsRepo: async (data: any): Promise<any> => {
    try {
      const existCustomer = await Admin.findOne({
        email: {
          $regex: new RegExp("^" + data.email + "$", "i"),
        },
      });

      if (existCustomer) {
        return {
          success: true,
          message: "Admin Found Successfully!",
          data: {
            id: existCustomer._id,
            email: existCustomer.email,
            username: existCustomer.username,
            role: existCustomer.role,
          },
        };
      }
      return {
        success: false,
        message: "Customer Not Found!",
        data: null,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  },
  
  deleteAdminRepo: async (data: any): Promise<any> => {
    try {
      const admin = await Admin.findOne({ _id: data?._id }).lean();
      if (!admin) {
        return {
          success: false,
          message: "Can Not Fetch Admin Data!",
          data: null,
        };
      }
      await Admin.findByIdAndDelete({ _id: data?._id });
      return {
        success: true,
        message: "Admin Deleted Successfully!",
        data: null,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  },
};

export default AdminRepository;

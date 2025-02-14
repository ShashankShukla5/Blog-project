import config from "../config/config";
import { Client, Account, ID } from "appwrite";

class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(config.appwriteUrl)
      .setProject(config.appwriteProjectId);
    this.account = new Account(this.client);
  }

  async createAccount({email, password, name}) {
    try {
      const user = await this.account.create(ID.unique(), email, password, name);
      if (user) {
        return this.login(email, password);
      } else return null;
    } catch (error) {
      // console.log(err)
      throw error;
    }
  }

  async login({email, password}) {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      // console.log(pppp)
      throw error;
    }
  }

  async logout() {
    try {
      await this.account.deleteSession("current");
    } catch (error) {
      throw error;
    }
  }

  async getCurrUser() {
    try {
      return await this.account.getSession("current");
    } catch (error) {
      throw error;
    }

    return null;
  }
}

const authService = new AuthService();

export default authService;

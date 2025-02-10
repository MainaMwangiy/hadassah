import { getAuth, GithubAuthProvider, GoogleAuthProvider, signInWithPopup, UserCredential } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { v4 as uuidv4 } from 'uuid';
import { Dispatch } from 'redux';
import axios from "axios";
import { constants } from "./constants";

interface UserData {
  name: string;
  email: string;
  roleid: number
  farmerOrBuyer: string;
  location: string;
  status: "Active" | "Inactive";
  role: string;
  clientuserid: string | number | undefined;
}

interface Users {
  lookupid: string;
  displayValue: string;
}
interface Organization {
  clientorganizationid: number;
  appconfig: {
    dateFormat?: string;
  }
}
// interface GoogleSignInProps {
//   navigate: (path: string) => void;
//   dispatch: Dispatch;
// }

const clientOrgs = localStorage.getItem("clientorganizations") || '[]';
const clientOrgId = localStorage.getItem("clientorganizationid") || '';
const orgs: Organization[] = JSON.parse(clientOrgs);
const org = orgs.filter((item: Organization) => item.clientorganizationid === Number(clientOrgId));
const { appconfig } = org[0] || {};
const { dateFormat } = appconfig || {};
console.log("process.env.REACT_APP_PROD_BACKEND_URL",process.env.REACT_APP_PROD_BACKEND_URL)
// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_GOOGLE_SSO_API,
//   authDomain: process.env.REACT_APP_GOOGLE_SSO_DOMAIN,
//   projectId: process.env.REACT_APP_GOOGLE_SSO_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_GOOGLE_SSO_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_GOOGLE_SSO_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_GOOGLE_SSO_APP_ID
// };
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const gitHubProvider = new GithubAuthProvider();
// const googleProvider = new GoogleAuthProvider();

const clientusers = localStorage.getItem("clientuser") || "";
const roles = clientusers ? JSON.parse(clientusers) : {};
const isSuperAdmin = roles?.roleid === constants.SUPER_ADMIN_ID;

const utils = {
  isMobile: window.matchMedia("(max-width: 767px)").matches,
  isTablet: window.matchMedia("(min-width: 768px) and (max-width: 1024px)").matches,
  isDesktop: window.matchMedia("(min-width: 1025px)").matches,
  baseUrl: process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PROD_BACKEND_URL : process.env.REACT_APP_DEV_BACKEND_URL,
  dateFormat: dateFormat || 'MM-DD-YYYY',
  // firebaseConfig: firebaseConfig,
  // app: app,
  // auth: auth,
  // gitHubProvider: gitHubProvider,
  // googleProvider: googleProvider,
  isSuperAdmin: isSuperAdmin,
  getRoles: (roleId: number): 'SuperAdmin' | 'Admin' | 'User' | undefined => {
    switch (roleId) {
      case 1:
        return 'SuperAdmin';
      case 2:
        return 'Admin';
      case 3:
        return 'User';
      default:
        break;
    }
  },
  getRolesId: (role: string): number | undefined => {
    const srole = role.toLowerCase();
    switch (srole) {
      case 'superadmin':
        return 1;
      case 'admin':
        return 2;
      case 'user':
        return 3;
      default:
        break;
    }
  },
  updateData: (data: UserData[]): UserData[] => {
    return data.map((dt) => ({
      ...dt,
      role: utils.getRoles(dt.roleid) || "User",
      clientuserid: dt.clientuserid || "",
    }));
  },
  getClientUsersList: (): Users[] => {
    const clientUsersFromStorage = localStorage.getItem("users");
    if (clientUsersFromStorage) {
      const parsedUsers = JSON.parse(clientUsersFromStorage);
      return parsedUsers.map((user: { clientuserid: number; name: string }) => ({
        lookupId: user.clientuserid.toString(),
        displayValue: user.name,
      }));
    }
    return [];
  },
  // googleSignIn: async ({ navigate, dispatch }: GoogleSignInProps): Promise<void> => {
  //   try {
  //     const result: UserCredential = await signInWithPopup(getAuth(), new GoogleAuthProvider());
  //     const credential = GoogleAuthProvider.credentialFromResult(result);
  //     const token = credential?.accessToken;
  //     if (!token) {
  //       throw new Error('No token found from Google sign-in');
  //     }
  //     localStorage.setItem('token', token);
  //     const user = result.user;
  //     const body = {
  //       user_id: uuidv4(),
  //       email: user.email,
  //       name: user.displayName,
  //       image_url: user.photoURL,
  //       role: 3,
  //       provider: 'google',
  //       isSSO: true,
  //       token
  //     };
  //     const response = await axios.post(`${utils.baseUrl}/api/auth/sso`, body, {
  //       headers: { 'Content-Type': 'application/json' },
  //     });
  //     if (response?.status === 200) {
  //       const userData = response.data;
  //       localStorage.setItem('user', JSON.stringify(userData));
  //       localStorage.setItem('token', token);
  //       localStorage.setItem('clientuserid', userData?.clientuserid);
  //       localStorage.setItem('clientuser', JSON.stringify(userData));
  //       localStorage.setItem('clientorganizationid', `${userData?.clientorganizationid}`);
  //       dispatch({ type: 'LOAD_USER', payload: user });
  //       navigate('/dashboard');
  //     } else {
  //       throw new Error('Failed to fetch user data');
  //     }
  //   } catch (error) {
  //     console.error('Google sign-in failed:', error);
  //     localStorage.removeItem('token');
  //     navigate('/login');
  //   }
  // },
  getKeyField: (config: any): string => {
    const field = config.customKeyField || config.keyField || '';
    return field.toLowerCase();
  }
};

export default utils;

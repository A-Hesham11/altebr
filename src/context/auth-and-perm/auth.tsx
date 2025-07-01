import Cookies from "js-cookie";
import { createContext, ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../../hooks";
import { useMutate } from "../../hooks/useMutate";
import { mutateData } from "../../utils/mutateData";
import { notify } from "../../utils/toast";
import {
  AuthCtx_TP,
  LoginCredentials_TP,
  LoginResponseData_TP,
  Permission_TP,
  User_TP,
} from "./auth-permissions-types";
import { useQueryClient } from "@tanstack/react-query";
///
/////////TYPES
///

///
/////////// HELPER VARIABLES & FUNCTIONS
///
export const authCtx = createContext<AuthCtx_TP>({
  isLoggedIn: false,
  isLoggingIn: false,
  isLoggingOut: false,
  logInHandler: () => {},
  logOutHandler: () => {},
  frontLogOutHandler: () => {},
  userToken: "",
  userData: {} as User_TP,
  permissions: [],
  isLoadingUpdatedUserData: true,
});

export const AuthCtxProvider = ({ children }: { children: ReactNode }) => {
  /////////// VARIABLES
  ///
  const initialToken = Cookies.get("token");
  const initialUserData: User_TP | undefined = localStorage.userData
    ? JSON.parse(localStorage.userData)
    : undefined;
  const initialPermissions: string[] | undefined = localStorage.permissions
    ? JSON.parse(localStorage.permissions)
    : undefined;
  ///
  /////////// STATES
  ///
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!initialToken && !!initialUserData && !!initialPermissions
  );
  const [userToken, setUserToken] = useState(initialToken);
  const [userData, setUserData] = useState(initialUserData);
  const [permissions, setPermissions] = useState(initialPermissions);

  const [open, setOpen] = useState(false);

  ///
  /////////// CUSTOM HOOKS
  ///
  const navigate = useNavigate();

  // LOGIN
  const { mutate: loginMutate, isLoading: isLoggingIn } =
    useMutate<LoginResponseData_TP>({
      mutationFn: mutateData,
      mutationKey: ["login_key"],
      onSuccess: (loginResponseData) => {
        if (loginResponseData) {
          const { token, user, permissions } = loginResponseData;

          const permissionsAsStrings = permissions.map(
            (permission) => permission.routes
          );

          // update token
          /* 
          cookies & context
          */
          updateCookies("ADD", token);

          // update user
          /* 
          local & context
          */
          updateLocalUserData("ADD", user);
          // update permissions
          /* 
          local & context
          */
          updateLocalPermissions("ADD", permissionsAsStrings);

          // login=true & notify & navigate
          setIsLoggedIn(true);
          setOpen(true);
          notify("success", "Welcome");
          navigate("/");

          refetch();
          PermissionsRefetch();
        }
      },
      onError: (err) => {
        notify("error");
      },
    });

  // LOGOUT
  const { mutate: logoutMutate, isLoading: isLoggingOut } = useMutate({
    mutationFn: mutateData,
    onSuccess: (data) => {
      logoutOperations();
    },
  });

  // Get updated userData
  const { isFetching: isLoadingUpdatedUserData, refetch } = useFetch<User_TP>({
    endpoint: "/employee/api/employee/details",
    queryKey: ["userData"],
    onSuccess: (data) => {
      updateLocalUserData("ADD", data);
    },
    staleTime: Infinity,
    cacheTime: Infinity,
    enabled: isLoggedIn,
  });

  // Get updated user permissions
  const {
    isFetching: isLoadingUpdatedUserPermissions,
    refetch: PermissionsRefetch,
  } = useFetch<Permission_TP[]>({
    endpoint: "/employee/api/employee/permissions",
    queryKey: ["userPermissions"],
    onSuccess: (data) => {
      const permissionsAsStrings = data.map((permission) => permission.routes);
      updateLocalPermissions("ADD", permissionsAsStrings);
    },
    staleTime: Infinity,
    cacheTime: Infinity,
    enabled: isLoggedIn,
  });
  ///
  /////////// SIDE EFFECTS
  ///

  ///
  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  type Method_TP = "ADD" | "REMOVE";
  function updateCookies(method: Method_TP, token?: string) {
    if (method === "ADD" && !!token) {
      Cookies.set("token", token);
      setUserToken(token);
      return;
    }
    Cookies.remove("token");
    setUserToken("");
  }

  function updateLocalUserData(method: Method_TP, user?: User_TP) {
    if (method === "ADD" && !!user) {
      localStorage.userData = JSON.stringify(user);
      setUserData(user);
      return;
    }
    localStorage.removeItem("userData");
    setUserData(undefined);
  }

  function updateLocalPermissions(method: Method_TP, permissions?: string[]) {
    if (method === "ADD" && !!permissions) {
      localStorage.permissions = JSON.stringify(permissions);
      setPermissions(permissions);
      return;
    }
    localStorage.removeItem("permissions");
    setPermissions(undefined);
  }

  const logInHandler = (credentials: LoginCredentials_TP) => {
    loginMutate({
      endpointName: "/employee/api/auth/login",
      values: credentials,
    });
  };

  // logout
  function logoutOperations() {
    // update token
    /* 
          cookies & context
          */
    updateCookies("REMOVE");

    // update user
    /* 
          local & context
          */
    updateLocalUserData("REMOVE");

    // update Image
    // setUserImg("")

    // update permissions
    /* 
          local & context
          */
    updateLocalPermissions("REMOVE");
    // login=false & notify & navigate
    setIsLoggedIn(false);

    notify("success", "Good bye, Waiting for you!");
    navigate("/login");
  }
  const logOutHandler = () => {
    logoutMutate({
      endpointName: "/employee/api/employee/logout",
      method: "get",
    });
  };

  ///
  return (
    <authCtx.Provider
      value={{
        isLoggedIn: isLoggedIn && !!userToken && !!userData && !!permissions,
        logInHandler,
        logOutHandler,
        frontLogOutHandler: logoutOperations,
        isLoggingIn,
        isLoggingOut,
        userToken,
        userData,
        permissions,
        isLoadingUpdatedUserData: false,
        open,
        setOpen,
        // isLoadingUpdatedUserData:
        // isLoadingUpdatedUserData || isLoadingUpdatedUserPermissions,
      }}
    >
      {children}
    </authCtx.Provider>
  );
};

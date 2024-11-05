import React from "react";
import { createBrowserRouter } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Cadastro from "../pages/Register";

import { AuthGuard, AuthGuardPublic } from "../AuthGuard";

export const routers = createBrowserRouter([
	{ path: "/", element: <AuthGuard> <Home /> </AuthGuard> },
	{ path: "/login", element: <AuthGuardPublic> <Login /> </AuthGuardPublic> },
	{ path: "/cadastro", element: <AuthGuardPublic> <Cadastro /> </AuthGuardPublic>  },
]);

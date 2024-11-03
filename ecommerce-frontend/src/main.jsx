import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { routers } from "./routes";
import "./styles/globalStyles.css";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<RouterProvider router={routers} />
	</StrictMode>,
);

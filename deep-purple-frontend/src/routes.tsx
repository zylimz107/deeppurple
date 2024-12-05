import React from "react";
// Import your page components
import HomePage from "@/pages/HomePage";
import InboxPage from "@/pages/InboxPage";
import CalendarPage from "./pages/CalendarPage";
import SearchPage from "./pages/SearchPage";
import SettingsPage from "./pages/SettingsPage";
import AnalysisPage from "./pages/AnalysisPage";

// Define the shape of a route
interface Route {
  path: string;
  component: React.ComponentType<any>;
  exact?: boolean;
}



// Define your routes
const routes: Route[] = [
  { path: "/", component: HomePage, exact: true },
  { path: "/inbox", component: InboxPage },
  { path: "/calendar", component: CalendarPage },
  { path: "/search", component: SearchPage },
  { path: "/settings", component: SettingsPage },
  { path: "/analysis", component: AnalysisPage}
];

export default routes;

import { Route, Switch, Link } from "wouter";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import Auth from "./pages/Auth";
import HomePage from "./pages/HomePage";
import Blog from "./pages/Blog";
import Courses from "./pages/Courses";
import Documents from "./pages/Documents";
import BlogDetail from "./pages/BlogDetail";

function Routes() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={Auth} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog-detail" component={BlogDetail} />

      <Route path="/courses" component={Courses} />
      <Route path="/documents" component={Documents} />
      <Route path="/admin" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <Routes/>
  );
}

export default App;

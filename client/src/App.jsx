import { Route, Switch, Link } from "wouter";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import Auth from "./pages/Auth";
import HomePage from "./pages/HomePage";
import Blog from "./pages/Blog";
import Courses from "./pages/Courses";
import Documents from "./pages/Documents";
import BlogDetail from "./pages/BlogDetail";
import CoursesDetail from "./pages/CoursesDetail";
import DocumentDetail from "./pages/DocumentDetail";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import OtherProfile from "./pages/OtherProfile";
import CreatePost from "./pages/CreatePost";
import CreateDocument from "./pages/CreateDocument";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";

function Routes() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={Auth} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog-detail/:id" component={BlogDetail} />
      <Route path="/create-post">
        {() => (
          <ProtectedRoute>
            <CreatePost />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/search" component={Search} />
      <Route path="/courses" component={Courses} />
      <Route path="/courses-detail/:id" component={CoursesDetail} />
      <Route path="/documents/:id" component={DocumentDetail} />
      <Route path="/documents" component={Documents} />
      <Route path="/create-document">
        {() => (
          <ProtectedRoute>
            <CreateDocument />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/profile">
        {() => (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/other-profile/:id" component={OtherProfile} />
      <Route path="/admin">
        {() => (
          <ProtectedRoute requireAdmin={true}>
            <AdminDashboard />
          </ProtectedRoute>
        )}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return <Routes />;
}

export default App;

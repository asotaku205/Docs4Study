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
function Routes() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={Auth} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog-detail" component={BlogDetail} />
      <Route path="/create-post" component={CreatePost} />
      <Route path="/search" component={Search} />
      <Route path="/courses" component={Courses} />
      <Route path="/courses/detail" component={CoursesDetail} />
      <Route path="/documents/detail" component={DocumentDetail} />
      <Route path="/documents" component={Documents} />
      <Route path="/profile" component={Profile} />
      <Route path="/other-profile" component={OtherProfile} />
      <Route path="/admin" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return <Routes />;
}

export default App;

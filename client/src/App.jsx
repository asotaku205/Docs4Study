import { Route, Switch, Link } from "wouter";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import Auth from "./pages/Auth";
import HomePage from "./pages/HomePage";
import Layout from "./components/Layout";

function Demo() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700">
      <div className="text-center text-white">
        <h1 className="text-5xl font-bold mb-4">4Study Platform</h1>
        <p className="text-xl text-slate-300 mb-8">
          Educational platform for students and instructors
        </p>
        <Link href="/admin">
          <span className="inline-block px-8 py-3 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
            Go to Admin Dashboard
          </span>
        </Link>
        <Link href="/home" className="ml-4">
          <span className="inline-block px-8 py-3 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
            Go to Home
          </span>
        </Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <Switch>
        <Route path="/home">
          <Layout>
            <HomePage />
          </Layout>
        </Route>

        <Route path="/" component={Demo} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/auth" component={Auth} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

export default App;

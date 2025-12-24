import { Route, Switch, Link } from "wouter";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import "./App.css";

function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700">
      <div className="text-center text-white">
        <h1 className="text-5xl font-bold mb-4">4Study Platform</h1>
        <p className="text-xl text-slate-300 mb-8">
          Educational platform for students and instructors
        </p>
        <Link href="/admin">
          <a className="inline-block px-8 py-3 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
            Go to Admin Dashboard
          </a>
        </Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/admin" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default App;

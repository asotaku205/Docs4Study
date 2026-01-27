import { useState, useEffect } from "react";
import { Search, Eye, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import Pagination from "../shared/Pagination";
import { usersAPI } from "@/services/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getAll({ limit: 100 });
      setUsers(response.data.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    (u.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
     u.email?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleDelete = async (id) => {
    try {
      await usersAPI.delete(id);
      setUsers(users.filter(u => u._id !== id));
      setSelectedUser(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to deactivate user");
    }
  };

  if (selectedUser) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => setSelectedUser(null)} className="gap-2" size="sm">
          <ChevronRight className="h-4 w-4 rotate-180" /> Back
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>{selectedUser.fullName}</CardTitle>
            <CardDescription>{selectedUser.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Joined</p>
                <p className="font-semibold">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={selectedUser.isActive ? "default" : "secondary"}>{selectedUser.isActive ? "Active" : "Inactive"}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <p className="text-lg font-semibold">{selectedUser.role}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="text-lg font-semibold">{selectedUser.phone || "N/A"}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button size="sm" className="sm:w-auto">Send Message</Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="sm:w-auto">Deactivate</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogTitle>Deactivate User?</AlertDialogTitle>
                  <AlertDialogDescription>This user will no longer be able to access the platform.</AlertDialogDescription>
                  <div className="flex gap-3 justify-end">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => { handleDelete(selectedUser._id); }} className="bg-destructive">Deactivate</AlertDialogAction>
                  </div>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <h2 className="text-xl md:text-2xl font-bold">Users ({filteredUsers.length})</h2>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search users..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="md:hidden space-y-3">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading users...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No users found</div>
        ) : (
          currentUsers.map((user) => (
            <Card key={user._id} className="hover:shadow-md transition-all">
              <CardContent className="pt-4">
                <p className="font-semibold text-sm mb-2">{user.fullName}</p>
                <div className="space-y-2 text-xs mb-3">
                  <div className="flex justify-between"><span className="text-muted-foreground">Email:</span> <span className="truncate">{user.email}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Joined:</span> <span>{new Date(user.createdAt).toLocaleDateString()}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Status:</span> <Badge variant={user.isActive ? "default" : "secondary"} className="text-xs">{user.isActive ? "Active" : "Inactive"}</Badge></div>
                </div>
                <Button variant="ghost" size="sm" className="w-full" onClick={() => setSelectedUser(user)}>
                  <Eye className="h-3 w-3 mr-1" /> View Details
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Card className="hidden md:block overflow-hidden">
        <CardContent className="pt-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Name</th>
                  <th className="text-left px-4 py-3 font-semibold">Email</th>
                  <th className="text-left px-4 py-3 font-semibold">Joined</th>
                  <th className="text-left px-4 py-3 font-semibold">Role</th>
                  <th className="text-left px-4 py-3 font-semibold">Status</th>
                  <th className="text-left px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="px-4 py-8 text-center text-gray-500">Loading...</td></tr>
                ) : filteredUsers.length === 0 ? (
                  <tr><td colSpan="6" className="px-4 py-8 text-center text-gray-500">No users found</td></tr>
                ) : (
                  currentUsers.map((user) => (
                    <tr key={user._id} className="border-b hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium">{user.fullName}</td>
                      <td className="px-4 py-3 text-xs">{user.email}</td>
                      <td className="px-4 py-3">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">{user.role}</td>
                      <td className="px-4 py-3"><Badge variant={user.isActive ? "default" : "secondary"}>{user.isActive ? "Active" : "Inactive"}</Badge></td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedUser(user)} className="gap-1">
                          <Eye className="h-4 w-4" /> View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {!loading && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredUsers.length}
          itemsPerPage={itemsPerPage}
        />
      )}
    </div>
  );
}

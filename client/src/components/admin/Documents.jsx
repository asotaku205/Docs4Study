import { useState, useEffect } from "react";
import { Plus, Search, Eye, Edit, Trash2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { documentsAPI } from "@/services/api";

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [editDoc, setEditDoc] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await documentsAPI.getAll({ limit: 100 });
      setDocuments(response.data.data || []);
    } catch (err) {
      console.error("Error fetching documents:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocs = documents.filter(d => 
    d.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id) => {
    try {
      await documentsAPI.delete(id);
      setDocuments(documents.filter(d => d._id !== id));
      setSelectedDoc(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete document");
    }
  };

  const handleSave = async (updatedDoc) => {
    try {
      const response = await documentsAPI.update(updatedDoc._id, updatedDoc);
      setDocuments(documents.map(d => d._id === updatedDoc._id ? response.data : d));
      if (selectedDoc?._id === updatedDoc._id) setSelectedDoc(response.data);
      setEditDoc(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update document");
    }
  };

  const handleAdd = async (title, category) => {
    if (!title.trim() || !category.trim()) return;
    try {
      const response = await documentsAPI.create({ 
        title, 
        category, 
        content: "No content yet" 
      });
      setDocuments([response.data, ...documents]);
      setShowAddForm(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add document");
    }
  };

  if (selectedDoc) {
    if (editDoc) {
      return (
        <div className="space-y-4">
          <Button variant="outline" onClick={() => { setSelectedDoc(null); setEditDoc(null); }} className="gap-2" size="sm">
            <ChevronRight className="h-4 w-4 rotate-180" /> Back
          </Button>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Edit Document</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input value={editDoc.title || ""} onChange={(e) => setEditDoc({...editDoc, title: e.target.value})} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Input value={editDoc.category || ""} onChange={(e) => setEditDoc({...editDoc, category: e.target.value})} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Views</label>
                  <Input type="number" value={editDoc.views || 0} onChange={(e) => setEditDoc({...editDoc, views: parseInt(e.target.value) || 0})} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Downloads</label>
                  <Input type="number" value={editDoc.downloads || 0} onChange={(e) => setEditDoc({...editDoc, downloads: parseInt(e.target.value) || 0})} className="mt-1" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button onClick={() => handleSave(editDoc)} size="sm">Save Changes</Button>
                <Button variant="outline" onClick={() => { setSelectedDoc(null); setEditDoc(null); }} size="sm">Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => setSelectedDoc(null)} className="gap-2" size="sm">
          <ChevronRight className="h-4 w-4 rotate-180" /> Back
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>{selectedDoc.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="font-semibold">{selectedDoc.category || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">File Size</p>
                <p className="font-semibold">{selectedDoc.fileSize || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Views</p>
                <p className="text-lg font-semibold">{selectedDoc.views || 0}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Downloads</p>
                <p className="text-lg font-semibold">{selectedDoc.downloads || 0}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button onClick={() => setEditDoc(selectedDoc)} size="sm" className="sm:w-auto">Edit</Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="sm:w-auto">Delete</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogTitle>Delete Document?</AlertDialogTitle>
                  <AlertDialogDescription>Cannot be undone.</AlertDialogDescription>
                  <div className="flex gap-3 justify-end">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(selectedDoc._id)} className="bg-destructive">Delete</AlertDialogAction>
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4">
        <h2 className="text-xl md:text-2xl font-bold">Documents ({filteredDocs.length})</h2>
        <Button className="gap-2 w-full sm:w-auto" size="sm" onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4" /> Upload
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search documents..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {showAddForm && (
        <Card className="bg-muted/30">
          <CardContent className="pt-4 md:pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4">
              <Input placeholder="Document title" id="doc-title" />
              <Input placeholder="Category" id="doc-category" />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => {
                const title = document.getElementById("doc-title")?.value || "";
                const category = document.getElementById("doc-category")?.value || "";
                if (title && category) {
                  handleAdd(title, category);
                  document.getElementById("doc-title").value = "";
                  document.getElementById("doc-category").value = "";
                }
              }}>Add Document</Button>
              <Button variant="outline" size="sm" onClick={() => setShowAddForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="md:hidden space-y-3">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading documents...</div>
        ) : filteredDocs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No documents found</div>
        ) : (
          filteredDocs.map((doc) => (
            <Card key={doc._id} className="hover:shadow-md transition-all">
              <CardContent className="pt-4">
                <p className="font-semibold text-sm mb-2">{doc.title}</p>
                <div className="space-y-2 text-xs mb-3">
                  <div className="flex justify-between"><span className="text-muted-foreground">Category:</span> <Badge variant="secondary">{doc.category || "N/A"}</Badge></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Views:</span> <span>{doc.views || 0}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Downloads:</span> <span>{doc.downloads || 0}</span></div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="flex-1" onClick={() => setSelectedDoc(doc)}>
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1" onClick={() => { setSelectedDoc(doc); setEditDoc(doc); }}>
                    <Edit className="h-3 w-3" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-destructive flex-1">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogTitle>Delete Document?</AlertDialogTitle>
                      <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                      <div className="flex gap-3 justify-end">
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(doc._id)} className="bg-destructive">Delete</AlertDialogAction>
                      </div>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
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
                  <th className="text-left px-4 py-3 font-semibold">Title</th>
                  <th className="text-left px-4 py-3 font-semibold">Category</th>
                  <th className="text-left px-4 py-3 font-semibold">Views</th>
                  <th className="text-left px-4 py-3 font-semibold">Downloads</th>
                  <th className="text-left px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="px-4 py-8 text-center text-gray-500">Loading...</td></tr>
                ) : filteredDocs.length === 0 ? (
                  <tr><td colSpan="5" className="px-4 py-8 text-center text-gray-500">No documents found</td></tr>
                ) : (
                  filteredDocs.map((doc) => (
                    <tr key={doc._id} className="border-b hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium">{doc.title}</td>
                      <td className="px-4 py-3"><Badge variant="secondary">{doc.category || "N/A"}</Badge></td>
                      <td className="px-4 py-3">{doc.views || 0}</td>
                      <td className="px-4 py-3">{doc.downloads || 0}</td>
                      <td className="px-4 py-3 flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedDoc(doc)}><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => { setSelectedDoc(doc); setEditDoc(doc); }}><Edit className="h-4 w-4" /></Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogTitle>Delete Document?</AlertDialogTitle>
                            <AlertDialogDescription>Cannot be undone.</AlertDialogDescription>
                            <div className="flex gap-3 justify-end">
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(doc._id)} className="bg-destructive">Delete</AlertDialogAction>
                            </div>
                          </AlertDialogContent>
                        </AlertDialog>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

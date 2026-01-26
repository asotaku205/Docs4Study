import { useState, useEffect } from "react";
import { categoriesAPI } from "../../services/api";
import { AdminHeader, AdminFormInput, AdminFormCheckbox, AdminDeleteModal, AdminStatusBadge } from "./shared/AdminLayout";
import { AdminTable, AdminTableHeader, AdminTableBody, AdminTableRow, AdminTableCell } from "./shared/AdminTable";
import { PrimaryButton, SecondaryButton, SmallButton, DeleteButton, BackButton } from "./shared/AdminButtons";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [activeCategory, setActiveCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesAPI.getAll({ includeDeleted: true });
      setCategories(response.data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (category) => {
    try {
      await categoriesAPI.create(category);
      await fetchCategories();
      setViewMode("list");
    } catch (error) {
      console.error("Error creating category:", error);
      alert("Failed to create category");
    }
  };

  const handleSave = async () => {
    try {
      await categoriesAPI.update(activeCategory._id, activeCategory);
      await fetchCategories();
      setViewMode("list");
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Failed to update category");
    }
  };

  const handleDelete = async () => {
    try {
      await categoriesAPI.delete(categoryToDelete._id);
      await fetchCategories();
      setCategoryToDelete(null);
      setViewMode("list");
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category");
    }
  };

  const handleRestore = async (category) => {
    try {
      await categoriesAPI.restore(category._id);
      await fetchCategories();
    } catch (error) {
      console.error("Error restoring category:", error);
      alert("Failed to restore category");
    }
  };

  const handleToggleActive = async (category) => {
    try {
      await categoriesAPI.update(category._id, { isActive: !category.isActive });
      await fetchCategories();
    } catch (error) {
      console.error("Error toggling category:", error);
      alert("Failed to toggle category");
    }
  };

  let content = null;

  if (viewMode === "add") {
    content = (
      <AddCategoryForm
        onAdd={handleAdd}
        onCancel={() => setViewMode("list")}
      />
    );
  } else if (viewMode === "edit") {
    content = (
      <EditCategoryForm
        category={activeCategory}
        onChange={setActiveCategory}
        onSave={handleSave}
        onCancel={() => setViewMode("list")}
      />
    );
  } else {
    content = (
      <CategoryList
        categories={categories}
        loading={loading}
        onAdd={() => setViewMode("add")}
        onEdit={(c) => {
          setActiveCategory(c);
          setViewMode("edit");
        }}
        onDelete={(c) => setCategoryToDelete(c)}
        onRestore={handleRestore}
        onToggleActive={handleToggleActive}
      />
    );
  }

  return (
    <>
      {content}

      <AdminDeleteModal
        isOpen={!!categoryToDelete}
        title="Delete category?"
        itemName={categoryToDelete?.name}
        onConfirm={handleDelete}
        onCancel={() => setCategoryToDelete(null)}
      />
    </>
  );
}

function CategoryList({ categories, loading, onAdd, onEdit, onDelete, onRestore, onToggleActive }) {
  return (
    <div>
      <AdminHeader 
        title={`Categories (${categories.length})`} 
        onAdd={onAdd}
        buttonText="New Category"
      />

      {loading ? (
        <p className="text-center py-8">Loading...</p>
      ) : (
        <AdminTable>
          <AdminTableHeader columns={['Name', 'Slug', 'Status', 'Actions']} />
          <AdminTableBody>
            {categories.map((c) => (
              <AdminTableRow key={c._id} isDeleted={c.isDeleted}>
                <AdminTableCell>{c.name}</AdminTableCell>
                <AdminTableCell isGray>{c.slug}</AdminTableCell>
                <AdminTableCell>
                  <AdminStatusBadge 
                    status={c.isDeleted ? 'Deleted' : c.isActive ? 'Active' : 'Inactive'}
                    isActive={c.isActive && !c.isDeleted}
                  />
                </AdminTableCell>
                <AdminTableCell>
                  {c.isDeleted ? (
                    <SmallButton onClick={() => onRestore(c)}>Restore</SmallButton>
                  ) : (
                    <>
                      <SmallButton onClick={() => onEdit(c)}>Edit</SmallButton>
                      {' '}
                      <SmallButton onClick={() => onToggleActive(c)}>
                        {c.isActive ? 'Deactivate' : 'Activate'}
                      </SmallButton>
                      {' '}
                      <DeleteButton onClick={() => onDelete(c)}>Delete</DeleteButton>
                    </>
                  )}
                </AdminTableCell>
              </AdminTableRow>
            ))}
          </AdminTableBody>
        </AdminTable>
      )}
    </div>
  );
}

function EditCategoryForm({ category, onChange, onSave, onCancel }) {
  return (
    <div>
      <BackButton onClick={onCancel} />
      <h2 className="text-xl font-bold mb-4">Edit Category</h2>

      <AdminFormInput 
        label="Name" 
        value={category.name} 
        onChange={(v) => onChange({ ...category, name: v })} 
      />
      <AdminFormInput 
        label="Slug" 
        value={category.slug} 
        onChange={(v) => onChange({ ...category, slug: v })} 
      />
      <AdminFormInput 
        label="Description" 
        value={category.description || ''} 
        onChange={(v) => onChange({ ...category, description: v })} 
      />

      <AdminFormCheckbox
        label="Active"
        checked={category.isActive}
        onChange={(checked) => onChange({ ...category, isActive: checked })}
      />

      <div className="mt-4 flex gap-3">
        <PrimaryButton onClick={onSave}>Save</PrimaryButton>
        <SecondaryButton onClick={onCancel}>Cancel</SecondaryButton>
      </div>
    </div>
  );
}

function AddCategoryForm({ onAdd, onCancel }) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  const handleNameChange = (value) => {
    setName(value);
    if (!slug) {
      setSlug(value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
    }
  };

  const handleSubmit = () => {
    if (!name) {
      alert("Name is required");
      return;
    }
    onAdd({ name, slug: slug || name.toLowerCase().replace(/\s+/g, '-'), description, isActive });
  };

  return (
    <div>
      <BackButton onClick={onCancel} />
      <h2 className="text-xl font-bold mb-4">Add New Category</h2>

      <AdminFormInput label="Name" value={name} onChange={handleNameChange} />
      <AdminFormInput label="Slug" value={slug} onChange={setSlug} />
      <AdminFormInput label="Description" value={description} onChange={setDescription} />

      <AdminFormCheckbox
        label="Active"
        checked={isActive}
        onChange={setIsActive}
      />

      <div className="mt-4 flex gap-3">
        <PrimaryButton onClick={handleSubmit}>Add</PrimaryButton>
        <SecondaryButton onClick={onCancel}>Cancel</SecondaryButton>
      </div>
    </div>
  );
}

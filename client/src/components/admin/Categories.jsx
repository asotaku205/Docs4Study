import { useState, useEffect } from "react";
import { categoriesAPI } from "../../services/api";
import { AdminHeader, AdminFormInput, AdminFormCheckbox, AdminDeleteModal, AdminStatusBadge } from "./shared/AdminLayout";
import { AdminTable, AdminTableHeader, AdminTableBody, AdminTableRow, AdminTableCell } from "./shared/AdminTable";
import { PrimaryButton, SecondaryButton, SmallButton, DeleteButton, BackButton } from "./shared/AdminButtons";
import { useLanguage } from "@/i18n/LanguageContext";

export default function Categories() {
  const { t } = useLanguage();
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
        t={t}
      />
    );
  } else if (viewMode === "edit") {
    content = (
      <EditCategoryForm
        category={activeCategory}
        onChange={setActiveCategory}
        onSave={handleSave}
        onCancel={() => setViewMode("list")}
        t={t}
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
        t={t}
      />
    );
  }

  return (
    <>
      {content}

      <AdminDeleteModal
        isOpen={!!categoryToDelete}
        title={t("admin.catMgmt.deleteTitle")}
        itemName={categoryToDelete?.name}
        onConfirm={handleDelete}
        onCancel={() => setCategoryToDelete(null)}
        cancelText={t("admin.catMgmt.cancel")}
        confirmText={t("admin.catMgmt.delete")}
      />
    </>
  );
}

function CategoryList({ categories, loading, onAdd, onEdit, onDelete, onRestore, onToggleActive, t }) {
  return (
    <div>
      <AdminHeader 
        title={`${t('admin.catMgmt.title')} (${categories.length})`} 
        onAdd={onAdd}
        buttonText={t('admin.catMgmt.newCategory')}
      />

      {loading ? (
        <p className="text-center py-8">{t('admin.catMgmt.loading')}</p>
      ) : (
        <AdminTable>
          <AdminTableHeader columns={[t('admin.catMgmt.name'), t('admin.catMgmt.slug'), t('admin.catMgmt.status'), t('admin.catMgmt.actions')]} />
          <AdminTableBody>
            {categories.map((c) => (
              <AdminTableRow key={c._id} isDeleted={c.isDeleted}>
                <AdminTableCell>{c.name}</AdminTableCell>
                <AdminTableCell isGray>{c.slug}</AdminTableCell>
                <AdminTableCell>
                  <AdminStatusBadge 
                    status={c.isDeleted ? t('admin.blogMgmt.deleted') : c.isActive ? t('admin.catMgmt.active') : t('admin.catMgmt.inactive')}
                    isActive={c.isActive && !c.isDeleted}
                  />
                </AdminTableCell>
                <AdminTableCell>
                  {c.isDeleted ? (
                    <SmallButton onClick={() => onRestore(c)}>{t('admin.catMgmt.restore')}</SmallButton>
                  ) : (
                    <>
                      <SmallButton onClick={() => onEdit(c)}>{t('admin.catMgmt.edit')}</SmallButton>
                      {' '}
                      <SmallButton onClick={() => onToggleActive(c)}>
                        {c.isActive ? t('admin.catMgmt.deactivate') : t('admin.catMgmt.activate')}
                      </SmallButton>
                      {' '}
                      <DeleteButton onClick={() => onDelete(c)}>{t('admin.catMgmt.delete')}</DeleteButton>
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

function EditCategoryForm({ category, onChange, onSave, onCancel, t }) {
  return (
    <div>
      <BackButton onClick={onCancel} />
      <h2 className="text-xl font-bold mb-4">{t('admin.catMgmt.editCategory')}</h2>

      <AdminFormInput 
        label={t('admin.catMgmt.name')} 
        value={category.name} 
        onChange={(v) => onChange({ ...category, name: v })} 
      />
      <AdminFormInput 
        label={t('admin.catMgmt.slug')} 
        value={category.slug} 
        onChange={(v) => onChange({ ...category, slug: v })} 
      />
      <AdminFormInput 
        label={t('admin.catMgmt.description')} 
        value={category.description || ''} 
        onChange={(v) => onChange({ ...category, description: v })} 
      />

      <AdminFormCheckbox
        label={t('admin.catMgmt.active')}
        checked={category.isActive}
        onChange={(checked) => onChange({ ...category, isActive: checked })}
      />

      <div className="mt-4 flex gap-3">
        <PrimaryButton onClick={onSave}>{t('admin.catMgmt.save')}</PrimaryButton>
        <SecondaryButton onClick={onCancel}>{t('admin.catMgmt.cancel')}</SecondaryButton>
      </div>
    </div>
  );
}

function AddCategoryForm({ onAdd, onCancel, t }) {
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
      alert(t('admin.catMgmt.nameRequired'));
      return;
    }
    onAdd({ name, slug: slug || name.toLowerCase().replace(/\s+/g, '-'), description, isActive });
  };

  return (
    <div>
      <BackButton onClick={onCancel} />
      <h2 className="text-xl font-bold mb-4">{t('admin.catMgmt.addCategory')}</h2>

      <AdminFormInput label={t('admin.catMgmt.name')} value={name} onChange={handleNameChange} />
      <AdminFormInput label={t('admin.catMgmt.slug')} value={slug} onChange={setSlug} />
      <AdminFormInput label={t('admin.catMgmt.description')} value={description} onChange={setDescription} />

      <AdminFormCheckbox
        label={t('admin.catMgmt.active')}
        checked={isActive}
        onChange={setIsActive}
      />

      <div className="mt-4 flex gap-3">
        <PrimaryButton onClick={handleSubmit}>{t('admin.catMgmt.add')}</PrimaryButton>
        <SecondaryButton onClick={onCancel}>{t('admin.catMgmt.cancel')}</SecondaryButton>
      </div>
    </div>
  );
}

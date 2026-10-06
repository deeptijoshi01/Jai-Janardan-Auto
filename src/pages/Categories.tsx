import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Pencil,
  Plus,
  Tags,
  Trash2,
  X,
} from "lucide-react";
import { fetchBrands, fetchCategories } from "../services/categoryBrandApi";
import {
  brandCategoryTypeFor,
  type Brand,
  type Category,
  type VehicleCategoryType,
} from "../types/categoryBrand";

const API_URL = "http://localhost:5000/api/brands";

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formCategory, setFormCategory] = useState<VehicleCategoryType | null>(null);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [brandName, setBrandName] = useState("");
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [categoryResult, brandResult] = await Promise.all([
        fetchCategories(),
        fetchBrands(undefined, true),
      ]);
      setCategories(categoryResult);
      setBrands(brandResult);
    } catch (loadError) {
      console.error("Category and brand management load error:", loadError);
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load categories and brands."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(loadData);
  }, [loadData]);

  const closeForm = () => {
    setFormCategory(null);
    setEditingBrand(null);
    setBrandName("");
    setFormError("");
  };

  const submitBrand = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;

    setSaving(true);
    setError("");
    setFormError("");
    setNotice("");
    try {
      const response = await fetch(
        editingBrand ? `${API_URL}/${editingBrand._id}` : API_URL,
        {
          method: editingBrand ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            editingBrand
              ? { name: brandName }
              : { name: brandName, categoryType: formCategory }
          ),
        }
      );
      const data = (await response.json().catch(() => null)) as {
        success?: boolean;
        message?: string;
      } | null;
      if (!response.ok || !data?.success) {
        throw new Error(data?.message || `Unable to save brand (${response.status}).`);
      }
      closeForm();
      setNotice(data.message || "Brand saved successfully.");
      await loadData();
    } catch (saveError) {
      console.error("Save brand error:", saveError);
      setFormError(
        saveError instanceof Error ? saveError.message : "Unable to save brand."
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleBrand = async (brand: Brand) => {
    setError("");
    setNotice("");
    try {
      const response = await fetch(`${API_URL}/${brand._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !brand.isActive }),
      });
      const data = (await response.json().catch(() => null)) as {
        success?: boolean;
        message?: string;
      } | null;
      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Unable to update brand status.");
      }
      setNotice(data.message || "Brand status updated.");
      await loadData();
    } catch (toggleError) {
      console.error("Toggle brand status error:", toggleError);
      setError(
        toggleError instanceof Error
          ? toggleError.message
          : "Unable to update brand status."
      );
    }
  };

  const deleteBrand = async (brand: Brand) => {
    if (!window.confirm(`Delete ${brand.name}? Brands used by vehicles cannot be deleted.`)) {
      return;
    }
    setError("");
    setNotice("");
    try {
      const response = await fetch(`${API_URL}/${brand._id}`, { method: "DELETE" });
      const data = (await response.json().catch(() => null)) as {
        success?: boolean;
        message?: string;
      } | null;
      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Unable to delete brand.");
      }
      setNotice(data.message || "Brand deleted.");
      await loadData();
    } catch (deleteError) {
      console.error("Delete brand error:", deleteError);
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete brand."
      );
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-[#9a7424]">Inventory management</p>
          <h1 className="jj-serif mt-1 text-3xl text-[#14110a] sm:text-4xl">
            Categories &amp; Brands
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[#6b665c]">
            Manage the categories and brand choices available across vehicle listings.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-[#efeae0] bg-white px-4 py-3 text-xs font-medium text-[#6b665c] shadow-sm">
          <Tags size={16} className="text-[#9a7424]" />
          Changes update vehicle forms and filters
        </div>
      </header>

      {error && (
        <div role="alert" className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}
      {notice && (
        <div role="status" className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          {notice}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-3 rounded-3xl border border-[#efeae0] bg-white px-6 py-16 text-sm text-[#6b665c]">
          <Loader2 size={18} className="animate-spin text-[#9a7424]" />
          Loading categories and brands...
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-3xl border border-[#efeae0] bg-white px-6 py-12 text-center text-sm text-[#6b665c]">
          No active categories are available.
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {categories.map((category) => {
            const categoryBrands = brands.filter(
              (brand) =>
                brand.categoryType === brandCategoryTypeFor(category.type) ||
                brand.categoryType === category.type
            );
            return (
              <section
                key={category._id}
                className="overflow-hidden rounded-3xl border border-[#efeae0] bg-white shadow-[0_1px_2px_rgba(20,16,8,0.04),0_14px_34px_-22px_rgba(20,16,8,0.18)]"
              >
                <div className="flex items-center justify-between gap-3 border-b border-[#f1ede2] bg-[#fbfaf6] px-5 py-5 sm:px-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9a7424]">
                      Category
                    </p>
                    <h2 className="jj-serif mt-1 text-xl text-[#14110a]">
                      {category.name}
                    </h2>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#6b665c] ring-1 ring-[#e9e3d7]">
                    {categoryBrands.filter((brand) => brand.isActive).length} active
                  </span>
                </div>

                <div className="divide-y divide-[#f1ede2] px-5 sm:px-6">
                  {categoryBrands.length === 0 ? (
                    <p className="py-6 text-sm text-[#8a8478]">
                      No brands have been added to this category yet.
                    </p>
                  ) : (
                    categoryBrands.map((brand) => (
                      <div
                        key={brand._id}
                        className="flex flex-wrap items-center justify-between gap-3 py-4"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span
                            className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                              brand.isActive ? "bg-emerald-500" : "bg-slate-300"
                            }`}
                          />
                          <div>
                            <p className="font-semibold text-[#14110a]">{brand.name}</p>
                            <p className="text-xs text-[#8a8478]">
                              {brand.isActive ? "Active" : "Inactive"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingBrand(brand);
                              setFormCategory(
                                brand.categoryType === "car" ||
                                  brand.categoryType === "cars"
                                  ? "cars"
                                  : "commercial"
                              );
                              setBrandName(brand.name);
                              setFormError("");
                            }}
                            className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold text-[#6b665c] transition hover:bg-[#f6f3ea] hover:text-[#14110a]"
                          >
                            <Pencil size={14} />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => void toggleBrand(brand)}
                            className="h-9 rounded-lg px-3 text-xs font-semibold text-[#8b6722] transition hover:bg-[#fbf5e6]"
                          >
                            {brand.isActive ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            type="button"
                            onClick={() => void deleteBrand(brand)}
                            aria-label={`Delete ${brand.name}`}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#8a8478] transition hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="border-t border-[#f1ede2] p-5 sm:px-6">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingBrand(null);
                      setBrandName("");
                      setFormCategory(category.type);
                      setFormError("");
                    }}
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#d9c89e] bg-white px-4 text-sm font-semibold text-[#71571f] transition hover:bg-[#fffaf0]"
                  >
                    <Plus size={16} />
                    Add {category.type === "commercial" ? "Commercial Vehicle" : "Car"} Brand
                  </button>
                </div>
              </section>
            );
          })}
        </div>
      )}

      {(formCategory || editingBrand) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#14110a]/45 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) closeForm();
          }}
        >
          <form
            onSubmit={submitBrand}
            className="w-full max-w-md rounded-3xl border border-[#efeae0] bg-white p-6 shadow-2xl sm:p-8"
            aria-labelledby="brand-modal-title"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9a7424]">
                  Brand management
                </p>
                <h2 id="brand-modal-title" className="jj-serif mt-1 text-2xl text-[#14110a]">
                  {editingBrand ? "Edit Brand" : `Add ${formCategory === "commercial" ? "Commercial Vehicle" : "Car"} Brand`}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                aria-label="Close"
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#8a8478] transition hover:bg-[#f6f3ea]"
              >
                <X size={18} />
              </button>
            </div>
            <label className="mt-6 block text-sm font-semibold text-[#14110a]">
              Brand name
              <input
                autoFocus
                required
                maxLength={60}
                value={brandName}
                onChange={(event) => setBrandName(event.target.value)}
                placeholder="e.g. Volvo"
                className="mt-2 h-12 w-full rounded-xl border border-[#e6e1d6] bg-[#fdfcf9] px-4 text-sm outline-none transition focus:border-[#c9a050] focus:bg-white focus:ring-4 focus:ring-[#c9a050]/15"
              />
            </label>
            {formError && (
              <p role="alert" className="mt-3 text-sm text-red-600">
                {formError}
              </p>
            )}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="h-11 rounded-xl border border-[#e6e1d6] px-4 text-sm font-semibold text-[#4d493f] transition hover:bg-[#faf8f3] disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || !brandName.trim()}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#14110a] px-5 text-sm font-semibold text-white transition hover:bg-[#2a251a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving && <Loader2 size={16} className="animate-spin" />}
                {editingBrand ? "Save changes" : "Add Brand"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Categories;

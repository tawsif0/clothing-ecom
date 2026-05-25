import React, { useEffect, useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { FiSave, FiLayers } from "react-icons/fi";
import axios from "axios";
import SearchableSelect from "../components/SearchableSelect";
import { useAuth } from "../hooks/useAuth";
import {
  loadAdminSettings,
  saveAdminSettings,
  selectAdminSettingsDraft,
  selectPublicSettingsState,
  updateAdminNestedField,
} from "../store/publicSettingsSlice";

const baseUrl = import.meta.env.VITE_API_URL;

const sectionClass = "space-y-4 p-5 md:p-6";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const ModuleCollectionSetup = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const isAdmin = user?.userType === "admin";

  const { isSaving, adminStatus } = useSelector(selectPublicSettingsState);
  const isAdminLoaded = adminStatus === "succeeded";
  const settings = useSelector(selectAdminSettingsDraft);

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      dispatch(loadAdminSettings());
    }
  }, [dispatch, isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;

    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await axios.get(`${baseUrl}/categories`, {
          headers: getAuthHeaders(),
        });

        const nextCategories = response.data?.success
          ? response.data.categories || []
          : Array.isArray(response.data?.data)
            ? response.data.data
            : Array.isArray(response.data)
              ? response.data
              : [];

        setCategories(nextCategories);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to load categories",
        );
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, [isAdmin]);

  const bentoCategories = useMemo(
    () => (Array.isArray(settings?.storefront?.bentoCategories) ? settings.storefront.bentoCategories : []),
    [settings?.storefront?.bentoCategories],
  );

  const updateBentoSlot = (index, value) => {
    const nextBento = [...bentoCategories];
    nextBento[index] = value;
    // ensure array has at least 3 elements
    while (nextBento.length < 3) nextBento.push("");
    
    dispatch(
      updateAdminNestedField({
        section: "storefront",
        key: "bentoCategories",
        value: nextBento,
      }),
    );
  };

  const saveSettings = async (event) => {
    event.preventDefault();

    try {
      const payload = {
        storefront: {
          ...(settings.storefront || {}),
          bentoCategories: bentoCategories,
          collectionButtonLabel: settings.storefront?.collectionButtonLabel || "Shop Now",
        },
      };

      await dispatch(saveAdminSettings(payload)).unwrap();
      toast.success("Collection settings saved successfully");
    } catch (error) {
      toast.error(error || "Failed to save settings");
    }
  };

  const BentoLinkSelector = ({ index, label }) => {
    const linkKey = `bento${index + 1}Link`;
    const linkValue = settings?.storefront?.[linkKey] || "";

    const currentCategoryId = useMemo(() => {
      if (!linkValue) return "";
      const match = linkValue.match(/[?&]category=([^&]+)/);
      return match ? match[1] : "";
    }, [linkValue]);

    const currentCategory = useMemo(() => {
      return categories.find((c) => c._id === currentCategoryId);
    }, [categories, currentCategoryId]);

    const [selectedType, setSelectedType] = useState("");

    useEffect(() => {
      if (currentCategory) {
        setSelectedType(currentCategory.type || "General");
      }
    }, [currentCategory]);

    const uniqueTypes = useMemo(() => {
      const types = new Set(categories.map((c) => c.type || "General"));
      return Array.from(types).sort();
    }, [categories]);

    const filteredCategories = useMemo(() => {
      if (!selectedType) return [];
      return categories.filter((c) => (c.type || "General") === selectedType);
    }, [categories, selectedType]);

    const handleTypeChange = (e) => {
      const nextType = e.target.value;
      setSelectedType(nextType);
      
      const firstCatOfNextType = categories.find((c) => (c.type || "General") === nextType);
      if (firstCatOfNextType) {
        const nextLink = `/shop?category=${firstCatOfNextType._id}`;
        dispatch(
          updateAdminNestedField({
            section: "storefront",
            key: linkKey,
            value: nextLink,
          })
        );
        updateBentoSlot(index, firstCatOfNextType._id);
      } else {
        dispatch(
          updateAdminNestedField({
            section: "storefront",
            key: linkKey,
            value: "",
          })
        );
        updateBentoSlot(index, "");
      }
    };

    const handleCategoryChange = (e) => {
      const nextCatId = e.target.value;
      const nextLink = nextCatId ? `/shop?category=${nextCatId}` : "";
      dispatch(
        updateAdminNestedField({
          section: "storefront",
          key: linkKey,
          value: nextLink,
        })
      );
      updateBentoSlot(index, nextCatId);
    };

    return (
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-black">{label}</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <span className="mb-1 block text-xs text-gray-400 font-medium">Category Type</span>
            <select
              value={selectedType}
              onChange={handleTypeChange}
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option value="" disabled>Select Category Type</option>
              {uniqueTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <span className="mb-1 block text-xs text-gray-400 font-medium">Category Name</span>
            <select
              value={currentCategoryId}
              onChange={handleCategoryChange}
              disabled={!selectedType}
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black disabled:bg-gray-50 disabled:text-gray-400"
            >
              <option value="">Select Category Name</option>
              {filteredCategories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        {linkValue && (
          <p className="text-xs text-gray-500 font-mono mt-1">
            Path: <span className="bg-gray-100 px-1.5 py-0.5 rounded">{linkValue}</span>
          </p>
        )}
      </div>
    );
  };

  const categoryOptions = useMemo(
    () =>
      categories.map((cat) => ({
        value: cat._id,
        label: cat.name,
      })),
    [categories],
  );

  if (adminStatus === "loading" || !isAdminLoaded) {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-black" />
    </div>
  );
}

if (adminStatus === "failed") {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <p className="mb-4 text-sm text-red-600">Failed to load collection settings.</p>
      <button
        onClick={() => dispatch(loadAdminSettings())}
        className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/80"
      >
        Retry
      </button>
    </div>
  );
}

  return (
    <div className="mx-auto pb-24">


      <form onSubmit={saveSettings} className="space-y-6">
        <div className={sectionClass}>
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FiLayers className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold text-black">Bento Grid (Shop by Collection)</h2>
              <p className="text-sm text-gray-500">
                Select exactly 3 categories to display in the Bento Grid section on the homepage.
              </p>
            </div>
          </div>

          <div className="space-y-8 pt-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-black">Section Main Title</label>
              <input type="text" value={settings?.storefront?.bentoSectionTitle ?? "Shop by Collection"} onChange={(e) => dispatch(updateAdminNestedField({ section: "storefront", key: "bentoSectionTitle", value: e.target.value }))} className="w-full rounded border px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-3 block text-base font-bold text-black border-b pb-2">
                Large Slot (Left)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-black">Title</label>
                  <input type="text" value={settings?.storefront?.bento1Title ?? "Abayas"} onChange={(e) => dispatch(updateAdminNestedField({ section: "storefront", key: "bento1Title", value: e.target.value }))} className="w-full rounded border px-3 py-2 text-sm" />
                </div>
                <div className="md:col-span-2 bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <BentoLinkSelector index={0} label="Select Category Collection" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-black">Button Text</label>
                  <input type="text" value={settings?.storefront?.bento1Button ?? "Shop Now"} onChange={(e) => dispatch(updateAdminNestedField({ section: "storefront", key: "bento1Button", value: e.target.value }))} className="w-full rounded border px-3 py-2 text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-black">Image</label>
                  <div className="flex gap-4 items-start">
                    <input type="text" value={settings?.storefront?.bento1Image ?? "https://lh3.googleusercontent.com/aida-public/AB6AXuC5UUcKbUdBxJGzwt6Y6w0nC4lMl8SlYeApwDyertv7ysFFlCdOkSWc0wJbVE4g6vN3JWjtkCy6y5-Bd-81PGJkzEMUugcx71C28J1a18OPm52_qoQqmhwOpGV2ueTilMYqJa6rIqU3w-1LpdSgQZ20UQ2AaulNQblEVC4V1mcqsNQvi5LD8nuQ150XQ4heVAzQel1w87TxLyjTZ3k_CWkw2PaBQlJHrP0lLN3UIr0NjqXkd3eYp7vX9zNbdlDaktYYbcDgoIWHPg"} onChange={(e) => dispatch(updateAdminNestedField({ section: "storefront", key: "bento1Image", value: e.target.value }))} className="flex-1 rounded border px-3 py-2 text-sm" />
                    <label className="cursor-pointer inline-flex items-center justify-center rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none">
                      Upload
                      <input type="file" className="sr-only" accept="image/*" onChange={async (e) => { const f = e.target.files?.[0]; if(!f) return; const fd = new FormData(); fd.append("image", f); const t = toast.loading("Uploading..."); try { const r = await axios.post(`${baseUrl}/auth/admin/settings/upload-generic-image`, fd, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "multipart/form-data" } }); if (r.data?.success) { toast.success("Uploaded!", { id: t }); dispatch(updateAdminNestedField({ section: "storefront", key: "bento1Image", value: r.data.imageUrl })); } } catch (err) { toast.error("Failed", { id: t }); } e.target.value = ''; }} />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-3 block text-base font-bold text-black border-b pb-2">
                Top Right Slot
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-black">Title</label>
                  <input type="text" value={settings?.storefront?.bento2Title ?? "Hijabs"} onChange={(e) => dispatch(updateAdminNestedField({ section: "storefront", key: "bento2Title", value: e.target.value }))} className="w-full rounded border px-3 py-2 text-sm" />
                </div>
                <div className="md:col-span-2 bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <BentoLinkSelector index={1} label="Select Category Collection" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-black">Button Text</label>
                  <input type="text" value={settings?.storefront?.bento2Button ?? "Shop Now"} onChange={(e) => dispatch(updateAdminNestedField({ section: "storefront", key: "bento2Button", value: e.target.value }))} className="w-full rounded border px-3 py-2 text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-black">Image</label>
                  <div className="flex gap-4 items-start">
                    <input type="text" value={settings?.storefront?.bento2Image ?? "https://lh3.googleusercontent.com/aida-public/AB6AXuAoVeEO8M2MibvoW5_7Yn6Zja7y0xjdos9XiGDILuw7rGFO8ivZSyie0Nv-6BkEkAEqCjgzFaTq50JU7-FISFBd0DWztbve6teas3j9C6pQH1CrAzDJvDQfnedozq1mlWFdgCxWV3BT2m-yU_DfvRN2WU68IgVkmUIoj9yIggcNR4rw3n6nbbBM5HN0VcsvfqwgvVS7AH99Pe5W8fp0ZkyIvTsqSTKpiHfkE5HSEeu7Z6L8ymFwa-1i8xytMjsWp2JuWJRsaHyNLA"} onChange={(e) => dispatch(updateAdminNestedField({ section: "storefront", key: "bento2Image", value: e.target.value }))} className="flex-1 rounded border px-3 py-2 text-sm" />
                    <label className="cursor-pointer inline-flex items-center justify-center rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none">
                      Upload
                      <input type="file" className="sr-only" accept="image/*" onChange={async (e) => { const f = e.target.files?.[0]; if(!f) return; const fd = new FormData(); fd.append("image", f); const t = toast.loading("Uploading..."); try { const r = await axios.post(`${baseUrl}/auth/admin/settings/upload-generic-image`, fd, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "multipart/form-data" } }); if (r.data?.success) { toast.success("Uploaded!", { id: t }); dispatch(updateAdminNestedField({ section: "storefront", key: "bento2Image", value: r.data.imageUrl })); } } catch (err) { toast.error("Failed", { id: t }); } e.target.value = ''; }} />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-3 block text-base font-bold text-black border-b pb-2">
                Bottom Right Slot
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-black">Title</label>
                  <input type="text" value={settings?.storefront?.bento3Title ?? "Evening Wear"} onChange={(e) => dispatch(updateAdminNestedField({ section: "storefront", key: "bento3Title", value: e.target.value }))} className="w-full rounded border px-3 py-2 text-sm" />
                </div>
                <div className="md:col-span-2 bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <BentoLinkSelector index={2} label="Select Category Collection" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-black">Button Text</label>
                  <input type="text" value={settings?.storefront?.bento3Button ?? "Explore Occasion"} onChange={(e) => dispatch(updateAdminNestedField({ section: "storefront", key: "bento3Button", value: e.target.value }))} className="w-full rounded border px-3 py-2 text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-black">Image</label>
                  <div className="flex gap-4 items-start">
                    <input type="text" value={settings?.storefront?.bento3Image ?? "https://lh3.googleusercontent.com/aida-public/AB6AXuA3Y9BACFAc5nuRyVlBAmzaul1gpgRjJkPR_S03SiwzyR9__cP3GKVPZdpw-nFl5DHyobfq5u8oW_HnJtXyB-fFztBI5ugbKmTsDkwNwKctFtNZgcSiZBRx3CEz7xb_2704wlaKRG3mkB0_wFoqhUvuSFsP7ghgoAPTCkU87um465wwPOnKz48P82av0VirT0yNvF5StowDKURAOKe202dWuUHw3eUNEsoqadR5NTkfgRnCuKErAeTmroLKmZoMsCxL8Jgqs3SFNw"} onChange={(e) => dispatch(updateAdminNestedField({ section: "storefront", key: "bento3Image", value: e.target.value }))} className="flex-1 rounded border px-3 py-2 text-sm" />
                    <label className="cursor-pointer inline-flex items-center justify-center rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none">
                      Upload
                      <input type="file" className="sr-only" accept="image/*" onChange={async (e) => { const f = e.target.files?.[0]; if(!f) return; const fd = new FormData(); fd.append("image", f); const t = toast.loading("Uploading..."); try { const r = await axios.post(`${baseUrl}/auth/admin/settings/upload-generic-image`, fd, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "multipart/form-data" } }); if (r.data?.success) { toast.success("Uploaded!", { id: t }); dispatch(updateAdminNestedField({ section: "storefront", key: "bento3Image", value: r.data.imageUrl })); } } catch (err) { toast.error("Failed", { id: t }); } e.target.value = ''; }} />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={sectionClass}>
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FiLayers className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold text-black">Our Heritage (Brand Story)</h2>
              <p className="text-sm text-gray-500">
                Manage the text and image for the Our Heritage section on the homepage.
              </p>
            </div>
          </div>
          
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-black">Subtitle</label>
                <input
                  type="text"
                  value={settings?.storefront?.brandStorySubtitle ?? "Our Heritage"}
                  onChange={(e) => dispatch(updateAdminNestedField({ section: "storefront", key: "brandStorySubtitle", value: e.target.value }))}
                  className="w-full rounded border px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-black">Title</label>
                <input
                  type="text"
                  value={settings?.storefront?.brandStoryTitle ?? "Grace in every thread, power in every silhouette."}
                  onChange={(e) => dispatch(updateAdminNestedField({ section: "storefront", key: "brandStoryTitle", value: e.target.value }))}
                  className="w-full rounded border px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-black">Description</label>
              <textarea
                rows={3}
                value={settings?.storefront?.brandStoryDescription ?? "Diamond Fashion Zone was founded on the belief that modesty and high-fashion are not mutually exclusive. We curate pieces that empower the modern woman to express her identity through timeless elegance and impeccable craftsmanship."}
                onChange={(e) => dispatch(updateAdminNestedField({ section: "storefront", key: "brandStoryDescription", value: e.target.value }))}
                className="w-full rounded border px-3 py-2 text-sm"
              />
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-black">Image</label>
                <div className="flex gap-4 items-start">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Paste Image URL or upload from PC..."
                      value={settings?.storefront?.brandStoryImage ?? "https://lh3.googleusercontent.com/aida-public/AB6AXuARPRJY_u09rnHZca23IThEl9X13LRn6iuoHtwuc4tX9SxKUdeHRIrum27ug8_oUHVxopD1EW0wK4ooGIQnjF2Grj7jrgP5qTy6Qv4olVH2p7qEiCf0zh5AubBKOIxpNzmCnAMqBUxhvNAkbb7r5ZnGiPl_ItTtPqYRTZVnYOet-ucXjZUtx1TXAsHninZcZbRTe9dzkfLiJSnOfCoxPa0Fx9uuSnHgqZ7X1vR8jKzc5LBfgjHtKrzjB_1F0Gx_GCgU-OGI1eFNIQ"}
                      onChange={(e) => dispatch(updateAdminNestedField({ section: "storefront", key: "brandStoryImage", value: e.target.value }))}
                      className="w-full rounded border px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="cursor-pointer inline-flex items-center justify-center rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
                      Upload from PC
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={async (event) => {
                          const file = event.target.files?.[0];
                          if (!file) return;

                          const formData = new FormData();
                          formData.append("image", file);

                          const toastId = toast.loading("Uploading image...");
                          try {
                            const response = await axios.post(`${baseUrl}/auth/admin/settings/brand-story-image-upload`, formData, {
                              headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                                "Content-Type": "multipart/form-data",
                              },
                            });

                            if (response.data?.success) {
                              toast.success("Image uploaded successfully", { id: toastId });
                              dispatch(updateAdminNestedField({ section: "storefront", key: "brandStoryImage", value: response.data.imageUrl }));
                            }
                          } catch (error) {
                            toast.error(error.response?.data?.error || "Failed to upload image", { id: toastId });
                          }
                          
                          event.target.value = ''; // Reset input
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-6 z-10">
          <div className="bg-white flex items-center justify-between p-4 shadow-xl">
            <p className="text-sm text-gray-500">
              Unsaved changes will be lost if you leave this page.
            </p>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 rounded-xl bg-black px-6 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
            >
              {isSaving ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              ) : (
                <FiSave className="h-4 w-4" />
              )}
              {isSaving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ModuleCollectionSetup;

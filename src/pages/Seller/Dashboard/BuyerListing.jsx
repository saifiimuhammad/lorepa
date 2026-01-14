import React, { useEffect, useState } from "react";
import { FaPlus, FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import axios from "axios";
import config from "../../../config";
import AddTrailerModal from "../Modal/AddTrailerModal";
import toast from "react-hot-toast";
import { buyerListingTranslations } from "./translation/buyerListingTranslations";

const BuyerListing = () => {
  const [trailers, setTrailers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("All");
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [selectedTrailer, setSelectedTrailer] = useState(null);

  const lang = localStorage.getItem("lang") || "fr";
  const t = (key) => buyerListingTranslations[lang]?.[key] || key;

  const filteredListings = trailers.filter((l) => {
    if (activeTab === "All") return true;
    if (activeTab === "Inactive")
      return l.status === "pending" || l.status === "decline";
    if (activeTab === "Active")
      return l.status !== "pending" && l.status !== "decline";
    return false;
  });

  const fetchTrailers = async () => {
    try {
      const result = await axios.get(
        `${config.baseUrl}/trailer/seller/${localStorage.getItem("userId")}`
      );
      setTrailers(result.data.data);
    } catch {
      toast.error(t("fetchError"));
    }
  };

  const deleteTrailer = async (id) => {
    if (!window.confirm(t("confirmDelete"))) return;

    setLoadingDelete(true);
    const toastId = toast.loading(t("deleting"));

    try {
      await axios.delete(`${config.baseUrl}/trailer/delete/${id}`);
      toast.success(t("deleted"), { id: toastId });
      setTrailers((prev) => prev.filter((t) => t._id !== id));
    } catch {
      toast.error(t("deleteError"), { id: toastId });
    }
    setLoadingDelete(false);
  };

  useEffect(() => {
    if (!isModalOpen) fetchTrailers();
  }, [isModalOpen]);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold">{t("myListings")}</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-5 py-2 bg-blue-600 text-white rounded-lg"
        >
          <FaPlus className="mr-2" /> {t("addTrailer")}
        </button>
      </div>

      <div className="flex border-b mb-6">
        {[
          { key: "All", label: t("all") },
          { key: "Active", label: t("active") },
          { key: "Inactive", label: t("inactive") },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`py-3 px-6 ${
              activeTab === tab.key
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y">
          <thead className="bg-gray-50">
            <tr>
              {[
                t("trailerDetails"),
                t("pricePerDay"),
                t("location"),
                t("category"),
                t("actions"),
              ].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-xs font-medium uppercase whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y">
            {filteredListings.map((l) => (
              <tr key={l._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 flex items-center space-x-4">
                  <img
                    src={l.images[0]}
                    className="h-14 w-24 rounded-lg border object-cover"
                  />
                  <div>
                    <div className="font-medium">{l.title}</div>
                    <span className="text-xs">
                      {t(
                        l.status === "pending"
                          ? "pending"
                          : l.status === "decline"
                          ? "decline"
                          : "activeStatus"
                      )}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-blue-600 whitespace-nowrap">
                  ${l.dailyRate} <span className="text-xs">{t("day")}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {[l.country, l.city].filter(Boolean).join(", ")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{l.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedTrailer(l);
                        setIsModalOpen(true);
                      }}
                      className="text-indigo-600"
                    >
                      <FaPencilAlt />
                    </button>
                    <button
                      onClick={() => deleteTrailer(l._id)}
                      disabled={loadingDelete}
                      className="text-red-600"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddTrailerModal
        trailerData={selectedTrailer}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default BuyerListing;

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaDownload, FaSearch, FaPlus } from 'react-icons/fa';
import { HiDownload } from 'react-icons/hi';
import { IoClose } from 'react-icons/io5';
import { MdOutlineDocumentScanner } from 'react-icons/md';
import config from '../../../config';
import toast from 'react-hot-toast';
import UploadNewDocumentModal from '../../../components/UploadNewDocumentModal';
import { formatReadableDate } from '../../../helpers/function';
import { documentPageTranslations } from './translation/documentPageTranslations';


// --- Document Card Component ---
const DocumentCard = ({ doc, onView, onDownload, translations }) => {
    const getChipStyles = (type) => {
        switch (type) {
            case "Contract":
                return "text-green-500 bg-green-100";
            case "Check-in Photos":
            case "Check-out Photos":
                return "text-purple-500 bg-purple-100";
            case "Report":
                return "text-red-500 bg-red-100";
            default:
                return "text-gray-500 bg-gray-100";
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case "Review":
                return "text-yellow-700";
            case "Expired":
                return "text-red-700";
            case "Completed":
            case "Active":
                return "text-green-700";
            default:
                return "text-gray-700";
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden">
            <div className={`p-6 flex flex-col justify-between h-48 bg-[#3B82F6]`}>
                <MdOutlineDocumentScanner className="text-white text-5xl" />
                <FaDownload onClick={() => onDownload(doc.fileUrl, doc.uploadType)} className="text-white text-xl cursor-pointer hover:text-gray-200 transition self-end" />
            </div>
            <div className="p-4 space-y-2">
                <p className="text-sm font-semibold truncate">{doc.uploadType}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getChipStyles(doc.type)}`}>
                    {doc.documentType}
                </span>
                <p className="text-xs text-gray-500">
                    <span className='font-bold text-black'>{translations.trailer}:</span> {doc.trailerId?.title}
                </p>
                <p className="text-xs text-gray-500">
                    <span className='font-bold text-black'>{translations.uploaded}:</span> {formatReadableDate(doc.createdAt)}
                </p>
                <p className="text-xs text-gray-500">
                    <span className='font-bold text-black'>{translations.status}:</span> <span className={`font-semibold ${getStatusStyles(doc.status)}`}>{doc.trailerId?.status}</span>
                </p>

                <div className='flex justify-between items-center pt-2'>
                    <button
                        onClick={() => onView(doc)}
                        className="px-5 text-[#2563EB] border border-blue-600 hover:bg-blue-50 text-sm font-medium py-1 rounded-md transition"
                    >
                        {translations.view}
                    </button>
                    <HiDownload onClick={() => onDownload(doc.fileUrl, doc.uploadType)} className='text-[#2563EB] text-xl' />
                </div>
            </div>
        </div>
    );
};

// --- Document Modal Component ---
const DocumentModal = ({ isOpen, onClose, document, translations }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-lg shadow-2xl">
                <div className="p-4 border-b flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-bold">{document?.documentType}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-green-100 text-green-700">
                            Contract
                        </span>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <IoClose className="text-xl" />
                    </button>
                </div>
                <div className="p-12 flex flex-col items-center justify-center space-y-6 min-h-[300px]">
                    <MdOutlineDocumentScanner className="text-gray-300 text-7xl" />
                    <p className="text-gray-500">Secure Document Viewer</p>
                    <button className="flex items-center justify-center px-6 py-2 bg-[#2563EB] text-white rounded-lg font-medium hover:bg-blue-700 transition shadow-md">
                        <HiDownload className="mr-2" />
                        {translations.download}
                    </button>
                </div>
            </div>
        </div>
    );
};

const documentTypes = [
    "Rental Contract",
    "Insurance Rider",
    "Damage Report",
    "Check-in Photos",
    "Check-out Photos",
];
// --- Main Page ---
const UserDocument = () => {
    const [isViewerModalOpen, setIsViewerModalOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [trailers, setTrailers] = useState([]);
    const [documentsData, setDocumentData] = useState([]);
    const [translations, setTranslations] = useState(() => {
        const lang = localStorage.getItem("lang") || "fr";
        return documentPageTranslations[lang] || documentPageTranslations.fr;
    });

    useEffect(() => {
        const handleLangChange = () => {
            const lang = localStorage.getItem("lang") || "fr";
            setTranslations(documentPageTranslations[lang] || documentPageTranslations.fr);
        };

        window.addEventListener("storage", handleLangChange);
        handleLangChange();

        return () => window.removeEventListener("storage", handleLangChange);
    }, []);

    const openViewerModal = (doc) => {
        setSelectedDocument(doc);
        setIsViewerModalOpen(true);
    };

    const closeViewerModal = () => {
        setIsViewerModalOpen(false);
        setSelectedDocument(null);
    };

    const openUploadModal = () => setIsUploadModalOpen(true);
    const closeUploadModal = () => setIsUploadModalOpen(false);

    const filteredDocuments = documentsData.filter(doc => {
        const matchesTab = activeTab === translations.tabs[0] || doc.documentType === activeTab;
        const matchesSearch = doc.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const fetchTrailers = async () => {
        try {
            const res = await axios.get(`${config.baseUrl}/trailer/all/approved`);
            setTrailers(res.data.data || []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch trailers.");
        }
    };

    const fetchDocuments = async () => {
        try {
            const userId = localStorage.getItem("userId");
            const res = await axios.get(`${config.baseUrl}/document/user/${userId}`);
            setDocumentData(res.data.data);
        } catch (err) {
            console.log(err);
            toast.error("Failed to fetch documents.");
        }
    };

    useEffect(() => {
        if (!isUploadModalOpen) {
            fetchTrailers();
            fetchDocuments();
        }
    }, [isUploadModalOpen]);

    const handleDownload = (fileUrl, fileName) => {
        if (!fileUrl) {
            toast.error("File not found");
            return;
        }
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = fileName || "document";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Download started");
    };

    return (
        <div className="min-h-screen">
            <div className="">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">{translations.myDocuments}</h1>
                    <button
                        onClick={openUploadModal}
                        className="flex items-center px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        <FaPlus className="mr-2" />
                        {translations.addNewDocument}
                    </button>
                </div>

                <div className="flex justify-between items-center mb-6 pb-4">
                    <div className="flex space-x-6 text-sm font-medium mb-[-0.5rem] border-b border-gray-200">
                        {translations.tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-3 border-b-2 transition duration-300 ${activeTab === tab
                                    ? 'border-blue-600 text-[#2563EB]font-semibold'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                            <input
                                type="text"
                                placeholder={translations.searchPlaceholder}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-64 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className='bg-[#F2F2F2] p-2 rounded-md'>
                            <FaCalendarAlt className="text-gray-500 text-xl cursor-pointer hover:text-[#2563EB] transition" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredDocuments.length > 0 ? (
                        filteredDocuments.map((doc) => (
                            <DocumentCard key={doc._id} doc={doc} onView={openViewerModal} onDownload={handleDownload} translations={translations} />
                        ))
                    ) : (
                        <p className="col-span-full text-center text-gray-500 py-10">
                            {translations.noDocumentsFound}
                        </p>
                    )}
                </div>

                <DocumentModal
                    isOpen={isViewerModalOpen}
                    onClose={closeViewerModal}
                    document={selectedDocument}
                    translations={translations}
                />

                <UploadNewDocumentModal
                    isOpen={isUploadModalOpen}
                    onClose={closeUploadModal}
                    trailers={trailers}
                    documentTypes={documentTypes}
                    translations={translations}
                />
            </div>
        </div>
    );
};

export default UserDocument;

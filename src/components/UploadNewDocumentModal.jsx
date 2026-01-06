import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import config from "../config";

const UploadNewDocumentModal = ({ isOpen, onClose, trailers, documentTypes, translations }) => {
    const [uploadType, setUploadType] = useState('Guest');
    const [selectedDocumentType, setSelectedDocumentType] = useState('');
    const [selectedTrailer, setSelectedTrailer] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);

    useEffect(() => {
        if (!isOpen) {
            setUploadType('Guest');
            setSelectedDocumentType('');
            setSelectedTrailer('');
            setDescription('');
            setFile(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleFileUpload = (e) => {
        const uploadedFile = e.target.files ? e.target.files[0] : null;
        if (uploadedFile && uploadedFile.size <= 10 * 1024 * 1024) {
            setFile(uploadedFile);
        } else if (uploadedFile) {
            toast.error("File size exceeds 10MB limit.");
        }
    };

    const handleUploadDocument = async () => {
        if (!selectedDocumentType || !selectedTrailer || !file) {
            toast.error("Please fill all required fields");
            return;
        }

        const userId = localStorage.getItem("userId");

        const form = new FormData();
        form.append("userId", userId);
        form.append("uploadType", uploadType);
        form.append("documentType", selectedDocumentType);
        form.append("trailerId", selectedTrailer);
        form.append("description", description);
        form.append("file", file);

        const loadingId = toast.loading("Uploading document...");

        try {
            await axios.post(`${config.baseUrl}/document/create`, form, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            toast.success("Document uploaded successfully!", { id: loadingId });
            onClose();

        } catch (err) {
            console.log(err);
            toast.error("Upload failed", { id: loadingId });
        }
    };



    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-xl shadow-2xl">
                <div className="p-5 border-b flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-800">
                        {translations.uploadModal.title}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                        <IoClose className="text-2xl" />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    <div>
                        <label htmlFor="documentType" className="block text-sm font-medium text-gray-700 mb-1">
                            {translations.uploadModal.selectDocumentType}
                        </label>
                        <select
                            id="documentType"
                            value={selectedDocumentType}
                            onChange={(e) => setSelectedDocumentType(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        >
                            <option value="">{translations.uploadModal.selectDocumentType}</option>
                            {documentTypes.map((type) => (
                                <option key={type} value={type}>
                                    {translations.documentTypes[type.replace(/\s+/g, '').toLowerCase()] || type}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="linkedTrailer" className="block text-sm font-medium text-gray-700 mb-1">
                            {translations.uploadModal.selectTrailer}
                        </label>
                        <select
                            id="linkedTrailer"
                            value={selectedTrailer}
                            onChange={(e) => setSelectedTrailer(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        >
                            <option value="">{translations.uploadModal.selectTrailer}</option>
                            {trailers.map((trailer) => (
                                <option key={trailer._id} value={trailer._id}>
                                    {trailer.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            {translations.uploadModal.description}
                        </label>
                        <textarea
                            id="description"
                            rows="3"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                        ></textarea>
                    </div>

                    <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition relative"
                        onClick={() => document.getElementById('file-upload').click()}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            e.preventDefault();
                            handleFileUpload({ target: { files: e.dataTransfer.files } });
                        }}
                    >
                        <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            onChange={handleFileUpload}
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        />
                        <FaCloudUploadAlt className="text-4xl text-gray-400 mx-auto mb-2" />
                        {file ? (
                            <p className="text-sm font-medium text-gray-700">
                                {file.name} ({Math.round(file.size / 1024)} KB)
                            </p>
                        ) : (
                            <p className="text-sm text-gray-500">
                                {translations.uploadModal.dragDrop}
                            </p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">{translations.uploadModal.maxFileSize}</p>
                    </div>
                </div>

                <div className="p-5 border-t flex justify-end">
                    <button
                        onClick={handleUploadDocument}
                        className="px-6 py-2 bg-[#2563EB] text-white rounded-lg font-medium hover:bg-blue-700 transition shadow-md disabled:bg-gray-400"
                        disabled={!selectedDocumentType || !selectedTrailer || !file}
                    >
                        {translations.uploadModal.uploadButton}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadNewDocumentModal;

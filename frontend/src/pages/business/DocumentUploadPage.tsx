import React, { useState, useEffect } from 'react';
import { documentService } from '../../services/documentService';
import { BusinessDocument } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Alert } from '../../components/Alert';
import { Badge } from '../../components/Badge';
import { EmptyState } from '../../components/EmptyState';
import { Upload, FileText, Download, Trash2, ShieldCheck, CheckCircle } from 'lucide-react';

export const DocumentUploadPage: React.FC = () => {
  const [documents, setDocuments] = useState<BusinessDocument[]>([]);
  const [documentType, setDocumentType] = useState('GST Certificate');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const res = await documentService.getDocuments();
      if (res.success) {
        setDocuments(res.data);
      }
    } catch (err) {
      console.error('Error loading documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        setAlert({ type: 'error', message: 'File size exceeds maximum 10MB limit. Please select a smaller file.' });
        setSelectedFile(null);
        e.target.value = '';
        return;
      }
      setSelectedFile(file);
      setAlert(null);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setAlert({ type: 'error', message: 'Please select a document file to upload.' });
      return;
    }

    setUploading(true);
    setAlert(null);

    try {
      const res = await documentService.uploadDocument(documentType, selectedFile);
      if (res.success) {
        setAlert({ type: 'success', message: 'Document uploaded securely to your enterprise vault!' });
        setSelectedFile(null);
        loadDocuments();
      }
    } catch (err: any) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Error uploading file.' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this document from your vault?')) return;
    try {
      const res = await documentService.deleteDocument(id);
      if (res.success) {
        setAlert({ type: 'success', message: 'Document deleted from vault.' });
        loadDocuments();
      }
    } catch (err: any) {
      setAlert({ type: 'error', message: 'Failed to delete document.' });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(2)} MB`;
    return `${(bytes / 1024).toFixed(2)} KB`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-gov space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-[#1B8354] uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-[#1B8354]" /> Secure Business Document Vault
        </div>
        <h1 className="text-2xl font-black text-[#172033]">Document Upload & Vault</h1>
        <p className="text-xs text-[#5E6B7D]">
          Upload required enterprise verification documents (GST, Udyam Registration, PAN, Financial Statements). Files are securely stored and restricted to authorized administrative review.
        </p>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {/* Upload Form Box */}
      <form onSubmit={handleUploadSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-gov space-y-4">
        <h2 className="text-base font-bold text-[#173B72] flex items-center gap-2">
          <Upload className="w-5 h-5 text-[#173B72]" />
          Upload New Verification Document
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="upload-category" className="label-field">Document Category *</label>
            <select
              id="upload-category"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="input-field"
            >
              <option value="GST Certificate">GST Registration Certificate</option>
              <option value="Udyam Registration">UDYAM / MSME Certificate</option>
              <option value="PAN Card">PAN Card (Entity / Proprietor)</option>
              <option value="Turnover Certificate">Turnover / Audited Balance Sheet</option>
              <option value="Project Report">Detailed Project Report (DPR)</option>
              <option value="Other">Other Certificate</option>
            </select>
          </div>

          <div>
            <label htmlFor="upload-file" className="label-field">Select File (PDF, PNG, JPG, Max 10MB) *</label>
            <input
              id="upload-file"
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
              className="input-field file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#E5EEF9] file:text-[#173B72] hover:file:bg-[#C7DBF2] cursor-pointer"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={uploading || !selectedFile}
            className="btn-primary text-xs py-2.5 px-6 font-bold"
          >
            <Upload className="w-4 h-4" />
            {uploading ? 'Uploading Securely...' : 'Upload Document'}
          </button>
        </div>
      </form>

      {/* Uploaded Files Vault Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-gov overflow-hidden space-y-4 p-6">
        <h2 className="text-base font-bold text-[#173B72] flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#173B72]" />
          Uploaded Verification Documents ({documents.length})
        </h2>

        {loading ? (
          <LoadingSpinner message="Fetching enterprise document vault..." />
        ) : documents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F7FA] text-[#5E6B7D] uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Document Type</th>
                  <th className="py-3 px-4">File Name</th>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Uploaded Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-[#F5F7FA]/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-[#172033]">{doc.documentType}</td>
                    <td className="py-3 px-4 text-[#5E6B7D] truncate max-w-xs">{doc.fileName}</td>
                    <td className="py-3 px-4 text-[#5E6B7D] font-mono">{formatFileSize(doc.fileSize)}</td>
                    <td className="py-3 px-4">
                      <Badge status={doc.status} />
                    </td>
                    <td className="py-3 px-4 text-[#5E6B7D]">
                      {new Date(doc.uploadedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await documentService.viewOrDownloadDocument(doc.fileUrl, doc.fileName);
                          } catch (err) {
                            setAlert({ type: 'error', message: 'Could not view file. Ensure file exists and server is running.' });
                          }
                        }}
                        className="inline-flex items-center gap-1 text-[#173B72] hover:text-[#2456A6] font-bold px-2.5 py-1 bg-[#E5EEF9] rounded"
                        title="Download / View File"
                      >
                        <Download className="w-3.5 h-3.5" />
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(doc.id)}
                        className="inline-flex items-center gap-1 text-[#C53030] hover:text-[#A82525] font-bold px-2.5 py-1 bg-[#FDF2F2] rounded"
                        title="Delete Document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No Documents Uploaded"
            description="You haven't uploaded any verification documents yet. Upload your GST or UDYAM registration certificate to request admin verification."
          />
        )}
      </div>
    </div>
  );
};

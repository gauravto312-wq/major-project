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
      setSelectedFile(e.target.files[0]);
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
        setAlert({ type: 'success', message: 'Document uploaded securely!' });
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
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      const res = await documentService.deleteDocument(id);
      if (res.success) {
        setAlert({ type: 'success', message: 'Document deleted.' });
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
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" /> Secure Business Document Vault
        </div>
        <h1 className="text-2xl font-black text-slate-900">Document Upload & Vault</h1>
        <p className="text-xs text-slate-500">
          Upload required enterprise verification documents (GST, Udyam Registration, PAN, Financial Statements). Files are securely stored and restricted to authorized review.
        </p>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {/* Upload Form Box */}
      <form onSubmit={handleUploadSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Upload className="w-5 h-5 text-blue-600" />
          Upload New Document
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label-field">Document Category *</label>
            <select
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
            <label className="label-field">Select File (PDF, PNG, JPG, Max 10MB) *</label>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
              className="input-field file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
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
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600" />
          Uploaded Verification Documents ({documents.length})
        </h2>

        {loading ? (
          <LoadingSpinner message="Fetching document vault..." />
        ) : documents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
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
                  <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{doc.documentType}</td>
                    <td className="py-3 px-4 text-slate-600 truncate max-w-xs">{doc.fileName}</td>
                    <td className="py-3 px-4 text-slate-500 font-mono">{formatFileSize(doc.fileSize)}</td>
                    <td className="py-3 px-4">
                      <Badge status={doc.status} />
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(doc.uploadedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-bold px-2 py-1 bg-blue-50 rounded"
                        title="Download / View File"
                      >
                        <Download className="w-3.5 h-3.5" />
                        View
                      </a>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-800 font-bold px-2 py-1 bg-rose-50 rounded"
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

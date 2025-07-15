import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { screenServices } from '../services/screenServices';
import EditScreenModal from '../models/EditScreenModal';
import DeleteConfirmationModal from '../models/DeleteConfirmationModal';
import toast from 'react-hot-toast';

const parseJsonField = (field) => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    try {
        return JSON.parse(field);
    } catch {
        return [];
    }
};

const Section = ({ icon, title, children }) => (
    <div className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center gap-2 mb-3">
            {icon}
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        </div>
        {children}
    </div>
);

const ScreenDetailPage = () => {
    const { screenId } = useParams();
    const navigate = useNavigate();
    const [screen, setScreen] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchScreen = async () => {
            setLoading(true);
            const res = await screenServices.getScreenById(screenId);
            if (res.success) setScreen(res.data);
            setLoading(false);
        };
        fetchScreen();
    }, [screenId]);

    const handleDeleteScreen = async () => {
        setIsDeleting(true);
        try {
            const response = await screenServices.deleteScreen(screenId);
            if (response.success) {
                toast.success('Screen deleted successfully!');
                navigate(-1);
            } else {
                toast.error(response.message || 'Failed to delete screen');
            }
        } catch (error) {
            console.error('Error deleting screen:', error);
            toast.error('Failed to delete screen');
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    const refreshScreen = async () => {
        const res = await screenServices.getScreenById(screenId);
        if (res.success) setScreen(res.data);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <span className="text-lg text-gray-500">Loading screen details...</span>
            </div>
        );
    }
    if (!screen) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <span className="text-lg text-gray-500">Screen not found.</span>
            </div>
        );
    }

    const actions = parseJsonField(screen.actions);
    const inputs = parseJsonField(screen.inputs);
    const staticContent = parseJsonField(screen.static_content);
    const navigations = parseJsonField(screen.navigations);
    const states = parseJsonField(screen.states);

    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            <div className="flex items-center justify-between mb-8">
                <button
                    className="text-blue-600 hover:underline flex items-center gap-1 font-medium sticky top-4 bg-white/80 z-10 px-2 py-1 rounded"
                    onClick={() => navigate(-1)}
                    style={{ boxShadow: '0 2px 8px 0 rgba(0,0,0,0.03)' }}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="px-4 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition flex items-center gap-2 shadow-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z" />
                        </svg>
                        Edit
                    </button>
                    <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition flex items-center gap-2 shadow-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                    </button>
                </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-10 mb-8">
                <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
                    <div className="flex flex-col items-center gap-3">
                        <div className={`flex items-center justify-center ${screen.type === 'mobile' ? 'w-[180px] h-[360px] border-4 border-gray-200 rounded-2xl bg-gray-50 shadow-lg' : 'w-[320px] h-[180px] border-2 border-gray-200 rounded-xl bg-gray-50 shadow'} overflow-hidden`}>
                            {screen.image_url ? (
                                <img
                                    src={`http://127.0.0.1:8000/storage/${screen.image_url}`}
                                    alt={screen.title}
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <span className="text-gray-400">No image</span>
                            )}
                        </div>
                        <span className={`px-3 py-1 rounded text-xs font-semibold mt-2 ${screen.type === 'mobile' ? 'bg-blue-100 text-blue-800' :
                            screen.type === 'web' ? 'bg-purple-100 text-purple-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                            {screen.type}
                        </span>
                        {screen.category && (
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium mt-1">{screen.category.name}</span>
                        )}
                    </div>
                    <div className="flex-1 w-full">
                        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">{screen.title}</h1>
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">Purpose</h2>
                        <p className="text-gray-700 mb-4 text-base">{screen.purpose || 'No description provided.'}</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Section
                        icon={<svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6" /></svg>}
                        title="Actions"
                    >
                        {actions.length === 0 ? <p className="text-gray-400 text-sm">No actions</p> : (
                            <ul className="space-y-2">
                                {actions.map((a, i) => (
                                    <li key={i} className="flex items-center gap-2 text-gray-700 text-sm">
                                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        <span>{a.label} {a.event && <span className="text-gray-400">({a.event})</span>}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Section>
                    <Section
                        icon={<svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20h9" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.5 3.5a2.121 2.121 0 113 3L7 19.5 3 21l1.5-4L16.5 3.5z" /></svg>}
                        title="Inputs"
                    >
                        {inputs.length === 0 ? <p className="text-gray-400 text-sm">No inputs</p> : (
                            <ul className="space-y-2">
                                {inputs.map((inp, i) => (
                                    <li key={i} className="flex items-center gap-2 text-gray-700 text-sm">
                                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v2m0 14v2m9-9h-2M5 12H3" /></svg>
                                        <span>{inp.label} <span className="text-gray-400">({inp.type})</span> {inp.required && <span className="text-red-500">*</span>}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Section>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Section
                        icon={<svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /></svg>}
                        title="Static Content"
                    >
                        {staticContent.length === 0 ? <p className="text-gray-400 text-sm">No static content</p> : (
                            <ul className="space-y-2">
                                {staticContent.map((c, i) => (
                                    <li key={i} className="flex items-center gap-2 text-gray-700 text-sm">
                                        <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /></svg>
                                        <span>{c}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Section>
                    <Section
                        icon={<svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>}
                        title="Navigations"
                    >
                        {navigations.length === 0 ? <p className="text-gray-400 text-sm">No navigations</p> : (
                            <ul className="space-y-2">
                                {navigations.map((n, i) => (
                                    <li key={i} className="flex items-center gap-2 text-gray-700 text-sm">
                                        <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                        <span>{n.label} <span className="text-gray-400">→ {n.target}</span></span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Section>
                </div>
                <Section
                    icon={<svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>}
                    title="States"
                >
                    {states.length === 0 ? <p className="text-gray-400 text-sm">No states</p> : (
                        <ul className="space-y-2">
                            {states.map((s, i) => (
                                <li key={i} className="flex items-center gap-2 text-gray-700 text-sm">
                                    <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>
                                    <span>{s}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </Section>
            </div>

            {/* Edit Screen Modal */}
            <EditScreenModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                screenId={screenId}
                projectId={screen.project_id}
                refresh={refreshScreen}
            />

            {/* Delete Screen Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteScreen}
                title="Delete Screen"
                message="Are you sure you want to delete this screen"
                itemName={screen.title}
                isLoading={isDeleting}
            />
        </div>
    );
};

export default ScreenDetailPage; 
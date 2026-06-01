import React, { useState } from 'react';
import apiClient from '../../api/client';
import { API_ENDPOINTS } from '../../api/endpoints';
import { FileText, Save, AlertCircle, Droplet, MapPin, AlertTriangle, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';

const CreateRequest = () => {
    const navigate = useNavigate();
    const toast = useToast();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        bloodGroup: '',
        unitsRequired: 1,
        city: '',
        urgency: 'MEDIUM'
    });

    const totalSteps = 3;

    const handleNext = () => {
        if (step === 1 && !formData.bloodGroup) {
            toast.showError('Please select a blood group');
            return;
        }
        if (step === 2 && (!formData.city || !formData.unitsRequired)) {
            toast.showError('Please fill in all details');
            return;
        }
        setStep(prev => prev + 1);
    };

    const handleBack = () => setStep(prev => prev - 1);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const payload = {
                bloodGroup: formData.bloodGroup,
                unitsRequired: parseInt(formData.unitsRequired, 10),
                city: formData.city,
                urgencyLevel: formData.urgency
            };

            await apiClient.post(API_ENDPOINTS.HOSPITAL.CREATE_REQUEST, payload);
            toast.showSuccess('Blood request created successfully!');
            navigate('/hospital/requests');
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || err.message || 'Creation failed';
            toast.showError(`Failed to create request: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    const urgencyColors = {
        'LOW': 'bg-blue-100 text-blue-700 border-blue-200',
        'MEDIUM': 'bg-amber-100 text-amber-700 border-amber-200',
        'HIGH': 'bg-red-100 text-red-700 border-red-200'
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in relative min-h-[600px]">
            {/* Header */}
            <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-gradient mb-3">Create Blood Request</h2>
                <p className="text-gray-600">Follow the steps to submit a new requirement</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-12 max-w-2xl mx-auto">
                <div className="flex justify-between mb-2">
                    {['Blood Details', 'Location & Urgency', 'Review'].map((label, idx) => (
                        <span key={idx} className={`text-xs font-bold uppercase tracking-wider ${step > idx ? 'text-blood-600' : 'text-gray-400'}`}>
                            {label}
                        </span>
                    ))}
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-blood transition-all duration-500 ease-out"
                        style={{ width: `${(step / totalSteps) * 100}%` }}
                    ></div>
                </div>
            </div>

            <div className="glass rounded-3xl p-8 md:p-12 shadow-xl border border-white/50 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full mix-blend-multiply blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full mix-blend-multiply blur-3xl -ml-16 -mb-16 pointer-events-none"></div>

                {/* Step 1: Blood Details */}
                {step === 1 && (
                    <div className="animate-slide-left space-y-8">
                        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <Droplet className="text-blood-600" /> Select Blood Group
                        </h3>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                                <button
                                    key={group}
                                    onClick={() => setFormData({ ...formData, bloodGroup: group })}
                                    className={`
                                        p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2
                                        ${formData.bloodGroup === group
                                            ? 'border-blood-500 bg-red-50 scale-105 shadow-md'
                                            : 'border-gray-100 hover:border-red-200 hover:bg-white'}
                                    `}
                                >
                                    <span className={`text-2xl font-bold ${formData.bloodGroup === group ? 'text-blood-600' : 'text-gray-700'}`}>
                                        {group}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2: Location & Urgency */}
                {step === 2 && (
                    <div className="animate-slide-left space-y-8">
                        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <MapPin className="text-blood-600" /> Location & Urgency
                        </h3>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">City / Location</label>
                                    <input
                                        type="text"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-blood-500 focus:ring-4 focus:ring-red-100 transition-all outline-none font-medium"
                                        placeholder="e.g. New York, Downtown Hospital"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Units Required</label>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => setFormData(prev => ({ ...prev, unitsRequired: Math.max(1, prev.unitsRequired - 1) }))}
                                            className="w-12 h-12 rounded-xl border-2 border-gray-200 flex items-center justify-center text-xl font-bold hover:bg-gray-50"
                                        >-</button>
                                        <span className="text-2xl font-bold w-12 text-center">{formData.unitsRequired}</span>
                                        <button
                                            onClick={() => setFormData(prev => ({ ...prev, unitsRequired: Math.min(50, prev.unitsRequired + 1) }))}
                                            className="w-12 h-12 rounded-xl border-2 border-gray-200 flex items-center justify-center text-xl font-bold hover:bg-gray-50"
                                        >+</button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-4">Urgency Level</label>
                                <div className="space-y-3">
                                    {[
                                        { value: 'LOW', label: 'Low - Routine Procedure', icon: <FileText size={18} /> },
                                        { value: 'MEDIUM', label: 'Medium - Surgery Required', icon: <AlertCircle size={18} /> },
                                        { value: 'HIGH', label: 'High - Emergency / Critical', icon: <AlertTriangle size={18} /> }
                                    ].map(opt => (
                                        <button
                                            key={opt.value}
                                            onClick={() => setFormData({ ...formData, urgency: opt.value })}
                                            className={`
                                                w-full p-4 rounded-xl border-2 flex items-center gap-3 transition-all
                                                ${formData.urgency === opt.value
                                                    ? 'border-transparent ring-2 ring-offset-2 ring-blood-500 ' + urgencyColors[opt.value]
                                                    : 'border-gray-100 hover:bg-gray-50'}
                                            `}
                                        >
                                            {opt.icon}
                                            <span className="font-semibold">{opt.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Review */}
                {step === 3 && (
                    <div className="animate-slide-left text-center max-w-lg mx-auto">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-slow">
                            <CheckCircle size={40} />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-800 mb-2">Almost Done!</h3>
                        <p className="text-gray-500 mb-8">Please review the details before submitting.</p>

                        <div className="bg-gray-50 rounded-2xl p-6 text-left space-y-4 mb-8 border border-gray-100 shadow-inner">
                            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                                <span className="text-gray-500 font-medium">Blood Group</span>
                                <span className="text-xl font-bold text-blood-600">{formData.bloodGroup}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                                <span className="text-gray-500 font-medium">Units</span>
                                <span className="text-lg font-bold text-gray-800">{formData.unitsRequired} Units</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                                <span className="text-gray-500 font-medium">Location</span>
                                <span className="text-lg font-bold text-gray-800">{formData.city}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 font-medium">Urgency</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${urgencyColors[formData.urgency]}`}>
                                    {formData.urgency}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-12 pt-6 border-t border-gray-100">
                    <button
                        onClick={step === 1 ? () => navigate('/hospital/requests') : handleBack}
                        className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-2"
                    >
                        {step === 1 ? 'Cancel' : <><ArrowLeft size={18} /> Back</>}
                    </button>

                    {step < totalSteps ? (
                        <button
                            onClick={handleNext}
                            className="bg-gradient-blood text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                        >
                            Next Step <ArrowRight size={18} />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-green-200 hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading ? 'Submitting...' : <><Save size={18} /> Submit Request</>}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateRequest;

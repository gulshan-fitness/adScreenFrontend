// AddBankAccountForm.jsx
import React, { useState } from 'react';
import { useContext } from 'react';
import { useEffect } from 'react';
import { Context } from '../Context_holder';
import axios from 'axios';

const AddBankAccount = () => {
    const {user, usertoken,notify} = useContext(Context)
    
    const [formData, setFormData] = useState({
        bankName: '',
        accountHolderName: '',
        accountType: 'SAVINGS',
        accountNumber: '',
        ifscCode: '',
        iban: '',
        swiftBic: '',
        routingNumber: '',
        sortCode: '',
        branchName: '',
        branchCode: '',
        isDefault: false,
    });

    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState('');

    useEffect(() => {
        if (user?._id) {
            setFormData(prev => ({
                ...prev,
                user: user._id
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!usertoken || !user) {
            notify('Please login to add bank account',0);
            return;
        }

        console.log(formData, "formData");

        

        // Basic validation
        if (!formData.bankName.trim()) {
            notify('Bank name is required',0);
            return;
        }
        if (!formData.accountHolderName.trim()) {
            notify('Account holder name is required',0);
            return;
        }
        if (!formData.accountNumber.trim() && !formData.iban.trim()) {
            notify('Please provide Account Number or IBAN',0);
            return;
        }

        setLoading(true);
        setSubmitError('');

        try {
            // Prepare data for API - remove undefined/null fields
            const submitData = {
                ...formData,
                iban: formData.iban ? formData.iban.toUpperCase() : '',
                swiftBic: formData.swiftBic ? formData.swiftBic.toUpperCase() : '',
                ifscCode: formData.ifscCode ? formData.ifscCode.toUpperCase() : ''
            };

            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_USER_URL}/addbankaccount`, 
                submitData,
                {
                    headers: {
                        Authorization: usertoken,
                       
                    }
                }
            );

            const { data } = response;
             notify(data.msg ,data.status);

            // Assuming your API returns similar structure
            if (data.status==1) {
               
                
                // Reset form
                setFormData({
                    bankName: '',
                    accountHolderName: '',
                    accountType: 'SAVINGS',
                    accountNumber: '',
                    ifscCode: '',
                    iban: '',
                    swiftBic: '',
                    routingNumber: '',
                    sortCode: '',
                    branchName: '',
                    branchCode: '',
                    isDefault: false,
                    user:user?._id
                });
                
                // You might want to redirect or update parent component
                // window.location.href = '/bank-accounts'; // Example redirect

            } else {
                setSubmitError(data.message || 'Failed to add bank account');
                notify(data.message || 'Failed to add bank account',0);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message 
                || error.response?.data?.error 
                || error.message 
                || 'Failed to add bank account';
            setSubmitError(errorMessage);
            notify(errorMessage,0);
            console.error('Add bank account error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto my-8 px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-7 text-white">
                    <h2 className="text-2xl font-bold">Add Bank Account</h2>
                    <p className="mt-1 text-blue-100">For receiving payments securely</p>
                </div>

                {/* Error Message */}
                {submitError && (
                    <div className="mx-6 mt-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm">{submitError}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Bank Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bank Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="bankName"
                            value={formData.bankName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="State Bank of India"
                            required
                        />
                    </div>

                    {/* Account Holder */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Account Holder Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="accountHolderName"
                            value={formData.accountHolderName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="Full name as per bank records"
                            required
                        />
                    </div>

                    {/* Account Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Account Type
                        </label>
                        <select
                            name="accountType"
                            value={formData.accountType}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition-all"
                        >
                            <option value="SAVINGS">Savings</option>
                            <option value="CURRENT">Current</option>
                            <option value="CHECKING">Checking</option>
                        </select>
                    </div>

                    {/* Account Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Account Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="accountNumber"
                            value={formData.accountNumber}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="XXXXXXXXXXXX"
                            required
                        />
                    </div>

                    {/* International (optional) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                IBAN
                            </label>
                            <input
                                type="text"
                                name="iban"
                                value={formData.iban}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono uppercase"
                                placeholder="DE89370400440532013000"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                SWIFT / BIC
                            </label>
                            <input
                                type="text"
                                name="swiftBic"
                                value={formData.swiftBic}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono uppercase"
                                placeholder="SBININBBXXX"
                            />
                        </div>
                    </div>

                    {/* India Specific */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                IFSC Code
                            </label>
                            <input
                                type="text"
                                name="ifscCode"
                                value={formData.ifscCode}
                                onChange={handleChange}
                                maxLength={11}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono uppercase"
                                placeholder="SBIN0001234"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Branch Name
                            </label>
                            <input
                                type="text"
                                name="branchName"
                                value={formData.branchName}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="Main Branch"
                            />
                        </div>
                    </div>

                    {/* US & UK Specific */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Routing Number (US)
                            </label>
                            <input
                                type="text"
                                name="routingNumber"
                                value={formData.routingNumber}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="123456789"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Sort Code (UK)
                            </label>
                            <input
                                type="text"
                                name="sortCode"
                                value={formData.sortCode}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="12-34-56"
                            />
                        </div>
                    </div>

                    {/* Branch Code */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Branch Code
                        </label>
                        <input
                            type="text"
                            name="branchCode"
                            value={formData.branchCode}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="Branch code"
                        />
                    </div>

                  

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3.5 px-4 rounded-xl font-medium text-white transition-all duration-200 flex items-center justify-center gap-2
                            ${loading 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-md hover:shadow-lg'
                            }`}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
                                </svg>
                                Processing...
                            </>
                        ) : (
                            'Add Bank Account'
                        )}
                    </button>
                </form>

                <div className="px-6 pb-6 text-center">
                    <p className="text-xs text-gray-500">
                        🔒 Your information is securely encrypted
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AddBankAccount;
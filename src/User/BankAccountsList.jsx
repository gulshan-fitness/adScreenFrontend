import { useContext } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '../Context_holder';
import { useEffect } from 'react';
import axios from 'axios';

const BankAccountsList = () => {
  const { user, FetchApi, usertoken ,notify} = useContext(Context);
  const navigate = useNavigate();
  
  const [BanksList, setBanksList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingDefault, setUpdatingDefault] = useState(null);
  const [deletingAccount, setDeletingAccount] = useState(null);

   const fetchBankAccounts = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await FetchApi(
          null,
          import.meta.env.VITE_USER_URL,
          "getuserbankaccounts",
          user?._id,
          null,
          null,
          usertoken
        );
        setBanksList(res || []);
      } catch (err) {
        console.error("Error fetching bank accounts:", err);
        setError('Failed to load bank accounts');
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    if (!usertoken || !user) return;
    
   
    
    fetchBankAccounts();
  }, [user, usertoken]);

const handleSetDefault = async (accountId) => {
  if (!accountId ||!usertoken) return;

  setUpdatingDefault(accountId);


  
        try {
          

            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_USER_URL}editdefaultbank/${user?._id}/${accountId}`, {},
                
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
               
                fetchBankAccounts();
             
                
             

            } else {
              
                notify(data.message || 'Failed to add bank account',0);
            }
        } catch (error) {
          
            notify(errorMessage,0);
            console.error('Add bank account error:', error);
        } 
         finally {
    setUpdatingDefault(null);
  }

 
};



  const handleRemoveAccount = async (accountId) => {
  if (!accountId || !usertoken) return;

  setDeletingAccount(accountId);

  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_USER_URL}deletebank/${accountId}`,{},
      {
        headers: { Authorization: usertoken }
      }
    );

    notify(data.msg || data.message, data.status);

    if (data.status === 1) {
      fetchBankAccounts();
    }
  } catch (error) {
    const errorMsg = 
      error.response?.data?.msg || 
      error.response?.data?.message || 
      'Failed to remove account';

    notify(errorMsg, 0);
    console.error('Remove account failed:', error);
  } finally {
    setDeletingAccount(null);
  }
};

  const defaultAccount = BanksList?.find(acc => acc?.isDefault);
  const otherAccounts = BanksList?.filter(acc => !acc?.isDefault);

  const formatAccountNumber = (number) => {
    if (!number) return 'N/A';
    return number.length > 4 ? `••••${number.slice(-4)}` : number;
  };

  const getAccountTypeBadge = (type) => {
    const types = {
      SAVINGS: { text: 'Savings', color: 'bg-blue-100 text-blue-800' },
      CURRENT: { text: 'Current', color: 'bg-purple-100 text-purple-800' },
      CHECKING: { text: 'Checking', color: 'bg-teal-100 text-teal-800' }
    };
    return types[type] || { text: type, color: 'bg-gray-100 text-gray-800' };
  };

  const getBankIcon = (bankName) => {
    const bankLower = bankName?.toLowerCase() || '';
    if (bankLower.includes('hdfc')) return '🏦';
    if (bankLower.includes('icici')) return '🏛️';
    if (bankLower.includes('sbi') || bankLower.includes('state bank')) return '🇮🇳';
    if (bankLower.includes('axis')) return '🔄';
    if (bankLower.includes('kotak')) return '💰';
    return '🏦';
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="pt-6 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Bank Accounts</h1>
            <p className="text-sm text-gray-600 mt-1 sm:mt-2">Manage your payment accounts securely</p>
          </div>
          <Link
            to="/userprofile/addbankaccount"
            className="inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg shadow-sm hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 gap-2 w-full sm:w-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add New Account
          </Link>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading your bank accounts...</p>
        </div>
      ) : BanksList?.length === 0 ? (
        /* Empty State */
        <div className="max-w-md mx-auto mt-12">
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-200 shadow-sm">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No bank accounts yet</h3>
            <p className="text-gray-600 mb-6">Add your first bank account to start receiving payments</p>
            <Link
              to="/userprofile/addbankaccount"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Bank Account
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Default Account & Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Default Account Card */}
            {defaultAccount && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-500 p-5 shadow-sm relative overflow-hidden">
                {/* Ribbon */}
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-bl-lg">
                  <div className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    DEFAULT
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-full shadow-sm">
                    <span className="text-xl">{getBankIcon(defaultAccount.bankName)}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-900 truncate">{defaultAccount.bankName}</h3>
                      {defaultAccount.branchName && (
                        <span className="text-sm text-gray-600">• {defaultAccount.branchName}</span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-4">
                      <span className="font-medium">Holder:</span> {defaultAccount.accountHolderName}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      <div className="bg-white/80 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Account Number</p>
                        <p className="font-mono font-semibold text-gray-900">
                          {formatAccountNumber(defaultAccount.accountNumber)}
                        </p>
                      </div>
                      
                      {defaultAccount.ifscCode && (
                        <div className="bg-white/80 rounded-lg p-3">
                          <p className="text-xs text-gray-500 mb-1">IFSC Code</p>
                          <p className="font-mono font-semibold text-gray-900">
                            {defaultAccount.ifscCode}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${getAccountTypeBadge(defaultAccount.accountType).color}`}>
                        {getAccountTypeBadge(defaultAccount.accountType).text}
                      </span>
                      {defaultAccount?.isVerified ? (
                        <span className="text-xs px-3 py-1.5 bg-green-100 text-green-800 rounded-full font-medium flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Verified
                        </span>
                      ) : (
                        <span className="text-xs px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-full font-medium">
                          Verification Pending
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other Accounts */}
            {otherAccounts.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Other Accounts</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {otherAccounts.map((account) => (
                    <div
                      key={account._id}
                      className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-gray-50 p-2.5 rounded-full">
                            <span className="text-lg">{getBankIcon(account.bankName)}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 line-clamp-1">{account.bankName}</h3>
                            {account.branchName && (
                              <p className="text-xs text-gray-500">{account.branchName}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleSetDefault(account._id)}
                            disabled={updatingDefault === account._id}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Set as default"
                          >
                            {updatingDefault === account._id ? (
                              <svg className="animate-spin w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>

                          <button
                            onClick={() => handleRemoveAccount(account._id)}
                            disabled={deletingAccount === account._id}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Remove account"
                          >
                            {deletingAccount === account._id ? (
                              <svg className="animate-spin w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Account Holder</p>
                          <p className="text-sm font-medium text-gray-900">{account.accountHolderName}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Account Number</p>
                            <p className="text-sm font-mono font-medium text-gray-900">
                              {formatAccountNumber(account.accountNumber)}
                            </p>
                          </div>
                          
                          {account.ifscCode && (
                            <div>
                              <p className="text-xs text-gray-500 mb-1">IFSC Code</p>
                              <p className="text-sm font-mono font-medium text-gray-900">
                                {account.ifscCode}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* International Fields */}
                        {(account.iban || account.swiftBic || account.routingNumber || account.sortCode) && (
                          <div className="pt-2 border-t border-gray-100">
                            <p className="text-xs text-gray-500 mb-2">International Details</p>
                            <div className="grid grid-cols-2 gap-2">
                              {account.iban && (
                                <div>
                                  <p className="text-xs text-gray-500">IBAN</p>
                                  <p className="text-xs font-mono truncate">{account.iban}</p>
                                </div>
                              )}
                              {account.swiftBic && (
                                <div>
                                  <p className="text-xs text-gray-500">SWIFT/BIC</p>
                                  <p className="text-xs font-mono">{account.swiftBic}</p>
                                </div>
                              )}
                              {account.routingNumber && (
                                <div>
                                  <p className="text-xs text-gray-500">Routing #</p>
                                  <p className="text-xs font-mono">{account.routingNumber}</p>
                                </div>
                              )}
                              {account.sortCode && (
                                <div>
                                  <p className="text-xs text-gray-500">Sort Code</p>
                                  <p className="text-xs font-mono">{account.sortCode}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2 pt-2">
                          <span className={`text-xs px-2.5 py-1 rounded-full ${getAccountTypeBadge(account.accountType).color}`}>
                            {getAccountTypeBadge(account.accountType).text}
                          </span>

                          {
                          account?.isVerified ? (
                            <span className="text-xs px-2.5 py-1 bg-green-100 text-green-800 rounded-full flex items-center gap-1">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Verified
                            </span>
                          ) : (
                            <span className="text-xs px-2.5 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                              Pending
                            </span>
                          )}


                           <button className="text-xs px-7 py-2 bg-blue-700 text-white rounded-md" onClick={()=>handleSetDefault(account?._id)}>
                           Set Default
                            </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Quick Stats & Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-6">
              <h3 className="font-semibold text-gray-900 mb-4">Account Summary</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Total Accounts</span>
                  <span className="font-semibold text-gray-900">{BanksList.length}</span>
                </div>
                
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Verified</span>
                  <span className="font-semibold text-green-600">
                    {BanksList.filter(acc => acc.isVerified).length}
                  </span>
                </div>
                
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Default Account</span>
                  <span className="font-semibold text-blue-600">
                    {defaultAccount ? 'Set' : 'Not Set'}
                  </span>
                </div>

                <div className="pt-2">
                  <p className="text-xs text-gray-500 mb-3">Account Types</p>
                  <div className="space-y-2">
                    {['SAVINGS', 'CURRENT', 'CHECKING'].map(type => {
                      const count = BanksList.filter(acc => acc.accountType === type).length;
                      if (count === 0) return null;
                      return (
                        <div key={type} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{getAccountTypeBadge(type).text}</span>
                          <span className="text-sm font-medium text-gray-900">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link
                  to="/userprofile/addbankaccount"
                  className="block w-full text-center py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium rounded-lg transition-colors mb-3"
                >
                  Add New Account
                </Link>
                
                <div className="flex items-center gap-3 text-sm text-gray-600 mt-4">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>All bank details are encrypted and secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankAccountsList;
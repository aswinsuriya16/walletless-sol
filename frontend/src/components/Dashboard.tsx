import { useState, useEffect } from 'react';
import api from '../utils/axios';

interface DashboardProps {
  token: string | null;
}

const Dashboard = ({ token }: DashboardProps) => {
  const [publicKey, setPublicKey] = useState('');
  const [balance, setBalance] = useState<number | null>(null);
  const [transferAmount, setTransferAmount] = useState('');
  const [transferTo, setTransferTo] = useState('');
  const [airdropAmount, setAirdropAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isTransferLoading, setIsTransferLoading] = useState(false);
  const [isAirdropLoading, setIsAirdropLoading] = useState(false);

  useEffect(() => {
    const storedPublicKey = localStorage.getItem('solanaPublicKey');
    if (storedPublicKey) {
      setPublicKey(storedPublicKey);
    }
  }, []);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsTransferLoading(true);

    try {
      const response = await api.post(
        '/user/transfer',
        {
          toAddress: transferTo,
          amount: parseFloat(transferAmount),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess('Transfer successful!');
      setTransferAmount('');
      setTransferTo('');
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Transfer failed');
    } finally {
      setIsTransferLoading(false);
    }
  };

  const handleAirdrop = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsAirdropLoading(true);

    try {
      const response = await api.post(
        '/user/airdrop',
        {
          publicKey,
          amount: parseFloat(airdropAmount),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess('Airdrop successful!');
      setAirdropAmount('');
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Airdrop failed');
    } finally {
      setIsAirdropLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-100 mb-2">Wallet Dashboard</h1>
          <p className="text-gray-400">Manage your Solana wallet and transactions</p>
        </div>

        {/* Wallet Info Card */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-gray-700/50 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-100">Wallet Information</h2>
            <p className="text-gray-400">Your Solana wallet details</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Public Key:</label>
              <div className="bg-gray-700/50 border border-gray-600 rounded-xl p-4">
                <p className="font-mono text-gray-100 break-all text-sm">
                  {publicKey || 'Loading...'}
                </p>
              </div>
            </div>
            
            {balance !== null && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Balance:</label>
                <div className="bg-gray-700/50 border border-gray-600 rounded-xl p-4">
                  <p className="text-gray-100 font-semibold text-lg">
                    {balance} SOL
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Notifications */}
        {error && (
          <div className="bg-red-900/30 border border-red-700/50 text-red-300 p-4 mb-6 rounded-xl">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-900/30 border border-green-700/50 text-green-300 p-4 mb-6 rounded-xl">
            {success}
          </div>
        )}

        {/* Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Transfer Card */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-100">Transfer SOL</h3>
              <p className="text-gray-400">Send SOL to another wallet</p>
            </div>
            
            <form onSubmit={handleTransfer} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">To Address</label>
                <input
                  type="text"
                  value={transferTo}
                  onChange={(e) => setTransferTo(e.target.value)}
                  className="w-full px-4 py-4 bg-gray-700/50 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter recipient address"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Amount (SOL)</label>
                <input
                  type="number"
                  step="0.000000001"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-full px-4 py-4 bg-gray-700/50 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                  placeholder="0.0"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isTransferLoading}
                className="w-full bg-gradient-to-r from-gray-700 to-gray-800 text-gray-100 py-4 px-6 rounded-xl font-semibold hover:from-gray-600 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border border-gray-600"
              >
                {isTransferLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  'Transfer SOL'
                )}
              </button>
            </form>
          </div>

          {/* Airdrop Card */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-100">Request Airdrop</h3>
              <p className="text-gray-400">Get test SOL from faucet</p>
            </div>
            
            <form onSubmit={handleAirdrop} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Amount (SOL)</label>
                <input
                  type="number"
                  step="0.000000001"
                  value={airdropAmount}
                  onChange={(e) => setAirdropAmount(e.target.value)}
                  className="w-full px-4 py-4 bg-gray-700/50 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                  placeholder="0.0"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isAirdropLoading}
                className="w-full bg-gradient-to-r from-gray-700 to-gray-800 text-gray-100 py-4 px-6 rounded-xl font-semibold hover:from-gray-600 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border border-gray-600"
              >
                {isAirdropLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  'Request Airdrop'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
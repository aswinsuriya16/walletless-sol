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
    }
  };

  const handleAirdrop = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

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
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">WALLET INFORMATION</h2>
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Public Key:</p>
          <p className="font-mono bg-gray-50 p-4 rounded-md break-all text-gray-900 border border-gray-200">
            {publicKey}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h3 className="text-2xl font-bold mb-6 text-gray-900">TRANSFER SOL</h3>
          <form onSubmit={handleTransfer} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Address
              </label>
              <input
                type="text"
                value={transferTo}
                onChange={(e) => setTransferTo(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (SOL)
              </label>
              <input
                type="number"
                step="0.000000001"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-900 transition-colors duration-200 font-medium"
            >
              TRANSFER
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <h3 className="text-2xl font-bold mb-6 text-gray-900">REQUEST AIRDROP</h3>
          <form onSubmit={handleAirdrop} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (SOL)
              </label>
              <input
                type="number"
                step="0.000000001"
                value={airdropAmount}
                onChange={(e) => setAirdropAmount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-900 transition-colors duration-200 font-medium"
            >
              REQUEST AIRDROP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
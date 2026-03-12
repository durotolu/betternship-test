import './App.css';
import React, { useState, useEffect } from 'react'

const api = 'http://localhost:5001/payments'

function App() {
  const [payments, setPayments] = useState([])
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [editingId, setEditingId] = useState(null);
  const [editingAmount, setEditingAmount] = useState('');
  const [editingDescription, setEditingDescription] = useState('');

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    const res = await fetch(api)
    const data = await res.json()
    setPayments(data)
  }
  
  const createPayment = async () => {
    if (!amount || !description) return
    await fetch(api, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ amount: Number(amount), description })
    });
    setAmount(''); setDescription('');
    fetchPayments();
  }

  const updatePayment = async (id) => {
    await fetch(`${api}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: Number(editingAmount),
        description: editingDescription
      })
    });
    setEditingId(null);
    fetchPayments();
  };

  const deletePayment = async (id) => {
    await fetch(`${api}/${id}`, { method: 'DELETE' });
    fetchPayments();
  };


  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white shadow-sm rounded-lg p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-slate-800">Payments</h1>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
          <button
            onClick={createPayment}
            className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 active:bg-sky-800 disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </div>

      <ol className="space-y-3">
        {payments.map(p => (
          <li
            key={p.id}
            className="flex items-start justify-between rounded-md border border-slate-200 bg-slate-50 px-4 py-3"
          >
            {editingId === p.id ? (
              <div className="flex-1 space-y-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="number"
                    value={editingAmount}
                    onChange={e => setEditingAmount(e.target.value)}
                    className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                  <input
                    type="text"
                    value={editingDescription}
                    onChange={e => setEditingDescription(e.target.value)}
                    className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => updatePayment(p.id)}
                    className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-800">${p.amount}</div>
                  <div className="text-xs text-slate-600">{p.description}</div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button 
                    onClick={() => { 
                      setEditingId(p.id); setEditingAmount(p.amount); 
                      setEditingDescription(p.description) 
                    }}
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deletePayment(p.id)}
                    className="rounded-md bg-rose-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-700"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default App;

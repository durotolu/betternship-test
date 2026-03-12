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
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-xl p-6 sm:p-8 space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Payments</h1>
            <p className="mt-1 text-sm text-slate-500">
              Track simple payments with amount and description.
            </p>
          </div>
        </header>

        <section className="space-y-3">
          <h2 className="text-sm font-medium text-slate-700">Add payment</h2>
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
              className="whitespace-nowrap rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 active:bg-sky-800 disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </section>

        <section className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-slate-700">History</h2>
            <span className="text-xs text-slate-400">
              {payments.length} {payments.length === 1 ? 'entry' : 'entries'}
            </span>
          </div>

          {payments.length === 0 ? (
            <p className="text-sm text-slate-400">
              No payments yet. Add your first payment above.
            </p>
          ) : (
            <ol className="space-y-3 max-h-80 overflow-y-auto pr-1">
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
                        <div className="text-sm font-medium text-slate-800">
                          ${p.amount}
                        </div>
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
          )}
        </section>
      </div>
    </div>
  );
}

export default App;

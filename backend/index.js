const express = require('express')
// const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const PORT = 5001

app.use(cors())
app.use(express.json())

let payments = [
  { "id": 1, "amount": 500, "description": "Payment for invoice #123", "date": "2025-12-23" },
  { "id": 2, "amount": 1200, "description": "Subscription fee", "date": "2025-12-22" }
]

// GET /payments → returns all payments
app.get('/payments', (req, res) => {
  res.json(payments)
})

// POST /payments → create a payment { id, amount, description, date } (accept JSON, append to in-memory array)
app.post('/payments', (req, res) => {
  const { amount, description } = req.body
  const payment = {
    id: payments[payments.length - 1]?.id + 1,
    date: new Date(),
    amount,
    description
  }
  payments.push(payment)
  res.status(201).json(payment)
})

// PATCH /payments/:id → update a payment’s amount and/or description
app.patch('/payments/:id', (req, res) => {
  const { id } = req.params
  const { amount, description } = req.body

  const payment = payments.find(payment => payment.id === parseInt(id))

  if (!payment) return res.status(404).json({ message: 'Payment not found'})
  
  payment.amount = amount
  payment.description = description

  res.json(payment)
})

// DELETE /payments/:id → delete a payment
app.delete('/payments/:id', (req, res) => {
  const { id } = req.params

  const paymentIndex = payments.findIndex(payment => payment.id === parseInt(id))

  if (paymentIndex === -1) return res.status(404).json({ message: 'Payment not found'})

  const paymentRemoved = payments.splice(paymentIndex, 1)

  res.json(paymentRemoved[0])
})

app.listen(PORT, () => {
  console.log(`backend running @ ${PORT}`)
})

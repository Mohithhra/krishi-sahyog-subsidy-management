const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ---------- SAMPLE DATA (Our Fake Database) ----------
let subsidies = [
  {
    record_id: 'S001',
    farmer_id: 'F001',
    farmer_name: 'Rajesh Kumar',
    phone_number: '0987654321',
    village: 'Ramnagar',
    input_type: 'Seed',
    entitlement_qty: 10,
    issued_qty: 5,
    balance: 5,
    issue_date: '2024-07-15',
    officer_name: 'Dr. Sharma'
  },
  {
    record_id: 'S002',
    farmer_id: 'F002',
    farmer_name: 'Suresh Patel',
    phone_number: '1234567890',
    village: 'Shyamnagar',
    input_type: 'Fertilizer',
    entitlement_qty: 20,
    issued_qty: 10,
    balance: 10,
    issue_date: '2024-07-20',
    officer_name: 'Dr. Sharma'
  },
  {
    record_id: 'S003',
    farmer_id: 'F003',
    farmer_name: 'Anita Sharma',
    phone_number: '0987123456',
    village: 'Ramnagar',
    input_type: 'Seed',
    entitlement_qty: 15,
    issued_qty: 0,
    balance: 15,
    issue_date: '2024-07-01',
    officer_name: 'Dr. Patel'
  },
  {
    record_id: 'S004',
    farmer_id: 'F004',
    farmer_name: 'Ramesh Singh',
    phone_number: '7890654321',
    village: 'Krishnanagar',
    input_type: 'Pesticide',
    entitlement_qty: 5,
    issued_qty: 3,
    balance: 2,
    issue_date: '2024-07-25',
    officer_name: 'Dr. Sharma'
  },
  {
    record_id: 'S005',
    farmer_id: 'F005',
    farmer_name: 'Sushma Devi',
    phone_number: '7890123456',
    village: 'Shyamnagar',
    input_type: 'Fertilizer',
    entitlement_qty: 25,
    issued_qty: 20,
    balance: 5,
    issue_date: '2024-07-10',
    officer_name: 'Dr. Patel'
  },
  {
    record_id: 'S006',
    farmer_id: 'F006',
    farmer_name: 'Mohan Singh',
    phone_number: '1234509876',
    village: 'Krishnanagar',
    input_type: 'Fertilizer',
    entitlement_qty: 30,
    issued_qty: 15,
    balance: 15,
    issue_date: '2024-07-28',
    officer_name: 'Dr. Sharma'
  },
  {
    record_id: 'S007',
    farmer_id: 'F007',
    farmer_name: 'Priya Patel',
    phone_number:'2345167809',
    village: 'Ramnagar',
    input_type: 'Seed',
    entitlement_qty: 8,
    issued_qty: 8,
    balance: 0,
    issue_date: '2024-07-05',
    officer_name: 'Dr. Patel'
  },
  {
    record_id: 'S008',
    farmer_id: 'F008',
    farmer_name: 'Ravi Kumar',
    phone_number:'9089786756',
    village: 'Shyamnagar',
    input_type: 'Pesticide',
    entitlement_qty: 4,
    issued_qty: 2,
    balance: 2,
    issue_date: '2024-07-18',
    officer_name: 'Dr. Sharma'
  },
  {
    record_id: 'S009',
    farmer_id: 'F009',
    farmer_name: 'Geeta Devi',
    phone_number:'1213141516',
    village: 'Krishnanagar',
    input_type: 'Fertilizer',
    entitlement_qty: 25,
    issued_qty: 0,
    balance: 25,
    issue_date: '2024-07-01',
    officer_name: 'Dr. Patel'
  },
  {
    record_id: 'S010',
    farmer_id: 'F010',
    farmer_name: 'Sunil Singh',
    phone_number:'2132435465',
    village: 'Ramnagar',
    input_type: 'Seed',
    entitlement_qty: 12,
    issued_qty: 10,
    balance: 2,
    issue_date: '2024-07-22',
    officer_name: 'Dr. Sharma'
  }
];

// ---------- API ENDPOINTS ----------

// GET all subsidies (with search)
app.get('/api/subsidies', (req, res) => {
  const search = req.query.search || '';
  
  if (search) {
    const filtered = subsidies.filter(s => 
      s.farmer_name.toLowerCase().includes(search.toLowerCase()) ||
      s.farmer_id.toLowerCase().includes(search.toLowerCase()) ||
      s.village.toLowerCase().includes(search.toLowerCase())
    );
    res.json(filtered);
  } else {
    res.json(subsidies);
  }
});

// GET a single subsidy
app.get('/api/subsidies/:record_id', (req, res) => {
  const record = subsidies.find(s => s.record_id === req.params.record_id);
  if (!record) {
    return res.status(404).json({ error: 'Record not found' });
  }
  res.json(record);
});

// POST (Add) a new subsidy
app.post('/api/subsidies', (req, res) => {
  const { farmer_id, farmer_name, phone_number,village, input_type, entitlement_qty, issued_qty, issue_date, officer_name } = req.body;
  
  // VALIDATION: Check all required fields
  if (!farmer_id || !farmer_name || !phone_number||!village || !input_type || !entitlement_qty || issued_qty === undefined) {
    return res.status(400).json({ error: 'All fields are required!' });
  }
  
  // VALIDATION: Issued qty cannot exceed entitlement
  if (parseFloat(issued_qty) > parseFloat(entitlement_qty)) {
    return res.status(400).json({ error: 'Issued quantity cannot exceed entitlement!' });
  }
  
  // Calculate balance automatically
  const balance = parseFloat(entitlement_qty) - parseFloat(issued_qty);
  
  // Create new record
  const newRecord = {
    record_id: `S${Date.now()}`,
    farmer_id,
    farmer_name,
    phone_number,
    village,
    input_type,
    entitlement_qty: parseFloat(entitlement_qty),
    issued_qty: parseFloat(issued_qty),
    balance,
    issue_date: issue_date || new Date().toISOString().split('T')[0],
    officer_name: officer_name || 'System'
  };
  
  subsidies.push(newRecord);
  res.status(201).json(newRecord);
});

// PUT (Update) an existing subsidy
app.put('/api/subsidies/:record_id', (req, res) => {
  const { record_id } = req.params;
  const { issued_qty } = req.body;
  
  const recordIndex = subsidies.findIndex(s => s.record_id === record_id);
  
  if (recordIndex === -1) {
    return res.status(404).json({ error: 'Record not found' });
  }
  
  const current = subsidies[recordIndex];
  
  // VALIDATION: Issued qty cannot exceed entitlement
  if (parseFloat(issued_qty) > current.entitlement_qty) {
    return res.status(400).json({ error: 'Issued quantity cannot exceed entitlement!' });
  }
  
  // Update balance
  const newBalance = current.entitlement_qty - parseFloat(issued_qty);
  
  subsidies[recordIndex] = {
    ...current,
    issued_qty: parseFloat(issued_qty),
    balance: newBalance
  };
  
  res.json(subsidies[recordIndex]);
});

// DELETE a subsidy
app.delete('/api/subsidies/:record_id', (req, res) => {
  const { record_id } = req.params;
  const recordIndex = subsidies.findIndex(s => s.record_id === record_id);
  
  if (recordIndex === -1) {
    return res.status(404).json({ error: 'Record not found' });
  }
  
  subsidies.splice(recordIndex, 1);
  res.json({ message: 'Record deleted successfully' });
});

// ---------- START THE SERVER ----------
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📋 Sample data loaded: ${subsidies.length} records`);
  console.log('\n📝 Available endpoints:');
  console.log(`   GET    /api/subsidies        - Get all records`);
  console.log(`   GET    /api/subsidies?search= - Search records`);
  console.log(`   POST   /api/subsidies        - Add a record`);
  console.log(`   PUT    /api/subsidies/:id    - Update a record`);
  console.log(`   DELETE /api/subsidies/:id    - Delete a record`);
});
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

  mongoose.connect(
    'mongodb+srv://<username>:<password>@cluster0.4zt85ht.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
).then(() => {
    console.log('Connected to database!')
}).catch((err) =>{
    console.log('Connection failed!', err)
});


const CitySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  block: { type: String, required: true },
});

const City = mongoose.model('City', CitySchema);

app.use(bodyParser.json());

const rateMatrix = {
  A: { A: 5, B: 5, C: 6, D: 8, E: 8, F: 9, G: 9, H: 11, I: 11 },
  B: { A: 5, B: 5, C: 6, D: 7, E: 7, F: 8, G: 8, H: 10, I: 12 },
  C: { A: 6, B: 6, C: 6, D: 5, E: 7, F: 8, G: 6, H: 7, I: 13 },
  D: { A: 8, B: 7, C: 5, D: 5, E: 7, F: 8, G: 6, H: 9, I: 13 },
  E: { A: 8, B: 7, C: 7, D: 7, E: 5, F: 8, G: 8, H: 9, I: 13 },
  F: { A: 9, B: 8, C: 8, D: 8, E: 8, F: 5, G: 5, H: 7, I: 7 },
  G: { A: 9, B: 8, C: 6, D: 6, E: 8, F: 5, G: 5, H: 7, I: 7 },
  H: { A: 11, B: 10, C: 7, D: 9, E: 9, F: 7, G: 7, H: 5, I: 7 },
  I: { A: 11, B: 12, C: 13, D: 13, E: 13, F: 7, G: 7, H: 7, I: 5 },
};

// Helper function to calculate surcharges
function calculateSurcharges(baseFreight, invoiceValue, riskType) {
  const fuelSurcharge = baseFreight * 0.2; // 20% of base freight
  const dktCharge = 100;

  let fovCharge;
  if (riskType === 'owner') {
    fovCharge = Math.max(invoiceValue * 0.005, 50);
  } else if (riskType === 'carrier') {
    fovCharge = Math.max(invoiceValue * 0.02, 300);
  } else {
    throw new Error('Invalid riskType');
  }

  // ODA Charges (placeholder - implement based on your logic)
  const odaCharge = 0; 

  // Appointment Charges (placeholder - implement based on your logic)
  const appointmentCharge = 0;

  return { fuelSurcharge, dktCharge, fovCharge, odaCharge, appointmentCharge };
}

// API Endpoint
app.post('/calculate-rate', async (req, res) => {
  try {
    const { origin, destination, weight, invoiceValue, riskType } = req.body;

    // Fetch city blocks from database
    const originCity = await City.findOne({ name: origin });
    const destinationCity = await City.findOne({ name: destination });

    if (!originCity || !destinationCity) {
      return res.status(400).json({ error: 'Invalid origin or destination' });
    }

    const originBlock = originCity.block;
    const destinationBlock = destinationCity.block;

    const minChargeableWeight = 40;
    const minFreightCharge = 400;
    const baseFreightPerKg = rateMatrix[originBlock][destinationBlock];
    const chargeableWeight = Math.max(weight, minChargeableWeight);
    const baseFreight = Math.max(chargeableWeight * baseFreightPerKg, minFreightCharge);

    // Calculate surcharges
    const { fuelSurcharge, dktCharge, fovCharge, odaCharge, appointmentCharge } = calculateSurcharges(baseFreight, invoiceValue, riskType);

    // Calculate total cost
    const totalCost = baseFreight + fuelSurcharge + dktCharge + fovCharge + odaCharge + appointmentCharge;

    res.json({
      baseFreight,
      fuelSurcharge,
      dktCharge,
      fovCharge,
      odaCharge,
      appointmentCharge,
      totalCost,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
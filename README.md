# Shipment_rates-Project
<p>This shipment rate calculation project is built using NodeJS, ExpressJS and MongoDB. For getting response at end I used Postman.</p>
<h2>Inserting City Data into MongoDB</h2>

<p>This JavaScript code demonstrates how to insert multiple city documents into a MongoDB collection using the <code>db.cities.insertMany()</code> command.</p>

<h3>Code Example:</h3>

<pre><code>
db.cities.insertMany([
  { name: "Indore", block: "A" },
  { name: "Raipur", block: "F" },
  { name: "Bhopal", block: "B" },
  { name: "Mahakoshal", block: "C" },
  { name: "Chambal", block: "D" },
  { name: "Nagar", block: "E" },
  { name: "Vidisha", block: "G" },
  { name: "Rest of CG", block: "H" }
]);
</code></pre>

<h3>Explanation:</h3>

<ul>
  <li><code>db.cities.insertMany()</code>: This is the MongoDB command used to insert multiple documents into the "cities" collection in a single operation.</li>
  <li>The array within <code>insertMany()</code> contains the documents to be inserted.</li>
  <li>Each document has two fields:</li>
    <ul>
      <li><code>name</code>: The name of the city.</li>
      <li><code>block</code>: The corresponding block for that city as defined in the rate matrix.</li>
    </ul>
</ul>

<h3>Notes:</h3>

<ul>
  <li>This code assumes that the "cities" collection already exists in your MongoDB database.</li>
  <li>You can modify the <code>name</code> and <code>block</code> values in the array to match your specific city and block mappings.</li>
</ul>
<p>This query will efficiently insert all the necessary city data into your database for the shipment rate calculation API.</p>![Screenshot 2024-12-29 194302]
<h1>The Sample output for request and response in Postman</h1>
(https://github.com/user-attachments/assets/dd70e4d8-c594-4eb2-8e1a-11d5f7b0f51e)

<h2>Request</h2>
<pre><code>
{
  "origin": "Indore",
  "destination": "Raipur",
  "weight": 55,
  "invoiceValue": 15000,
  "riskType": "carrier"
}
</code></pre>

<h2>Response</h2>
<pre><code>
{
  "baseFreight": 495,
  "fuelSurcharge": 99,
  "dktCharge": 100,
  "fovCharge": 300,
  "odaCharge": 0, 
  "appointmentCharge": 0, 
  "totalCost": 1094
}
</code></pre>
<h4>Next Steps:-</h4>
<p>Run the JS file and give the necessary path in postman with JSON request to give response.</p>

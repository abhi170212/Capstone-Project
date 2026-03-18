const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const recommendationsRouter = require('./routes/recommendations');
const itinerariesRouter = require('./routes/itineraries');

app.use('/api/recommendations', recommendationsRouter);
app.use('/api/itineraries', itinerariesRouter);

app.listen(port, () => {
  console.log(`Backend server is running on port ${port}`);
});

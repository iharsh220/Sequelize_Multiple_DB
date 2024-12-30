const express = require("express");
const bodyParser = require("body-parser");
const companyRoutes = require("./routes/company");
require("dotenv").config();

const app = express();

app.use(bodyParser.json());
app.use("/api/company", companyRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

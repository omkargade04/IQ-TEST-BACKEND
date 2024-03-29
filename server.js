const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));


//ENDPOINTS
app.use("/api/user", require("./routes/user.routes"));
app.use("/api/admin", require("./routes/admin.routes"));

app.get("/", (req, res) => {
    res.status(200).json(`Server is running...`);
  });
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
const express = require("express");
const app = express();
const port = 3000;

// app.get('/',(req,res) =>{

//     res.send('haloo deck')

// })
  
const bodyPs = require('body-parser'); //import body parser
app.use(bodyPs.urlencoded({extended: false}));
app.use(bodyPs.json());

const mhsRouter = require("./routes/mahasiswa");
app.use("/api/mhs", mhsRouter);

app.listen(port, () => {
  console.log(`aplikasi berjalan di http:://localhost:${port}`);
});

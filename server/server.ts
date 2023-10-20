import { app } from "./app";
import connectDatabase from "./utils/db";
require("dotenv").config();

//server config
app.listen(process.env.PORT, () => {
    console.log(`Server running at ${process.env.PORT}`);
    connectDatabase();
});
  
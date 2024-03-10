const mongoose = require('mongoose'); 
mongoose.set("strictQuery", false);
const dbUrl = process.env.ATLAS
export const db = mongoose.connect(`${dbUrl}`,)
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));
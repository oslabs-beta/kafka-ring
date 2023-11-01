// server.js
const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const metricsRoutes = require('./routes/metricsRoutes');
const session = require('express-session');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use cookie-parser middleware to parse cookies
app.use(cookieParser());



// get, set user data in db
app.use('/users', userRoutes);
// get metrics from prometheus server
app.use('/metrics', metricsRoutes);

// global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// const randomSecret = require('crypto').randomBytes(64).toString('hex');
// app.use(
//   session({
//     secret: randomSecret,
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//       secure: false, // Adjust to true in a production environment with HTTPS
//       httpOnly: true, // Make the cookie accessible only via HTTP requests (recommended)
//       path: '/', // Cookie is valid for all routes
//     },
//   })
// );
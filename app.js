// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Create Express app
const app = express();

// Set up middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://admin:2DpBfN8UnsdQ4RQW@cluster0.knu0odm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch((err) => {
  console.error('Error connecting to MongoDB Atlas:', err.message);
});

// Define Mongoose schema and model
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

const User = mongoose.model('User', userSchema);

// Routes
app.get('/', (req, res) => {
  res.render('default');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const newUser = new User({ username: email, password });
    await newUser.save();
    res.redirect('/login');
  } catch (err) {
    console.error('Error saving user:', err.message);
    res.redirect('/');
  }
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ username: email });
    if (user) {
      if (user.password === password) {
        res.send('<script>alert("Login successful"); window.location.href="/welcome";</script>');
      } else {
        res.send('<script>alert("Invalid password. Please try again."); window.location.href="/login";</script>');
      }
    } else {
      res.send('<script>alert("Invalid email. Please try again."); window.location.href="/login";</script>');
    }
  } catch (err) {
    console.error('Error finding user:', err.message);
    res.redirect('/login');
  }
});

app.get('/welcome', (req, res) => {
  res.render('welcome');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

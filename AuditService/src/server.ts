import app from './app';

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Audit Service running on port ${PORT}`);
}); 
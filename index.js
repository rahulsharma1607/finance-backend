const { app, PORT } = require("./src/app");

app.listen(PORT, () => {
  console.log(`Finance backend running on port ${PORT}`);
});

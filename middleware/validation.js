// Middleware to check name length
const checkNameLength = (req, res, next) => {
  const { name } = req.body;

  console.log("1st");
  if (!name) return res.status(400).json({ error: "Name is required" });
  console.log("Name Length:", name.length);
  if (name.length < 3)
    return res
      .status(400)
      .json({ error: "Name must be at least 3 characters long" });
  next();
};

module.exports = {
  checkNameLength,
};

exports.signupUser = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed, Incorrect data entered.");
    error.statusCode = 422;
    error.errors = errors.array();
    throw error;
  }

  const email = req.body.email;
  const firstName = req.body.firstName;
  const password = req.body.password;
  const lastName = req.body.lastName;
  const role = req.body.role;
  let token;

  if (role !== "ROLE_USER") {
    const error = new Error(
      "Signing up an user should have a role of ROLE_USER"
    );
    error.statusCode = 500;
    throw error;
  }

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      token = crypto.randomBytes(32).toString("hex");

      const account = new Account({
        role: role,
        email: email,
        password: hashedPassword,
        accountVerifyToken: token,
        accountVerifyTokenExpiration: Date.now() + 3600000,
      });
      return account.save();
    })
    .then((savedAccount) => {
      const user = new User({
        firstName: firstName,
        lastName: lastName,
        account: savedAccount,
      });
      return user.save();
    })

    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

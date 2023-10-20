const Validator = require("validatorjs");

const validator = async (body, rules, customMessages, callback) => {
  const validation = new Validator(body, rules, customMessages);
  validation.passes(() => callback(null, true));
  validation.fails(() => callback(validation.errors, false));
};

const saveCreatedPlayer = async (req, res, next) => {
  const validationRule = {
    firstName: "required|string",
    lastName: "required|string",
    jerseyNumber: "required|string",
    position: "string",
    age: "string",
    height: "required|string",
    team: "string",
  };

  await validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: "Validation failed",
        data: err,
      });
    } else {
      next();
    }
  }).catch((err) => console.log(err));
};

const saveModifiedPlayer = async (req, res, next) => {
  const validationRule = {
    firstName: "required|string",
    lastName: "required|string",
    jerseyNumber: "required|string",
    position: "string",
    age: "string",
    height: "required|string",
    team: "string",
  };

  await validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: "Validation failed",
        data: err,
      });
    } else {
      next();
    }
  }).catch((err) => console.log(err));
};

module.exports = {
  validator,
  saveCreatedPlayer,
  saveModifiedPlayer,
};

// module.exports = validator;

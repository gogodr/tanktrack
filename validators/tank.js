const Joi = require('joi');

getTankValidator = (request) => Joi.validate(request, Joi.object().keys({
    id: Joi.string().guid({ version: ['uuidv4'] }).required()
}));

addTankValidator = (request) => Joi.validate(request, Joi.object().keys({
    businessUnitLocationId: Joi.string().guid({ version: ['uuidv4'] }).required(),
    name: Joi.string().required()
}));

module.exports = {
    getTankValidator,
    addTankValidator
}
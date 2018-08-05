const Joi = require('joi');

getTankValidator = (request) => Joi.validate(request, Joi.object().keys({
    id: Joi.string().guid({ version: ['uuidv4'] }).required()
}));

getTankSettingsValidator = (request) => Joi.validate(request, Joi.object().keys({
    id: Joi.string().guid({ version: ['uuidv4'] }).required()
}));

getTankWorkValidator = (request) => Joi.validate(request, Joi.object().keys({
    id: Joi.string().guid({ version: ['uuidv4'] }).required()
}));

postTankWorkValidator = (request) => Joi.validate(request, Joi.object().keys({
    id: Joi.string().guid({ version: ['uuidv4'] }).required()
}));

postTankReportValidator = (request) => Joi.validate(request, Joi.object().keys({
    id: Joi.string().guid({ version: ['uuidv4'] }).required(),
    report: Joi.string().required()
}));

addTankValidator = (request) => Joi.validate(request, Joi.object().keys({
    businessUnitLocationId: Joi.string().guid({ version: ['uuidv4'] }).required(),
    name: Joi.string().required()
}));

module.exports = {
    getTankValidator,
    getTankSettingsValidator,
    getTankWorkValidator,
    postTankReportValidator,
    postTankWorkValidator,
    addTankValidator
}
'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
*/

const _ = require('lodash');
const { sanitizeEntity } = require('strapi-utils');
const jwt = require('jsonwebtoken')
const { jwtSecret } =  require('../config/jwt')

const sanitizeUser = user =>
sanitizeEntity(user, {
    model: strapi.query('subscriber', 'users-permissions').model,
});

const formatError = error => [
    { messages: [{ id: error.id, message: error.message, field: error.field }] }
];

module.exports = {
    async update(ctx) {
        const advancedConfigs = await strapi
        .store({
            enviroment: '',
            type: 'plugin',
            name: 'users-permissions',
            key: 'advanced',
        })
        .get();

        const { id } = jwt.verify(ctx.request.body.token, jwtSecret)
        const { email } = ctx.request.body;
        const user = await strapi.plugins['users-permissions'].services.user.fetch({
            id
        });
        if (_.has(ctx.request.body, 'email') && !email){
            return ctx.badRequest('email.notNull');
        }
        let updateData = {
            ...ctx.request.body,
        };
        const data = await strapi.plugins['users-permissions'].services.user.edit({ id }, updateData);
        ctx.send(data);
    },
};
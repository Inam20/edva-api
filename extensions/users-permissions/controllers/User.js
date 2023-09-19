const _ = require('lodash');
const { sanitizeEntity } = require('strapi-utils');
const jwt = require('jsonwebtoken')
const { jwtSecret } =  require('../config/jwt')

const sanitizeUser = user =>
sanitizeEntity(user, {
    model: strapi.query('user', 'users-permissions').model,
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
        const { email, username, password, phoneNumber, biography, facebook, linkedin, twitter, instagram } = ctx.request.body;
        const user = await strapi.plugins['users-permissions'].services.user.fetch({
            id
        });
        if (_.has(ctx.request.body, 'email') && !email){
            return ctx.badRequest('email.notNull');
        }
        if (_.has(ctx.request.body, 'username') && !username){
            return ctx.badRequest('username.notNull');
        }
        if (_.has(ctx.request.body, 'phoneNumber') && !phoneNumber){
            return ctx.badRequest('phoneNumber.notNull');
        }
        if (_.has(ctx.request.body, 'biography') && !biography){
            return ctx.badRequest('biography.notNull');
        }
        if (_.has(ctx.request.body, 'facebook') && !facebook){
            return ctx.badRequest('facebook.notNull');
        }
        if (_.has(ctx.request.body, 'linkedin') && !linkedin){
            return ctx.badRequest('linkedin.notNull');
        }
        if (_.has(ctx.request.body, 'twitter') && !twitter){
            return ctx.badRequest('twitter.notNull');
        }
        if (_.has(ctx.request.body, 'instagram') && !instagram){
            return ctx.badRequest('instagram.notNull');
        }
        if (_.has(ctx.request.body, 'password') && !password && user.provider === 'local'){
            return ctx.badRequest('password.notNull');
        }
        let updateData = {
            ...ctx.request.body,
        };
        if(_.has(ctx.request.body, 'password') && password === user.password){
            delete updateData.password;
        }
        const data = await strapi.plugins['users-permissions'].services.user.edit({ id }, updateData);
        ctx.send(data);
    },
}
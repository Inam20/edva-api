'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
*/

const _ = require('lodash');
const { sanitizeEntity } = require('strapi-utils');
const jwt = require('jsonwebtoken')
const {jwtSecret} =  require('../config/jwt')

const sanitizeUser = user =>
sanitizeEntity(user, {
    model: strapi.query('contact-inbox', 'users-permissions').model,
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
        const { name, email, phoneNumber, message } = ctx.request.body;
        const user = await strapi.plugins['users-permissions'].services.user.fetch({
            id
        });
        if (_.has(ctx.request.body, 'name') && !name){
            return ctx.badRequest('name.notNull');
        }
        if (_.has(ctx.request.body, 'email') && !email){
            return ctx.badRequest('email.notNull');
        }
        if (_.has(ctx.request.body, 'phoneNumber') && !phoneNumber){
            return ctx.badRequest('phoneNumber.notNull');
        }
        if (_.has(ctx.request.body, 'message') && !message){
            return ctx.badRequest('message.notNull');
        }
        let updateData = {
            ...ctx.request.body,
        };
        const data = await strapi.plugins['users-permissions'].services.user.edit({ id }, updateData);
        ctx.send(data);
    },

    async create(ctx) {
        const { name, email, phoneNumber, message } = ctx.request.body;
    
        // Validation checks
        if (!name || !email || !phoneNumber || !message) {
          return ctx.badRequest('Please provide valid values for name, email, phoneNumber, and message.');
        }
    
        // Update contact details in the database
        const contactInbox = await strapi.services['contact-inbox'].create({
          name,
          email,
          phoneNumber,
          message,
        });
    
        // Send email notification
        try {
          await strapi.plugins['email'].services.email.send({
            to: 'info@finiacademy.com', // Your email address
            from: 'info@finiacademy.com',
            subject: 'New Contact Form Submission',
            text: `Name: ${name}\nEmail: ${email}\nPhone Number: ${phoneNumber}\nMessage: ${message}`,
            html: `<p>Name: ${name}</p><p>Email: ${email}</p><p>Phone Number: ${phoneNumber}</p><p>Message: ${message}</p>`,
          });
          console.log('Contact form submission email sent successfully');
        } catch (error) {
          console.error('Error sending contact form submission email', error);
        }
    
        // Respond with the sanitized contact inbox data
        ctx.send(sanitizeEntity(contactInbox, { model: strapi.models['contact-inbox'] }));
      },
};
// ./extensions/users-permissions/controllers/Auth.js

const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  async register(ctx) {
    const { email, username, phoneNumber, userType, password } = ctx.request.body;

    // Validate input (customize as needed)
    if (!email || !username || !phoneNumber || !userType || !password) {
      return ctx.badRequest('Please provide valid email, username, and password.');
    }

    // Check if the email is already registered
    const existingUser = await strapi.query('user', 'users-permissions').findOne({ email });
    if (existingUser) {
      return ctx.badRequest('Email is already registered.');
    }

    // Create the user
    const user = await strapi.plugins['users-permissions'].services.user.add({
      username,
      email,
      phoneNumber,
      userType,
      password,
    });

    // Send email confirmation (customize as needed)
    try {
      await strapi.plugins['email'].services.email.send({
        to: 'info@finiacademy.com',
        from: 'info@finiacademy.com',
        subject: 'New User Registered',
        text: `Name: ${user.username}\nEmail: ${user.email}\nPhone Number: ${phoneNumber}\nUser Type: ${userType} just registered. `,
        html: `<p>Name: ${user.username}\nEmail: ${user.email}\nPhone Number: ${phoneNumber}\nUser Type: ${userType} just registered.</p>`,
      });
      console.log('Registration email sent successfully');
    } catch (error) {
      console.error('Error sending registration email', error);
    }

    // Respond with the sanitized user data
    ctx.send(sanitizeEntity(user, { model: strapi.query('user', 'users-permissions').model }));
  },
};

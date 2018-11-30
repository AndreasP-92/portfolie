const KEY 				="898757410913-71vupmo6fdinapgo8693r0k1e26cjtuo.apps.googleusercontent.com";
const SECRET 			= "JIkrWF-gxTPoOtuvtttR4Kp2";
const User 				= require('../routes/services/users');
const GoogleStrategy 	= require('passport-google-oauth').OAuth2Strategy;
const insert			= require('../routes/services/insert');

module.exports = function () {
	return new GoogleStrategy({
		'clientID': KEY,
		'clientSecret': SECRET,
		'callbackURL': "https://mrcaptain.info/perfect-shoes/google/callback"
	},
	async function(accessToken, refreshToken, profile, done) {
		try {
			firstname	= profile.name.givenName;
			lastname	= profile.name.familyName;
			email		= profile.emails[0].value;
			img			= profile._json.image.url;
			displayName	= profile.displayName;

			const user	= await User.google.findOrCreate(profile.id, email, firstname, lastname, img, displayName);
			
			done(null, { 'id': user });
		} catch (error) {
			done(error);
			console.log(error)
		}
	});
};
const isLogin = async (req, res, next) => {
    try {
        if (req.session.user_id) {
            return next();
        } else {
            return res.redirect('/');
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Internal Server Error');
    }
};

const isLogout = async (req, res, next) => {
    try {
        if (req.session.user_id) {
            return res.redirect('/home');
        } else {
           
            return next();
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    isLogin,
    isLogout
};

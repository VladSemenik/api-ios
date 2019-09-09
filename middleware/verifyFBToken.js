const axios = require('axios');


module.exports = async (req, resp, next) => {
    //EAAFbBOT3ZA3wBAK7uDE75DsvChkAnlaGmQNizeqmf8USCeDRF07VX1LYkHnaDt3SYsChFM75ZCocJhK7LbPNw8ugbcq2C1ljpRtz2yEHRHenpxiRZASBKoHA5JZBhRa8TXe7XiRfmaHAlS9A9uRi2q9YU8E6gPKqbNh8lpVExEyZBqjvEnSaKIPut7uhYfcKnFn7n5b57Y1jvwaXGrF7dOBLHXKvTHdgE6QNdxNZAgZBgZDZD

    let token = await req.headers["auth-token"];
    if (!token)
        return resp.status(401).send('Access denied');
    else
        axios.get("https://graph.facebook.com/debug_token", {
            params: {
                "access_token": "EAAFbBOT3ZA3wBAHsJUZCAtdx6C0eQX2ZAHqLA5NqlY08CgSCYWvUsb9tPvZBAzhr0NUiqGMmboixN5ecGUZAaepVK51TpoKSkNdaDyPs5f6ZBWjrxzYStt5qcmdAjEMZBCynlLIIU4DdEzk6ewXvfYyTxLiwDjtfFTKYmeF3VincwZDZD",
                "input_token": token
            }
        })
            .then((res) => {
                if (res.data.data.is_valid && req.body.fb_id === res.data.data.user_id)
                    next();
                else
                    throw new Error(res.data.data.error.message);
            })
            .catch(err => {
                resp.status(400).send(err);
            });

};
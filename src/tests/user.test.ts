require('dotenv').config();

import request from 'supertest'
import app from '../server'
import mongoose from 'mongoose'
import Post from '../models/post_model'
import User from '../models/user_model'

const userEmail = "david@gmail.com"
const userPassword = "12345"
const userName = "David";

const userNewName = "Messi";

let userId = '';
let accessToken = '';

beforeAll(async () => {
    await Post.remove()
    await User.remove()
    const res = await request(app).post('/auth/register').send({
        "email": userEmail,
        "password": userPassword,
        "name": userName
    })
    userId = res.body._id;
})

async function loginUser() {
    const response = await request(app).post('/auth/login').send({
        "email": userEmail,
        "password": userPassword
    })

    accessToken = response.body.accessToken;
}

beforeEach(async () => {
    await loginUser()
})

afterAll(async () => {
    await User.findByIdAndDelete(userId);
    mongoose.connection.close()
});

describe("User Tests", () => {
    test("Get My information by id", async () => {
        const response = await request(app).get(`/user/${userId}`).set('Authorization', 'JWT ' + accessToken);

        expect(response.statusCode).toEqual(200);
        expect(response.body.email).toEqual(userEmail);
        expect(response.body._id).toEqual(userId);
    })

    test("Edit my information by ID", async () => {
        let response = await request(app).post(`/user/edit-user/${userId}`).set('Authorization', 'JWT ' + accessToken)
            .send({
                "name": userNewName
            });

        expect(response.statusCode).toEqual(200);
        expect(response.body.msg).toEqual('Update succes');
    })
})
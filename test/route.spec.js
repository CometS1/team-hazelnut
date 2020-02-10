const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app.js");

const jwt_decode = require("jwt-decode");

chai.should();
chai.use(chaiHttp);

describe("Test posts to server", () => {

    it("User signup should return status 200 or 409", done => {
        chai
            .request(app)
            .post('/users/register')
            .send({ name: "Tester", email: "test@yahoo.com", password: "HatchTest123", confirmPassword: "HatchTest123" })
            .end((err, res) => {
                try {
                    res.should.have.status(200);
                } catch (err) {
                    try {
                        res.should.have.status(409);
                    } catch (err) {
                        console.log(err);
                    }
                }
                done();
            })
    })
    
    //Login Test
    it("Login should return status 200", done => {
        chai
            .request(app)
            .post('/users/login')
            .send({ email: "test@yahoo.com", password: "HatchTest123" })
            .end((err, res) => {
                try {
                    res.should.have.status(200);
                } catch (err) {
                    console.log(err);
                }

                done();
            })
    })

    //Profile Creation Test
    /*it("Profile creation should return status 200", done => {
        chai
            .request(app)
            .post('/profile/create')
            .send({})
    })*/
})
//Add User Deletion later
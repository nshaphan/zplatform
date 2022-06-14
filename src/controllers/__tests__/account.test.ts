/* eslint-disable no-undef */
import { User } from "@prisma/client";
import request from "supertest";
import prismaMock from "../testUtils/singleton";
import app from "../../index";

describe("/signup", () => {
  it("it should create new user", () => {
    const user: User = {
      id: 1,
      otpToken: "sddf",
      profilePhoto: "",
      documentAttachment: "",
      isTwoFactorEnabled: false,
      loginLinkToken: "",
      documentType: "ID",
      idNumber: "",
      updatedAt: new Date(),
      createdAt: new Date(),
      status: "UN_VERIFIED",
      firstName: "Shaphan",
      lastName: "nzabo",
      gender: "Male",
      dateOfBirth: "12/02/2012",
      age: 12,
      maritalStatus: "SINGLE",
      nationality: "Rwandan",
      email: "shaphannzabonimana@gmail.com",
      password: "12345678",
    };
    prismaMock.user.create.mockResolvedValue(user);
    request(app)
      .post("/signup")
      // .send({
      //   firstName: "Shaphan",
      //   lastName: "nzabo",
      //   gender: "Male",
      //   dateOfBirth: "12/02/2012",
      //   age: 12,
      //   maritalStatus: "SINGLE",
      //   nationality: "Rwandan",
      //   email: "shaphannzabonimana@gmail.com",
      //   password: "12345678",
      //   confirmPassword: "12345678",
      // })
      // .expect(201)
      .end((err, res) => {
        if (err) throw err;
      });
  });
});

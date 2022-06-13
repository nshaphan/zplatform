"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserProfile = exports.Gender = exports.MaritalStatus = void 0;
var Gender;
(function (Gender) {
    Gender[Gender["Male"] = 0] = "Male";
    Gender[Gender["Female"] = 1] = "Female";
})(Gender || (Gender = {}));
exports.Gender = Gender;
var MaritalStatus;
(function (MaritalStatus) {
    MaritalStatus[MaritalStatus["SINGLE"] = 0] = "SINGLE";
    MaritalStatus[MaritalStatus["MARRIED"] = 1] = "MARRIED";
    MaritalStatus[MaritalStatus["DIVORCED"] = 2] = "DIVORCED";
    MaritalStatus[MaritalStatus["WIDOWED"] = 3] = "WIDOWED";
})(MaritalStatus || (MaritalStatus = {}));
exports.MaritalStatus = MaritalStatus;
const createUserProfile = (input) => {
    return "Its working";
};
exports.createUserProfile = createUserProfile;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const addTest_1 = require("./addTest");
describe("test add function", () => {
    it("returns 22 for add(1, 21)", () => {
        expect((0, addTest_1.add)(1, 21)).toBe(22);
    });
    it("returns 300 for add(125, 175)", () => {
        expect((0, addTest_1.add)(125, 175)).toBe(300);
    });
});

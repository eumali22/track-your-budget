import { add } from "../../src/routes/addTest";

describe("test add function", () => {
    it("returns 22 for add(1, 21)", () => {
        expect(add(1, 21)).toBe(22);
    });
    it("returns 300 for add(125, 175)", () => {
        expect(add(125, 175)).toBe(300);
    });
});


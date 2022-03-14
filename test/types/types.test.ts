import { IdGroup } from "../../src/types/types"

describe('class IdGroup', () => {
    it('creates a userId id group', () => {
        const idg = new IdGroup("userId", {
            userId: "hey"
        });
        expect(idg).toBeDefined();
    });
    it('creates a budgetId id group', () => {
        const idg = new IdGroup("budgetId", {
            userId: "hey",
            budgetId: "budget"
        });
        expect(idg).toBeDefined();
    });
    it('creates an accountId id group', () => {
        const idg = new IdGroup("accountId", {
            userId: "hey",
            budgetId: "budget",
            accountId: "nyahallo"
        });
        expect(idg).toBeDefined();
    });
    it('creates a transactionId id group', () => {
        const idg = new IdGroup("transactionId", {
            userId: "hey",
            budgetId: "budget",
            accountId: "nyahallo",
            transactionId: "hi123"
        });
        expect(idg).toBeDefined();
    });

    it("throws error when there are extra ids", () => {
        expect(() => {
            let idg = new IdGroup("userId", {
                userId: "hey",
                budgetId: "budget",
                accountId: "nyahallo",
                transactionId: "hi123"
            });
        }).toThrow(/invalid parameters/);
        expect(() => {
            let idg = new IdGroup("userId", {
                userId: null
            });
        }).not.toThrow();
    });
    it("throws error when there are missing ids", () => {
        expect(() => {
            let idg = new IdGroup("transactionId", {
                userId: "hey",
                budgetId: "budget",
                accountId: "nyahallo"
            });
        }).toThrow(/invalid parameters/);
        expect(() => {
            let idg = new IdGroup("accountId", {
                userId: ""
            });
        }).toThrow(/invalid parameters/);
    });
})
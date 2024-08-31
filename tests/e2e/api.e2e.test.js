import request from "supertest";
import App from "../../app.js";
import UserController from "../../resources/user/controller.js";
import ItemController from "../../resources/item/controller.js";
import OrderController from "../../resources/order/controller.js";
import DriverController from "../../resources/driver/controller.js";
import AdminController from "../../resources/admin/controller.js";

const controllers = [
    new UserController(),
    new ItemController(),
    new OrderController(),
    new DriverController(),
    new AdminController(),
];

const app = new App(controllers, 3000).express;
let userToken;
let adminToken;
const expectedUsers = {
    users: [
        {
            id: 1,
            name: "John",
            phone: "123129124",
            email: "JohnDoe123@gmail.com",
            password: "JohnDoe123",
            user_role: "admin",
        },
        {
            id: 2,
            name: "Seriy",
            phone: "1231329124",
            email: "Serhiy@gmail.com",
            password: "serhiy123",
            user_role: "user",
        },
    ],
};

describe("Users and auth endpoints", () => {
    it("should show that user is unauthorized", async () => {
        const res = await request(app).get("/api/v2/orders/details/1");
        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual({
            status: 401,
            message: "Unauthorized",
        });
    });

    it("should create first user (admin)", async () => {
        const { id, user_role, ...adminUser } = expectedUsers.users[0];
        const res = await request(app)
            .post("/api/v2/users/register")
            .send(adminUser);

        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({
            token: expect.any(String),
        });
        adminToken = res.body.token;
    });

    it("should create another user", async () => {
        const { id, user_role, ...defaultUser } = expectedUsers.users[1];
        const res = await request(app)
            .post("/api/v2/users/register")
            .send(defaultUser);

        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({
            token: expect.any(String),
        });

        userToken = res.body.token;
    });

    it("should login user", async () => {
        const body = {
            email: "JohnDoe123@gmail.com",
            password: "JohnDoe123",
        };

        const res = await request(app).post("/api/v2/users/login").send(body);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            token: expect.any(String),
        });
    });
});

describe("Admin endpoints", () => {
    it("Should get all users", async () => {
        const res = await request(app)
            .get("/api/v2/admin/users")
            .set("Authorization", `Bearer ${adminToken}`);

        const expected = {
            users: expectedUsers.users.map((user) => {
                const { password, ...exp } = user;
                return exp;
            }),
        };

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expected);
    });
});

describe("Orders endpoints", () => {
    it("should get user orders", async () => {
        const res = await request(app)
            .get("/api/v2/orders/user-orders")
            .set("Authorization", `Bearer ${userToken}`);
        expect(res.statusCode).toEqual(220);
    });

    it("should return 404 when order not found", async () => {
        const res = await request(app)
            .get("/api/v2/orders/details/9999")
            .set("Authorization", `Bearer ${userToken}`);
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty(
            "message",
            "Error fetching order: Order not found"
        );
    });
});

import request from "supertest";
import App from "../../app.js";
import UserController from "../../resources/user/controller.js";
import ItemController from "../../resources/item/controller.js";
import OrderController from "../../resources/order/controller.js";
import DriverController from "../../resources/driver/controller.js";
import AdminController from "../../resources/admin/controller.js";
import token from "../../utils/token.js";

const controllers = [
    new UserController(),
    new ItemController(),
    new OrderController(),
    new DriverController(),
    new AdminController(),
];

const app = new App(controllers, 3000).express;

describe("API E2E Tests", () => {
    it("should show that user is unauthorized", async () => {
        const res = await request(app).get("/api/v2/orders/details/1");
        expect(res.statusCode).toBe(401);
        console.log(res.body);
        expect(res.body).toEqual({
            status: 401,
            message: "Unauthorized",
        });
    });

    it("should create new user", async () => {
        const body = {
            name: "John",
            phone: "123129124",
            email: "JohnDoe123@gmail.com",
            password: "JohnDoe123",
        };
        const res = await request(app)
            .post("/api/v2/users/register")
            .send(body);
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({
            token: expect.any(String),
        });
    });
    let adminToken;

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
        adminToken = res.body.token;
    });

    it("should get user orders", async () => {
        const res = await request(app)
            .get("/api/v2/orders/user-orders")
            .set("Authorization", `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(200);
    });
});

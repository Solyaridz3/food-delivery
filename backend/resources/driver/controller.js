class DriverController {
    path = "/driver";
    router = new Router();
    #driverService = new DriverService();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get(`${this.path}/setup`, this.setup);
    }

    setup = async (req, res, next) => {
        try {
            await this.#driverService.setup();
            res.sendStatus(200);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    };

    createOrder(items) {}
}

import { NextFunction, Response, Request } from "express";
import { UploadedFile } from "express-fileupload";
import { v4 as uuidv4 } from "uuid";
import { FileStorage } from "../common/types/storage";
import { CreataeRequestBody, Topping } from "./topping-types";
import { ToppingService } from "./topping-service";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { MessageProducerBroker } from "../common/types/broker";

export class ToppingController {
    constructor(
        private storage: FileStorage,
        private toppingService: ToppingService,
        private broker: MessageProducerBroker,
    ) {}

    create = async (
        req: Request<object, object, CreataeRequestBody>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const image = req.files!.image as UploadedFile;
            const fileUuid = uuidv4();

            const result = validationResult(req);

            if (!result.isEmpty()) {
                return next(
                    createHttpError(400, result.array()[0].msg as string),
                );
            }

            await this.storage.upload({
                filename: fileUuid,
                fileData: image.data,
            });

            // todo: add error handling
            const savedTopping = await this.toppingService.create({
                ...req.body,
                image: fileUuid,
                tenantId: req.body.tenantId,
            } as Topping);
            // todo: add logging

            await this.broker.sendMessage(
                "topping",
                JSON.stringify({
                    id: savedTopping._id,
                    price: savedTopping.price,
                    tenantId: savedTopping.tenantId,
                }),
            );

            res.json({ id: savedTopping._id });
        } catch (err) {
            return next(err);
        }
    };

    get = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const toppings = await this.toppingService.getAll(
                req.query.tenantId as string,
            );

            // todo: add error handling
            const readyToppings = toppings.map((topping) => {
                return {
                    id: topping._id,
                    name: topping.name,
                    price: topping.price,
                    tenantId: topping.tenantId,
                    image: this.storage.getObjectUri(topping.image),
                };
            });
            res.json(readyToppings);
        } catch (err) {
            return next(err);
        }
    };
}

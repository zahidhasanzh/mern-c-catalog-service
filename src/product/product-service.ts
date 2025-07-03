import { paginationLabels } from "../config/pagination";
import productModel from "./product-model";
import { Filter, Paginatequery, Product } from "./product-types";

export class ProductService {
    async createProduct(product: Product) {
        return (await productModel.create(product)) as Product;
    }

    async updateProduct(productId: string, product: Product) {
        return (await productModel.findOneAndUpdate(
            { _id: productId },
            {
                $set: product,
            },
            {
                new: true,
            },
        )) as Product;
    }

    async getProduct(productId: string): Promise<Product | null> {
        return await productModel.findOne({ _id: productId });
    }

    async getProducts(
        q: string,
        filters: Filter,
        paginateQuery: Paginatequery,
    ) {
        const searchQueryRegexp = new RegExp(q, "i");

        const matchQuery = {
            ...filters,
            name: searchQueryRegexp,
        };

        const aggregate = productModel.aggregate([
            {
                $match: matchQuery,
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "category",
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                attributes: 1,
                                priceConfiguration: 1,
                            },
                        },
                    ],
                },
            },
            {
                $unwind: "$category",
            },
        ]);

        return productModel.aggregatePaginate(aggregate, {
            ...paginateQuery,
            customLabels: paginationLabels,
        });
    }

    async getOne(productId: string) {
        return await productModel.findOne({ _id: productId });
    }

    async deleteProduct(productId: string) {
        return await productModel.findOneAndDelete({ _id: productId });
    }
}

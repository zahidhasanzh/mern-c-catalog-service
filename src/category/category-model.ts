import mongoose from "mongoose";
import { Attribute, Category, PriceConfiguration } from "./category-types";

const priceConfigurationSchema = new mongoose.Schema<PriceConfiguration>({
    priceType: {
        type: String,
        enum: ["base", "additional"],
        required: true,
    },
    availableOptions: {
        type: [String],
        required: true,
    },
});

const attributeSchema = new mongoose.Schema<Attribute>({
    name: {
        type: String,
        required: true,
    },
    widgetType: {
        type: String,
        enum: ["switch", "radio"],
        required: true,
    },
    defaultValue: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    availableOptions: {
        type: [String],
        required: true,
    },
});

const categorySchema = new mongoose.Schema<Category>({
    name: {
        type: String,
        required: true,
    },
    priceConfiguration: {
        type: Map,
        of: priceConfigurationSchema,
        required: true,
    },
    attributes: {
        type: [attributeSchema],
        required: true,
    },
    hasTopping: {
        type: Boolean,
        default: false,
        required: true,
    },
});

export default mongoose.model("Category", categorySchema);

// {
//   "name": "Pizza",
//   "priceConfiguration": {
//     "Size": {
//       "priceType": "base",
//       "availableOptions": ["Small", "Medium", "Large"]
//     },
//     "Curst": {
//       "priceType": "additional",
//       "availableOptions": ["Thin", "Thick"]
//     }
//   },
//   "attributes": [
//     {
//       "name": "isHit",
//       "widgetType": "switch",
//       "defaultValue": "No",
//       "availableOptions": ["Yes", "No"]
//     },
//     {
//       "name": "Spiciness",
//       "widgetType": "radio",
//       "defaultValue": "Medium",
//       "availableOptions": ["Less", "Medium", "Hot"]
//     }
//   ]
// }

// {
//     "name": "Beverages",
//     "priceConfiguration": {
//         "Size": {
//             "priceType": "base",
//             "availableOptions": ["100ml", "330ml", "500ml"]
//         },
//         "Chilling": {
//             "priceType": "additional",
//             "availableOptions": ["Warm", "Cold"]
//         }
//     },
//     "attributes": [
//         {
//             "name": "isHit",
//             "widgetType": "switch",
//             "defaultValue": "No",
//             "availableOptions": ["Yes", "No"]
//         },
//         {
//             "name": "Alcohol",
//             "widgetType": "radio",
//             "defaultValue": "Non-Alcoholic",
//             "availableOptions": ["Non-Alcoholic", "Alcoholic"]
//         }
//     ],
// 	 "hasTopping": false
// }

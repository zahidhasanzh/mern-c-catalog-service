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

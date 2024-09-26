import { nanoid } from "nanoid";
import slugify from "slugify";
// models
import { Product } from "../../../DB/Models/index.js";
// utils
import {
  calculateProductPrice,
  ErrorClass,
  uploadFile,
} from "../../Utils/index.js";
import { ApiFeatures } from "../../Utils/api-features.utils.js";

/**
 * @api {post} /products/add  Add Product
 */
export const addProduct = async (req, res, next) => {
  // destructuring the request body
  const { title, overview, specs, price, discountAmount, discountType, stock } =
    req.body;
  // req,files
  if (!req.files.length)
    return next(new ErrorClass("No images uploaded", { status: 400 }));

  // Ids check
  const brandDocument = req.document;
  // Images section
  // Access the customIds from the brandDocument
  const brandCustomId = brandDocument.customId;
  const catgeoryCustomId = brandDocument.categoryId.customId;
  const subCategoryCustomId = brandDocument.subCategoryId.customId;

  const customId = nanoid(4);
  const folder = `${process.env.UPLOADS_FOLDER}/Categories/${catgeoryCustomId}/SubCategories/${subCategoryCustomId}/Brands/${brandCustomId}/Products/${customId}`;

  // upload each file to cloudinary
  const URLs = [];
  for (const file of req.files) {
    const { secure_url, public_id } = await uploadFile({
      file: file.path,
      folder,
    });
    URLs.push({ secure_url, public_id });
  }

  // prepare product object
  const productObject = {
    title,
    overview,
    specs: JSON.parse(specs),
    price,
    appliedDiscount: {
      amount: discountAmount,
      type: discountType,
    },
    stock,
    Images: {
      URLs,
      customId,
    },
    categoryId: brandDocument.categoryId._id,
    subCategoryId: brandDocument.subCategoryId._id,
    brandId: brandDocument._id,
  };

  // create in db
  const newProduct = await Product.create(productObject);
  // send the response
  res.status(201).json({
    status: "success",
    message: "Product created successfully",
    data: newProduct,
  });
};

/**
 * @api {put} /products/update/:productId  Update Product
 * @todo Upload images to cloudinary and db
 */
export const updateProduct = async (req, res, next) => {
  // productId from params
  const { productId } = req.params;
  // destructuring the request body
  const {
    title,
    stock,
    overview,
    badge,
    price,
    discountAmount,
    discountType,
    specs,
  } = req.body;
  // check if the product is exist
  const product = await Product.findById(productId);
  if (!product)
    return next(new ErrorClass("Product not found", { status: 404 }));

  // update the product title and slug
  if (title) {
    product.title = title;
    product.slug = slugify(title, {
      replacement: "_",
      lower: true,
    });
  }
  // update the product stock, overview, badge
  if (stock) product.stock = stock;
  if (overview) product.overview = overview;
  if (badge) product.badge = badge;

  // update the product price and discount
  if (price || discountAmount || discountType) {
    const newPrice = price || product.price;
    const discount = {};
    discount.amount = discountAmount || product.appliedDiscount.amount;
    discount.type = discountType || product.appliedDiscount.type;

    product.appliedPrice = calculateProductPrice(newPrice, discount);

    product.price = newPrice;
    product.appliedDiscount = discount;
  }

  // update the product specs
  /**
   * @todo when updating the Images field , you need to apply JSON.parse() method for specs before updating it in db
   */
  if (specs) product.specs = specs;

  // save the product changes
  await product.save();
  // send the response
  res.status(200).json({
    status: "success",
    message: "Product updated successfully",
    data: product,
  });
};


/**
 * @api {delete} /products/delete/:productId  Delete Product
 */
export const deleteProduct = async (req, res, next) => {
  // productId from params
  const { productId } = req.params;

  // check if the product exists
  const product = await Product.findById(productId);
  if (!product)
    return next(new ErrorClass("Product not found", { status: 404 }));

  // Delete product images from cloudinary
  const imageDeletionPromises = product.Images.URLs.map(({ public_id }) =>
    cloudinary.uploader.destroy(public_id)
  );
  await Promise.all(imageDeletionPromises);

  // Delete the product from the database
  await Product.findByIdAndDelete(productId);

  // send the response
  res.status(200).json({
    status: "success",
    message: "Product deleted successfully",
  });
};


/**
 * @api {get} /products/list  list all Products
 *
 */
export const listProducts = async (req, res, next) => {
  // find all products
  // const { page = 1, limit = 5, ...filters } = req.query;
  // const skip = (page - 1) * limit;

  // const filtersAsString = JSON.stringify(filters);
  // const replacedFilter = filtersAsString.replaceAll(
  //   /lt|gt|lte|gte|regex|ne|eq/g,
  //   (ele) => `$${ele}`
  // );
  // const parsedFilters = JSON.parse(replacedFilter);

  /**
   * @way 2 using paginate method from mongoose-paginate-v2 as schema plugin
   */
  const mongooseQuery = Product.find();
  const ApiFeaturesInstance = new ApiFeatures(
    mongooseQuery, req.query
  ).pagination().filters();

  const products = await ApiFeaturesInstance.mongooseQuery;
  // send the response
  res.status(200).json({
    status: "success",
    message: "Products list",
    data: products,
  });
};

// page  1 , 2 , 3 , 4 ,...
// limit 50 , 50  , 50 , 50 ,...
// skip 0 , 50 , 100 , 150 , ... (page - 1) * limit

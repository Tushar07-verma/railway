/**
 * T-RAYO Clothing Product Service
 * 
 * Performance Design:
 * - Uses `.lean()` on Mongoose queries for 3-5x faster deserialization
 * - Selects only necessary fields on list queries to save bandwidth
 * - Filters strictly by indexed clothing properties (GSM, fit, category, size)
 */

const Product = require('../models/Product');
const { getPaginationParams, formatPaginationMeta } = require('../utils/pagination');
const versionManager = (() => {
  try { return require('../sync/version/versionManager'); }
  catch(e) { return require('../../sync/version/versionManager'); }
})();

class ProductService {
  /**
   * High-speed paginated catalogue query
   */
  async getClothingProducts(queryParams) {
    const { page, limit, skip } = getPaginationParams(queryParams);
    const filter = { productStatus: 'PUBLISHED' };

    // Targeted clothing filters
    if (queryParams.category) {
      filter.category = queryParams.category;
    }
    if (queryParams.fit) {
      filter.fit = queryParams.fit;
    }
    if (queryParams.size) {
      filter.size = queryParams.size;
    }
    if (queryParams.minGsm || queryParams.maxGsm) {
      filter.gsm = {};
      if (queryParams.minGsm) filter.gsm.$gte = Number(queryParams.minGsm);
      if (queryParams.maxGsm) filter.gsm.$lte = Number(queryParams.maxGsm);
    }
    if (queryParams.availability) {
      filter.availability = queryParams.availability;
    }

    // Lightweight projection for listing
    const projection = 'name category price discount images color size gsm fit availability';

    const [items, total] = await Promise.all([
      Product.find(filter)
        .select(projection)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter)
    ]);

    return {
      products: items,
      pagination: formatPaginationMeta(total, page, limit)
    };
  }

  /**
   * Retrieves single clothing product with full fabric and material details
   */
  async getProductById(id) {
    return Product.findById(id).lean();
  }

  /**
   * Admin: Creates new clothing product & updates global sync version
   */
  async createProduct(productData) {
    const product = new Product(productData);
    const saved = await product.save();
    versionManager.bumpVersion('products');
    return saved;
  }

  /**
   * Admin: Updates existing clothing product
   */
  async updateProduct(id, updateData) {
    const updated = await Product.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (updated) {
      versionManager.bumpVersion('products');
    }
    return updated;
  }
}

module.exports = new ProductService();

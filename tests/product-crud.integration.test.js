import test from 'node:test';
import assert from 'node:assert/strict';
import { PrismaClient } from '@prisma/client';
import businessService from '../server/services/businessService.js';
import productService from '../server/services/productService.js';
import authService from '../server/services/authService.js';
import publishingService from '../server/services/publishingService.js';

const prisma = new PrismaClient();

const makeUnique = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const cleanup = async (ids = []) => {
  if (ids.length === 0) return;

  await prisma.product.deleteMany({ where: { id: { in: ids } } });
};

test('product CRUD persists and enforces business ownership', async () => {
  const ownerAEmail = `${makeUnique('owner-a')}@example.com`;
  const ownerBEmail = `${makeUnique('owner-b')}@example.com`;

  const ownerA = await authService.createUser('Owner A', ownerAEmail, await authService.hashPassword('Passw0rd!'));
  const ownerB = await authService.createUser('Owner B', ownerBEmail, await authService.hashPassword('Passw0rd!'));

  const businessA = await businessService.createBusiness(ownerA.id, { name: `Business A ${makeUnique('biz-a')}` });
  const businessB = await businessService.createBusiness(ownerB.id, { name: `Business B ${makeUnique('biz-b')}` });

  const createdProductIds = [];

  try {
    const product = await productService.createProduct(businessA.id, {
      name: 'Test Product',
      type: 'product',
      description: 'A persisted product for integration testing.',
      price: 125.5,
      currency: 'USD',
      category: 'Hardware',
      availability: 'in_stock',
      stockQuantity: 7,
      sku: 'SKU-001',
      businessLocation: 'Nairobi',
      deliveryInfo: 'Ships in 2 days',
      status: 'draft',
    });
    createdProductIds.push(product.id);

    const service = await productService.createProduct(businessA.id, {
      name: 'Premium Setup',
      type: 'service',
      description: 'Managed implementation',
      price: 250,
      currency: 'USD',
      category: 'Consulting',
      availability: 'limited',
      stockQuantity: 3,
      status: 'draft',
    });
    createdProductIds.push(service.id);

    const saved = await productService.getProductsByBusiness(businessA.id);
    assert.ok(saved.some((entry) => entry.id === product.id));
    assert.ok(saved.some((entry) => entry.type === 'service'));

    const updated = await productService.updateProduct(product.id, businessA.id, {
      name: 'Updated Test Product',
      price: 139.99,
      availability: 'limited',
      stockQuantity: 4,
      sku: 'SKU-UPDATED',
    });
    assert.equal(updated?.name, 'Updated Test Product');
    assert.equal(updated?.price, 139.99);
    assert.equal(updated?.availability, 'limited');
    assert.equal(updated?.stockQuantity, 4);

    const forbiddenUpdate = await productService.updateProduct(product.id, businessB.id, {
      name: 'Hacked Product',
      price: 999,
    });
    assert.equal(forbiddenUpdate, null);

    const forbiddenDelete = await productService.deleteProduct(product.id, businessB.id);
    assert.equal(forbiddenDelete.count, 0);

    const deleteResult = await productService.deleteProduct(product.id, businessA.id);
    assert.equal(deleteResult.count, 1);

    const remaining = await productService.getProductsByBusiness(businessA.id);
    assert.ok(!remaining.some((entry) => entry.id === product.id));
  } finally {
    await cleanup(createdProductIds);
    await prisma.business.deleteMany({ where: { id: { in: [businessA.id, businessB.id] } } });
    await prisma.user.deleteMany({ where: { id: { in: [ownerA.id, ownerB.id] } } });
  }
});

test('publishing rejects unconfigured platform connections without faking success', async () => {
  const ownerEmail = `${makeUnique('owner-publish')}@example.com`;
  const owner = await authService.createUser('Publisher Owner', ownerEmail, await authService.hashPassword('Passw0rd!'));
  const business = await businessService.createBusiness(owner.id, { name: `Publishing Business ${makeUnique('biz-pub')}` });

  const product = await productService.createProduct(business.id, {
    name: 'Publish Guard Product',
    type: 'product',
    description: 'This product should never be published without a real connection.',
    price: 49.99,
    currency: 'USD',
    status: 'draft',
  });

  try {
    const validation = await publishingService.validatePublishingRequest(business.id, ['facebook']);
    assert.equal(validation.allowed, false);
    assert.ok(validation.missing.some((entry) => entry.channel === 'facebook'));

    const publishedListing = await publishingService.createProductListing(product.id, business.id, 'facebook', 'DRAFT', { name: product.name });
    assert.ok(publishedListing.id);
  } finally {
    await prisma.product.deleteMany({ where: { id: product.id } });
    await prisma.business.deleteMany({ where: { id: business.id } });
    await prisma.user.deleteMany({ where: { id: owner.id } });
  }
});

test.after(async () => {
  await prisma.$disconnect();
});

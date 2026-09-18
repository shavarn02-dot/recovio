import 'dotenv/config';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { createDatabaseClient } from './client.js';
import { UserRepository } from '../modules/auth/user.repository.js';
import { config } from '../config/index.js';
import { invoices } from './schema.js';
import { eq } from 'drizzle-orm';

async function seed() {
  const db = createDatabaseClient({ connectionString: config.DATABASE_URL });
  const userRepo = new UserRepository(db);

  const email = 'admin@jaktra.com';
  let user = await userRepo.findFirstByEmail(email);
  let tenantId: string;

  if (!user) {
    const passwordHash = await bcrypt.hash('Password123!', 12);
    const result = await userRepo.createTenantWithAdmin(
      { name: 'Jaktra Demo', slug: 'jaktra-demo' },
      {
        name: 'Admin User',
        email,
        passwordHash,
        role: 'admin',
        emailVerified: true,
        mfaEnabled: false,
      }
    );
    user = result.user;
    tenantId = result.tenant.id;
    console.log('Admin user created.');
  } else {
    tenantId = user.tenantId;
    console.log(`User ${email} exists.`);
  }

  // Check if invoices exist
  const existingInvoices = await db.select().from(invoices).where(eq(invoices.tenantId, tenantId)).limit(1);
  if (existingInvoices.length === 0) {
    console.log('Inserting sample invoices...');
    await db.insert(invoices).values([
      {
        tenantId,
        invoiceNo: 'INV-2026-001',
        clientName: 'Acme Corporation',
        invoiceAmount: '45000.00',
        currency: 'INR',
        dueDate: '2026-09-30',
        contactEmail: 'billing@acme.com',
        subject: 'Cloud Infrastructure & Consulting - Sep 2026',
        paymentStatus: 'Pending',
        followupCount: 1,
      },
      {
        tenantId,
        invoiceNo: 'INV-2026-002',
        clientName: 'Globex IT Solutions',
        invoiceAmount: '82500.00',
        currency: 'INR',
        dueDate: '2026-09-10',
        contactEmail: 'accounts@globex.com',
        subject: 'Annual Software License Renewal',
        paymentStatus: 'Overdue',
        followupCount: 3,
      },
      {
        tenantId,
        invoiceNo: 'INV-2026-003',
        clientName: 'Soylent Technologies',
        invoiceAmount: '120000.00',
        currency: 'INR',
        dueDate: '2026-08-25',
        contactEmail: 'finance@soylent.org',
        subject: 'Custom AI Pipeline Integration',
        paymentStatus: 'Paid',
        followupCount: 2,
      },
      {
        tenantId,
        invoiceNo: 'INV-2026-004',
        clientName: 'Stark Logistics',
        invoiceAmount: '34000.00',
        currency: 'INR',
        dueDate: '2026-10-05',
        contactEmail: 'payables@stark.io',
        subject: 'API Integration & Support Q3',
        paymentStatus: 'Pending',
        followupCount: 0,
      }
    ]);
    console.log('Sample invoices created successfully!');
  } else {
    console.log('Invoices already exist.');
  }

  console.log('SEED COMPLETE');
  await db.$pool.end();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});

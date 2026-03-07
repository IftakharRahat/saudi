import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET() {
    const results: Record<string, unknown> = {};

    // Test 1: Basic DB connectivity
    try {
        const count = await prisma.subscriber.count();
        results.subscriberCount = count;
        results.dbConnection = 'OK';
    } catch (error) {
        results.dbConnection = 'FAILED';
        results.dbError = error instanceof Error ? error.message : String(error);
        results.dbErrorStack = error instanceof Error ? error.stack : undefined;
    }

    // Test 2: Check env vars (redacted)
    results.hasDbUrl = !!process.env.DATABASE_URL;
    results.dbUrlPrefix = process.env.DATABASE_URL?.substring(0, 30) + '...';
    results.hasNextAuthUrl = !!process.env.NEXTAUTH_URL;
    results.nextAuthUrl = process.env.NEXTAUTH_URL;
    results.nodeEnv = process.env.NODE_ENV;

    return NextResponse.json(results);
}

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET() {
    const results: Record<string, unknown> = {};

    // Test 1: Auth / getServerSession
    try {
        const session = await getServerSession(authOptions);
        results.session = session ? { id: session.user?.id, role: session.user?.role } : null;
        results.authStatus = session ? 'AUTHENTICATED' : 'NOT_AUTHENTICATED';
    } catch (error) {
        results.authStatus = 'ERROR';
        results.authError = error instanceof Error ? error.message : String(error);
        results.authStack = error instanceof Error ? error.stack?.split('\n').slice(0, 5) : undefined;
    }

    // Test 2: Basic DB connectivity
    try {
        const count = await prisma.subscriber.count();
        results.subscriberCount = count;
        results.dbConnection = 'OK';
    } catch (error) {
        results.dbConnection = 'FAILED';
        results.dbError = error instanceof Error ? error.message : String(error);
    }

    // Test 3: Env check
    results.nextAuthUrl = process.env.NEXTAUTH_URL;
    results.nodeEnv = process.env.NODE_ENV;

    return NextResponse.json(results);
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { compare, hash } from 'bcryptjs';

export const runtime = 'nodejs';

// PUT /api/admin/account  — update email or password
export async function PUT(request: NextRequest) {
    let session;
    try {
        session = await getServerSession(authOptions);
    } catch {
        return NextResponse.json({ error: 'Authentication error.' }, { status: 500 });
    }

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    let body: Record<string, unknown>;
    try {
        body = (await request.json()) as Record<string, unknown>;
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
    }

    const action = String(body.action ?? '');

    // --- UPDATE EMAIL ---
    if (action === 'updateEmail') {
        const newEmail = String(body.newEmail ?? '').trim().toLowerCase();
        const currentPassword = String(body.currentPassword ?? '');

        if (!newEmail || !currentPassword) {
            return NextResponse.json(
                { error: 'New email and current password are required.' },
                { status: 400 }
            );
        }

        try {
            const admin = await prisma.admin.findUnique({ where: { id: session.user.id } });
            if (!admin) {
                return NextResponse.json({ error: 'Admin not found.' }, { status: 404 });
            }

            const valid = await compare(currentPassword, admin.passwordHash);
            if (!valid) {
                return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 403 });
            }

            // Check if email is taken by another admin
            const existing = await prisma.admin.findUnique({ where: { email: newEmail } });
            if (existing && existing.id !== admin.id) {
                return NextResponse.json({ error: 'Email already in use.' }, { status: 409 });
            }

            await prisma.admin.update({
                where: { id: admin.id },
                data: { email: newEmail },
            });

            return NextResponse.json({ message: 'Email updated successfully. Please sign in again.' });
        } catch (error) {
            console.error('Failed to update admin email:', error);
            return NextResponse.json({ error: 'Failed to update email.' }, { status: 500 });
        }
    }

    // --- UPDATE PASSWORD ---
    if (action === 'updatePassword') {
        const currentPassword = String(body.currentPassword ?? '');
        const newPassword = String(body.newPassword ?? '');

        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { error: 'Current password and new password are required.' },
                { status: 400 }
            );
        }

        if (newPassword.length < 6) {
            return NextResponse.json(
                { error: 'New password must be at least 6 characters.' },
                { status: 400 }
            );
        }

        try {
            const admin = await prisma.admin.findUnique({ where: { id: session.user.id } });
            if (!admin) {
                return NextResponse.json({ error: 'Admin not found.' }, { status: 404 });
            }

            const valid = await compare(currentPassword, admin.passwordHash);
            if (!valid) {
                return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 403 });
            }

            const passwordHash = await hash(newPassword, 12);
            await prisma.admin.update({
                where: { id: admin.id },
                data: { passwordHash },
            });

            return NextResponse.json({ message: 'Password updated successfully. Please sign in again.' });
        } catch (error) {
            console.error('Failed to update admin password:', error);
            return NextResponse.json({ error: 'Failed to update password.' }, { status: 500 });
        }
    }

    return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
}

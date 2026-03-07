'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { useAdminI18n } from '@/i18n/admin-i18n';

async function apiPut(body: Record<string, string>) {
    const res = await fetch('/api/admin/account', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    const data = (await res.json()) as { message?: string; error?: string };
    return { ok: res.ok, message: data.message ?? data.error ?? 'Unknown error.' };
}

export default function AdminAccountPage() {
    const { t } = useAdminI18n();

    // Email form
    const [newEmail, setNewEmail] = useState('');
    const [emailPassword, setEmailPassword] = useState('');
    const [emailSaving, setEmailSaving] = useState(false);
    const [emailMsg, setEmailMsg] = useState('');
    const [emailStatus, setEmailStatus] = useState<'idle' | 'success' | 'error'>('idle');

    // Password form
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [pwSaving, setPwSaving] = useState(false);
    const [pwMsg, setPwMsg] = useState('');
    const [pwStatus, setPwStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const onUpdateEmail = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setEmailSaving(true);
        setEmailMsg('');
        setEmailStatus('idle');

        const result = await apiPut({
            action: 'updateEmail',
            newEmail,
            currentPassword: emailPassword,
        });

        setEmailStatus(result.ok ? 'success' : 'error');
        setEmailMsg(result.message);
        setEmailSaving(false);

        if (result.ok) {
            setTimeout(() => signOut({ callbackUrl: '/admin/login' }), 2000);
        }
    };

    const onUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPwMsg('');
        setPwStatus('idle');

        if (newPassword !== confirmPassword) {
            setPwStatus('error');
            setPwMsg(t.passwordsDoNotMatch);
            return;
        }

        setPwSaving(true);

        const result = await apiPut({
            action: 'updatePassword',
            currentPassword,
            newPassword,
        });

        setPwStatus(result.ok ? 'success' : 'error');
        setPwMsg(result.message);
        setPwSaving(false);

        if (result.ok) {
            setTimeout(() => signOut({ callbackUrl: '/admin/login' }), 2000);
        }
    };

    const inputCls =
        'w-full rounded-[8px] border border-[#D1D5DB] px-4 py-3 text-sm outline-none focus:border-[#004FCE]';
    const btnCls =
        'inline-flex items-center justify-center rounded-[8px] bg-[#004FCE] px-5 py-3 text-sm font-semibold text-white disabled:opacity-70';

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-semibold text-[#111827]">{t.account}</h1>
                <p className="mt-1 text-sm text-[#6B7280]">{t.accountSub}</p>
            </div>

            {/* Change Email */}
            <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-[#111827]">{t.changeLoginEmail}</h2>
                <form onSubmit={onUpdateEmail} className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-[#111827]">{t.newEmail}</label>
                        <input
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className={inputCls}
                            required
                            placeholder="newemail@example.com"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-[#111827]">
                            {t.currentPassword}
                        </label>
                        <input
                            type="password"
                            value={emailPassword}
                            onChange={(e) => setEmailPassword(e.target.value)}
                            className={inputCls}
                            required
                        />
                    </div>
                    <button type="submit" disabled={emailSaving} className={btnCls}>
                        {emailSaving ? t.updating : t.updateEmail}
                    </button>
                    {emailStatus !== 'idle' && (
                        <p className={`text-sm ${emailStatus === 'success' ? 'text-green-700' : 'text-red-600'}`}>
                            {emailMsg}
                        </p>
                    )}
                </form>
            </div>

            {/* Change Password */}
            <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-[#111827]">{t.changePassword}</h2>
                <form onSubmit={onUpdatePassword} className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-[#111827]">
                            {t.currentPassword}
                        </label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className={inputCls}
                            required
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-[#111827]">
                            {t.newPassword}
                        </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className={inputCls}
                            required
                            minLength={6}
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-[#111827]">
                            {t.confirmNewPassword}
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={inputCls}
                            required
                            minLength={6}
                        />
                    </div>
                    <button type="submit" disabled={pwSaving} className={btnCls}>
                        {pwSaving ? t.updating : t.updatePassword}
                    </button>
                    {pwStatus !== 'idle' && (
                        <p className={`text-sm ${pwStatus === 'success' ? 'text-green-700' : 'text-red-600'}`}>
                            {pwMsg}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}

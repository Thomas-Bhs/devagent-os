'use client';

import { useTheme } from '@/app/context/ThemeContext';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function LegalPage() {
  const { t } = useTheme();
  const router = useRouter();

  return (
    <main
      className='min-h-screen py-12 px-4'
      style={{ backgroundColor: t.bg, fontFamily: t.fontFamily }}
    >
      <div className='max-w-2xl mx-auto'>
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className='flex items-center gap-2 mb-8 text-sm transition-opacity hover:opacity-70'
          style={{ color: t.textSecondary }}
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {/* Title */}
        <h1 className='text-2xl sm:text-3xl font-bold mb-12' style={{ color: t.text }}>
          Legal
        </h1>

        <div className='flex flex-col gap-12'>
          {/* Legal Notice */}
          <section>
            <h2 className='text-xl font-bold mb-4' style={{ color: t.text }}>
              Legal Notice
            </h2>
            <div
              className='rounded-xl p-6'
              style={{
                backgroundColor: t.cardBg,
                border: `1px solid ${t.cardBorder}`,
              }}
            >
              <p style={{ color: t.textSecondary }} className='text-sm leading-relaxed'>
                <strong style={{ color: t.text }}>Publisher</strong>
                <br />
                Thomas Bourc'his — Self-employed
                <br />
                Email: bourchisthomas@gmail.com
                <br />
                Website: https://devagent-os.vercel.app
              </p>
              <p style={{ color: t.textSecondary }} className='text-sm leading-relaxed mt-4'>
                <strong style={{ color: t.text }}>Hosting</strong>
                <br />
                Vercel Inc. — 340 Pine Street, Suite 701
                <br />
                San Francisco, CA 94104, USA
              </p>
            </div>
          </section>

          {/* Terms of Service */}
          <section>
            <h2 className='text-xl font-bold mb-4' style={{ color: t.text }}>
              Terms of Service
            </h2>
            <div
              className='rounded-xl p-6 flex flex-col gap-4'
              style={{
                backgroundColor: t.cardBg,
                border: `1px solid ${t.cardBorder}`,
              }}
            >
              {[
                {
                  title: '1. Purpose',
                  content:
                    'DevAgent OS is a SaaS product offering an AI multi-agent development assistant, available through a monthly subscription.',
                },
                {
                  title: '2. Access',
                  content:
                    'Access to the service requires creating an account via Google OAuth and subscribing to one of the available plans.',
                },
                {
                  title: '3. Payment',
                  content:
                    'Payments are processed by Stripe Inc. Subscriptions are automatically renewed each month on the subscription date.',
                },
                {
                  title: '4. Cancellation',
                  content:
                    'You may cancel your subscription at any time from your account settings. Access is maintained until the end of the current billing period.',
                },
                {
                  title: '5. Acceptable Use',
                  content:
                    'You may not use DevAgent OS to generate illegal or malicious content, circumvent quotas through automated means, or share account access.',
                },
                {
                  title: '6. Limitation of Liability',
                  content:
                    'DevAgent OS is provided "as is" without warranty of any kind. Thomas Bourc\'his shall not be liable for any damages arising from the use of this service.',
                },
                {
                  title: '7. Governing Law',
                  content:
                    'These Terms are governed by French law. Any dispute shall be submitted to the competent courts of Brest, France.',
                },
              ].map((item) => (
                <div key={item.title}>
                  <p className='text-sm font-semibold mb-1' style={{ color: t.text }}>
                    {item.title}
                  </p>
                  <p className='text-sm leading-relaxed' style={{ color: t.textSecondary }}>
                    {item.content}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Privacy Policy */}
          <section>
            <h2 className='text-xl font-bold mb-4' style={{ color: t.text }}>
              Privacy Policy
            </h2>
            <div
              className='rounded-xl p-6 flex flex-col gap-4'
              style={{
                backgroundColor: t.cardBg,
                border: `1px solid ${t.cardBorder}`,
              }}
            >
              {[
                {
                  title: '1. Data Collected',
                  content:
                    'Name, email, profile picture (via Google OAuth), conversation history, usage statistics, and subscription data. No payment data is stored on our servers.',
                },
                {
                  title: '2. Use of Data',
                  content:
                    'Your data is used to provide the service, manage your subscription, and send transactional emails (welcome, quota alerts, cancellation confirmation).',
                },
                {
                  title: '3. Data Sharing',
                  content:
                    'Your data is never sold. It is shared only with our service providers: Google, Stripe, Anthropic, Resend, Vercel, MongoDB Atlas, and Sentry.',
                },
                {
                  title: '4. Data Retention',
                  content:
                    'Your data is retained as long as your account is active. Deleting your account immediately removes all associated data from our systems.',
                },
                {
                  title: '5. Your Rights (GDPR)',
                  content:
                    'You have the right to access, rectify, erase (via Settings → Delete account), port, and object to the processing of your data. Contact: bourchisthomas@gmail.com',
                },
                {
                  title: '6. Cookies',
                  content:
                    'We only use functional cookies required for authentication. No advertising or tracking cookies are used.',
                },
              ].map((item) => (
                <div key={item.title}>
                  <p className='text-sm font-semibold mb-1' style={{ color: t.text }}>
                    {item.title}
                  </p>
                  <p className='text-sm leading-relaxed' style={{ color: t.textSecondary }}>
                    {item.content}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Refund Policy */}
          <section>
            <h2 className='text-xl font-bold mb-4' style={{ color: t.text }}>
              Refund Policy
            </h2>
            <div
              className='rounded-xl p-6 flex flex-col gap-4'
              style={{
                backgroundColor: t.cardBg,
                border: `1px solid ${t.cardBorder}`,
              }}
            >
              {[
                {
                  title: '1. Refund Period',
                  content:
                    'A full refund is available within 7 days of subscription, provided fewer than 50 requests have been made.',
                },
                {
                  title: '2. How to Request',
                  content:
                    'Send an email to bourchisthomas@gmail.com with your account email, subscription date, and reason for the request. Processed within 5 business days.',
                },
                {
                  title: '3. Cancellation Without Refund',
                  content:
                    'You may cancel your subscription at any time without a refund. Access is maintained until the end of the current billing period.',
                },
              ].map((item) => (
                <div key={item.title}>
                  <p className='text-sm font-semibold mb-1' style={{ color: t.text }}>
                    {item.title}
                  </p>
                  <p className='text-sm leading-relaxed' style={{ color: t.textSecondary }}>
                    {item.content}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Footer */}
          <p className='text-xs text-center' style={{ color: t.textSecondary }}>
            Last updated: May 2026 · Contact: bourchisthomas@gmail.com
          </p>
        </div>
      </div>
    </main>
  );
}

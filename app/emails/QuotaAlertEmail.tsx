import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface QuotaAlertEmailProps {
  percent: number;
  requestsUsed: number;
  requestsLimit: number;
  planName: string;
  isExpert: boolean;
  appUrl: string;
}

export function QuotaAlertEmail({
  percent,
  requestsUsed,
  requestsLimit,
  planName,
  isExpert,
  appUrl,
}: QuotaAlertEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{`You've used ${percent}% of your monthly quota on DevAgent OS`}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={h1}>Quota alert ⚠️</Heading>

          <Text style={text}>
            You&apos;ve used <strong>{percent}%</strong> of your monthly quota on your{' '}
            <strong>{planName}</strong> plan.
          </Text>

          <Section style={warningCard}>
            <Text style={label}>Usage</Text>
            <Text style={usageTitle}>
              {requestsUsed.toLocaleString()} / {requestsLimit.toLocaleString()} requests
            </Text>
            <Section style={progressBg}>
              <Section style={{ ...progressBar, width: `${percent}%` }} />
            </Section>
          </Section>

          <Text style={text}>
            Your quota resets on the 1st of next month. Consider upgrading your plan for more
            requests.
          </Text>

          <Button href={`${appUrl}/billing`} style={button}>
            View billing →
          </Button>

          {!isExpert && (
            <Link href={`${appUrl}/pricing`} style={secondaryLink}>
              Upgrade plan →
            </Link>
          )}

          <Hr style={hr} />

          <Text style={footer}>You received this email because you have an active DevAgent OS subscription.</Text>
        </Container>
      </Body>
    </Html>
  );
}

const body = { backgroundColor: '#f9fafb', fontFamily: 'sans-serif' };
const container = { maxWidth: '600px', margin: '0 auto', padding: '40px 20px' };
const h1 = { fontSize: '24px', fontWeight: 'bold', color: '#0f0f1a', margin: '0 0 16px' };
const text = { color: '#6b7280', margin: '0 0 24px' };
const label = {
  fontSize: '12px',
  textTransform: 'uppercase' as const,
  color: '#92400e',
  fontWeight: '600',
  margin: '0 0 8px',
};
const warningCard = {
  backgroundColor: '#fffbeb',
  border: '1px solid #fde68a',
  borderRadius: '12px',
  padding: '24px',
  margin: '0 0 24px',
};
const usageTitle = { fontSize: '20px', fontWeight: 'bold', color: '#0f0f1a', margin: '0 0 12px' };
const progressBg = {
  backgroundColor: '#e5e7eb',
  borderRadius: '999px',
  height: '8px',
  overflow: 'hidden',
  margin: '0',
};
const progressBar = {
  backgroundColor: '#f59e0b',
  height: '8px',
  borderRadius: '999px',
};
const button = {
  backgroundColor: '#0f0f1a',
  color: '#ffffff',
  padding: '12px 24px',
  borderRadius: '8px',
  fontWeight: '600',
  textDecoration: 'none',
  display: 'inline-block',
  margin: '0 0 8px',
};
const secondaryLink = {
  display: 'inline-block',
  color: '#0f0f1a',
  padding: '12px 24px',
  borderRadius: '8px',
  fontWeight: '600',
  textDecoration: 'none',
  border: '1px solid #e5e7eb',
  marginLeft: '8px',
};
const hr = { borderColor: '#e5e7eb', margin: '24px 0' };
const footer = { color: '#9ca3af', fontSize: '12px', margin: '0' };

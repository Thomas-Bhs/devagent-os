import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface WelcomeEmailProps {
  planName: string;
  planPrice: number;
  requestsPerMonth: number;
  agents: string[];
  appUrl: string;
}

export function WelcomeEmail({
  planName,
  planPrice,
  requestsPerMonth,
  agents,
  appUrl,
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your {planName} plan is now active — start building with DevAgent OS</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={h1}>Welcome to DevAgent OS 👋</Heading>

          <Text style={text}>
            Your <strong>{planName}</strong> plan is now active.
          </Text>

          <Section style={card}>
            <Text style={label}>Your plan</Text>
            <Text style={planTitle}>
              {planName} — €{planPrice}/month
            </Text>
            <Text style={subText}>{requestsPerMonth.toLocaleString()} requests / month</Text>
          </Section>

          <Section style={card}>
            <Text style={label}>Available agents</Text>
            <Section style={pillRow}>
              {agents.map((agent) => (
                <Text key={agent} style={pill}>
                  {agent}
                </Text>
              ))}
            </Section>
          </Section>

          <Button href={appUrl} style={button}>
            Start using DevAgent OS →
          </Button>

          <Hr style={hr} />

          <Text style={footer}>
            You can manage your subscription at any time from the app menu.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const body = { backgroundColor: '#f9fafb', fontFamily: 'sans-serif' };
const container = { maxWidth: '600px', margin: '0 auto', padding: '40px 20px' };
const h1 = { fontSize: '24px', fontWeight: 'bold', color: '#0f0f1a', margin: '0 0 16px' };
const text = { color: '#6b7280', margin: '0 0 24px' };
const card = {
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  padding: '24px',
  margin: '0 0 16px',
};
const label = {
  fontSize: '12px',
  textTransform: 'uppercase' as const,
  color: '#9ca3af',
  fontWeight: '600',
  margin: '0 0 8px',
};
const planTitle = { fontSize: '20px', fontWeight: 'bold', color: '#0f0f1a', margin: '0 0 4px' };
const subText = { color: '#6b7280', margin: '0' };
const pillRow = { display: 'flex', flexWrap: 'wrap' as const, gap: '8px', margin: '0' };
const pill = {
  display: 'inline-block',
  backgroundColor: '#f3f4f6',
  border: '1px solid #e5e7eb',
  borderRadius: '6px',
  padding: '4px 12px',
  fontSize: '12px',
  color: '#0f0f1a',
  margin: '0 4px 4px 0',
};
const button = {
  backgroundColor: '#0f0f1a',
  color: '#ffffff',
  padding: '12px 24px',
  borderRadius: '8px',
  fontWeight: '600',
  textDecoration: 'none',
  display: 'inline-block',
  margin: '8px 0 24px',
};
const hr = { borderColor: '#e5e7eb', margin: '24px 0' };
const footer = { color: '#9ca3af', fontSize: '12px', margin: '0' };

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

interface CancellationEmailProps {
  endDate: string;
  appUrl: string;
}

export function CancellationEmail({ endDate, appUrl }: CancellationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your DevAgent OS subscription has been canceled</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={h1}>Subscription canceled</Heading>

          <Text style={text}>Your DevAgent OS subscription has been canceled.</Text>

          <Section style={card}>
            <Text style={label}>Access until</Text>
            <Text style={dateTitle}>{endDate}</Text>
            <Text style={subText}>You can continue using DevAgent OS until this date.</Text>
          </Section>

          <Text style={text}>Changed your mind? You can resubscribe at any time.</Text>

          <Button href={`${appUrl}/pricing`} style={button}>
            Resubscribe →
          </Button>

          <Hr style={hr} />

          <Text style={footer}>Thank you for using DevAgent OS.</Text>
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
  margin: '0 0 24px',
};
const label = {
  fontSize: '12px',
  textTransform: 'uppercase' as const,
  color: '#9ca3af',
  fontWeight: '600',
  margin: '0 0 8px',
};
const dateTitle = { fontSize: '20px', fontWeight: 'bold', color: '#0f0f1a', margin: '0 0 4px' };
const subText = { color: '#6b7280', margin: '0' };
const button = {
  backgroundColor: '#0f0f1a',
  color: '#ffffff',
  padding: '12px 24px',
  borderRadius: '8px',
  fontWeight: '600',
  textDecoration: 'none',
  display: 'inline-block',
  margin: '0',
};
const hr = { borderColor: '#e5e7eb', margin: '24px 0' };
const footer = { color: '#9ca3af', fontSize: '12px', margin: '0' };

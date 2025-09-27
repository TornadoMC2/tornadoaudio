import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Tornado Audio heading in header', () => {
  render(<App />);
  const headingElement = screen.getByRole('heading', { name: /Tornado Audio/i, level: 1 });
  expect(headingElement).toBeInTheDocument();
});

test('renders Hunter Johanson name in header', () => {
  render(<App />);
  const nameElement = screen.getByText(/Hunter Johanson - Audio Mixing Engineer/i);
  expect(nameElement).toBeInTheDocument();
});

test('renders pricing section', () => {
  render(<App />);
  const pricingElement = screen.getByText(/Pricing & Services/i);
  expect(pricingElement).toBeInTheDocument();
});

test('renders all main sections', () => {
  render(<App />);
  expect(screen.getByText(/Services & Expertise/i)).toBeInTheDocument();
  expect(screen.getByText(/Portfolio & Audio Samples/i)).toBeInTheDocument();
  expect(screen.getByText(/Get Your Project Started/i)).toBeInTheDocument();
});

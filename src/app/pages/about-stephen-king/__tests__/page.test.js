import { render, screen } from '@testing-library/react';
import AboutStephenKing from '../page';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

jest.mock('@/app/components/PageTitle', () => ({
  __esModule: true,
  default: ({ title }) => <h1>{title}</h1>,
}));

describe('AboutStephenKing Page', () => {
  it('renders the page title', () => {
    render(<AboutStephenKing />);
    expect(screen.getByText('About Stephen King')).toBeInTheDocument();
  });

  it('renders the Stephen King image', () => {
    render(<AboutStephenKing />);
    const image = screen.getByAltText('Stephen King');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/stephen-king-2024.jpg');
  });

  it('renders the summary text', () => {
    render(<AboutStephenKing />);
    expect(screen.getByText(/Stephen Edwin King \(born September 21, 1947\) is an American author./)).toBeInTheDocument();
    expect(screen.getByText(/His debut, Carrie \(1974\), established him in horror./)).toBeInTheDocument();
    expect(screen.getByText(/Among other awards, King has won the O. Henry Award/)).toBeInTheDocument();
  });

  it('renders the Wikipedia link', () => {
    render(<AboutStephenKing />);
    const wikipediaLink = screen.getByRole('link', { name: /Stephen King Wikipedia page/i });
    expect(wikipediaLink).toBeInTheDocument();
    expect(wikipediaLink).toHaveAttribute('href', 'https://en.wikipedia.org/wiki/Stephen_King');
  });

  it('renders the Back to Home link', () => {
    render(<AboutStephenKing />);
    const homeLink = screen.getByRole('link', { name: /Back to Home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });
});
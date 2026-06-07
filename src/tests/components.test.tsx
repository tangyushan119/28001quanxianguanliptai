import { render, screen, fireEvent } from '@testing-library/react';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Select from '@/components/Select';
import Card, { CardHeader, CardTitle, CardBody } from '@/components/Card';
import Modal from '@/components/Modal';
import Badge from '@/components/Badge';

describe('Button Component', () => {
  it('renders primary button correctly', () => {
    render(<Button>Primary Button</Button>);
    expect(screen.getByText('Primary Button')).toBeInTheDocument();
  });

  it('renders secondary button correctly', () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    expect(screen.getByText('Secondary Button')).toBeInTheDocument();
  });

  it('renders button with icon', () => {
    render(<Button leftIcon={<span>Icon</span>}>Button with Icon</Button>);
    expect(screen.getByText('Button with Icon')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByText('加载中')).toBeInTheDocument();
  });

  it('handles click event', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

describe('Input Component', () => {
  it('renders input correctly', () => {
    render(<Input placeholder="Test placeholder" />);
    expect(screen.getByPlaceholderText('Test placeholder')).toBeInTheDocument();
  });

  it('renders input with left icon', () => {
    render(<Input leftIcon={<span>Icon</span>} placeholder="With icon" />);
    expect(screen.getByPlaceholderText('With icon')).toBeInTheDocument();
  });

  it('renders input with error state', () => {
    render(<Input status="error" placeholder="Error input" />);
    expect(screen.getByPlaceholderText('Error input')).toBeInTheDocument();
  });

  it('handles input change', () => {
    render(<Input placeholder="Test" />);
    const input = screen.getByPlaceholderText('Test');
    fireEvent.change(input, { target: { value: 'test value' } });
    expect(input).toHaveValue('test value');
  });
});

describe('Select Component', () => {
  it('renders select correctly', () => {
    render(
      <Select>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      </Select>
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('handles select change', () => {
    render(
      <Select>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      </Select>
    );
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'option2' } });
    expect(select).toHaveValue('option2');
  });
});

describe('Card Component', () => {
  it('renders card with header and body', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
        </CardHeader>
        <CardBody>
          <p>Card content</p>
        </CardBody>
      </Card>
    );
    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });
});

describe('Modal Component', () => {
  it('renders modal when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('does not render modal when isOpen is false', () => {
    const { container } = render(
      <Modal isOpen={false} onClose={() => {}} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    expect(container.querySelector('[role="dialog"]')).toBeNull();
  });
});

describe('Badge Component', () => {
  it('renders badge correctly', () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  it('renders badge with different variants', () => {
    render(<Badge variant="success">Success</Badge>);
    expect(screen.getByText('Success')).toBeInTheDocument();
  });
});
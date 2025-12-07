/**
 * Unit Tests for BookCard Component
 * اختبارات الوحدة لمكون بطاقة الكتاب
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BookCard } from '../BookCard';
import type { Book } from '@/types/library';

// Mock book data
const mockBook: Book = {
  id: 1,
  title: 'الرياضيات للصف الأول',
  author: 'وزارة التربية والتعليم',
  category: 'mathematics',
  subject: 'الرياضيات',
  grade: 'الصف الأول',
  type: 'كتاب',
  language: 'عربي',
  pages: 150,
  downloads: 1000,
  description: 'كتاب تعليمي للرياضيات',
  tags: ['رياضيات', 'تعليم', 'أساسي'],
  fileUrl: 'https://example.com/math-book.pdf',
  coverImage: 'math-cover.jpg',
  publishedDate: '2024',
  publisher: 'وزارة التربية',
  isbn: '978-1234567890',
  license: 'مجاني',
  color: 'blue'
};

describe('BookCard Component', () => {
  
  describe('Rendering', () => {
    it('should render book title', () => {
      const handleClick = vi.fn();
      render(<BookCard book={mockBook} onClick={handleClick} />);
      
      expect(screen.getByText('الرياضيات للصف الأول')).toBeInTheDocument();
    });
    
    it('should render book author', () => {
      const handleClick = vi.fn();
      render(<BookCard book={mockBook} onClick={handleClick} />);
      
      expect(screen.getByText('وزارة التربية والتعليم')).toBeInTheDocument();
    });
    
    it('should render book grade badge', () => {
      const handleClick = vi.fn();
      render(<BookCard book={mockBook} onClick={handleClick} />);
      
      expect(screen.getByText('الصف الأول')).toBeInTheDocument();
    });
    
    it('should render book type badge', () => {
      const handleClick = vi.fn();
      render(<BookCard book={mockBook} onClick={handleClick} />);
      
      expect(screen.getByText('كتاب')).toBeInTheDocument();
    });
    
    it('should render book language badge', () => {
      const handleClick = vi.fn();
      render(<BookCard book={mockBook} onClick={handleClick} />);
      
      expect(screen.getByText('عربي')).toBeInTheDocument();
    });
    
    it('should render page count', () => {
      const handleClick = vi.fn();
      render(<BookCard book={mockBook} onClick={handleClick} />);
      
      expect(screen.getByText('150 صفحة')).toBeInTheDocument();
    });
    
    it('should render published date when available', () => {
      const handleClick = vi.fn();
      render(<BookCard book={mockBook} onClick={handleClick} />);
      
      expect(screen.getByText('2024')).toBeInTheDocument();
    });
    
    it('should render details button', () => {
      const handleClick = vi.fn();
      render(<BookCard book={mockBook} onClick={handleClick} />);
      
      const button = screen.getByRole('button', { name: /عرض التفاصيل/i });
      expect(button).toBeInTheDocument();
    });
  });
  
  describe('Interactions', () => {
    it('should call onClick when card is clicked', () => {
      const handleClick = vi.fn();
      render(<BookCard book={mockBook} onClick={handleClick} />);
      
      const card = screen.getByRole('button', { name: /عرض تفاصيل كتاب/i });
      fireEvent.click(card);
      
      expect(handleClick).toHaveBeenCalledWith(mockBook);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
    
    it('should call onClick when details button is clicked', () => {
      const handleClick = vi.fn();
      render(<BookCard book={mockBook} onClick={handleClick} />);
      
      const button = screen.getByRole('button', { name: /عرض التفاصيل/i });
      fireEvent.click(button);
      
      expect(handleClick).toHaveBeenCalledWith(mockBook);
    });
    
    it('should call onClick when Enter key is pressed', () => {
      const handleClick = vi.fn();
      render(<BookCard book={mockBook} onClick={handleClick} />);
      
      const card = screen.getByRole('button', { name: /عرض تفاصيل كتاب/i });
      fireEvent.keyDown(card, { key: 'Enter' });
      
      expect(handleClick).toHaveBeenCalledWith(mockBook);
    });
    
    it('should call onClick when Space key is pressed', () => {
      const handleClick = vi.fn();
      render(<BookCard book={mockBook} onClick={handleClick} />);
      
      const card = screen.getByRole('button', { name: /عرض تفاصيل كتاب/i });
      fireEvent.keyDown(card, { key: ' ' });
      
      expect(handleClick).toHaveBeenCalledWith(mockBook);
    });
    
    it('should not call onClick for other keys', () => {
      const handleClick = vi.fn();
      render(<BookCard book={mockBook} onClick={handleClick} />);
      
      const card = screen.getByRole('button', { name: /عرض تفاصيل كتاب/i });
      fireEvent.keyDown(card, { key: 'a' });
      
      expect(handleClick).not.toHaveBeenCalled();
    });
  });
  
  describe('Accessibility', () => {
    it('should have proper ARIA label for card', () => {
      const handleClick = vi.fn();
      render(<BookCard book={mockBook} onClick={handleClick} />);
      
      const card = screen.getByRole('button', { name: /عرض تفاصيل كتاب الرياضيات للصف الأول/i });
      expect(card).toBeInTheDocument();
    });
    
    it('should have proper ARIA label for details button', () => {
      const handleClick = vi.fn();
      render(<BookCard book={mockBook} onClick={handleClick} />);
      
      const button = screen.getByRole('button', { name: /عرض تفاصيل الرياضيات للصف الأول/i });
      expect(button).toBeInTheDocument();
    });
    
    it('should be keyboard accessible', () => {
      const handleClick = vi.fn();
      render(<BookCard book={mockBook} onClick={handleClick} />);
      
      const card = screen.getByRole('button', { name: /عرض تفاصيل كتاب/i });
      expect(card).toHaveAttribute('tabIndex', '0');
    });
  });
  
  describe('Visual Elements', () => {
    it('should render with proper card structure', () => {
      const handleClick = vi.fn();
      const { container } = render(<BookCard book={mockBook} onClick={handleClick} />);
      
      // Check for card element
      const card = container.querySelector('[role="button"]');
      expect(card).toBeInTheDocument();
    });
    
    it('should have color strip based on category', () => {
      const handleClick = vi.fn();
      const { container } = render(<BookCard book={mockBook} onClick={handleClick} />);
      
      // Check for colored strip
      const colorStrip = container.querySelector('div[class*="h-2"]');
      expect(colorStrip).toBeInTheDocument();
      expect(colorStrip?.className).toContain('bg-');
    });
  });
});

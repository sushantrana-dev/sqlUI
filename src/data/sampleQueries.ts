import { Query } from '../types';
import { DataSetConfig } from '../utils/dataGenerator';

export interface EnhancedQuery extends Query {
  datasetConfig?: DataSetConfig;
  complexity: 'basic' | 'intermediate' | 'advanced';
  estimatedRows: number;
  category: 'analytics' | 'operations' | 'financial' | 'inventory' | 'customer' | 'hr';
}

// Helper function to generate random count within a range
const getRandomCount = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const SAMPLE_QUERIES: EnhancedQuery[] = [
  {
    id: 'employee-list',
    name: 'Employee List',
    query: `SELECT 
  employeeID,
  firstName,
  lastName,
  title,
  titleOfCourtesy,
  city,
  country,
  homePhone,
  extension
FROM employees
ORDER BY lastName, firstName;`,
    description: 'Basic employee directory with contact information',
    category: 'hr',
    complexity: 'basic',
    estimatedRows: getRandomCount(8, 15),
    datasetConfig: {
      type: 'employees',
      count: getRandomCount(8, 15)
    }
  },

  {
    id: 'employee-hierarchy',
    name: 'Employee Hierarchy',
    query: `SELECT 
  e.employeeID,
  e.firstName,
  e.lastName,
  e.title,
  e.reportsTo,
  m.firstName as managerFirstName,
  m.lastName as managerLastName,
  m.title as managerTitle
FROM employees e
LEFT JOIN employees m ON e.reportsTo = m.employeeID
ORDER BY e.reportsTo, e.lastName;`,
    description: 'Employee reporting structure and management hierarchy',
    category: 'hr',
    complexity: 'intermediate',
    estimatedRows: getRandomCount(8, 15),
    datasetConfig: {
      type: 'employees',
      count: getRandomCount(8, 15)
    }
  },

  {
    id: 'employee-by-country',
    name: 'Employees by Country',
    query: `SELECT 
  country,
  COUNT(*) as employeeCount,
  GROUP_CONCAT(CONCAT(firstName, ' ', lastName) ORDER BY lastName) as employees
FROM employees
GROUP BY country
ORDER BY employeeCount DESC;`,
    description: 'Employee distribution by country with names',
    category: 'analytics',
    complexity: 'intermediate',
    estimatedRows: getRandomCount(2, 4),
    datasetConfig: {
      type: 'employees',
      count: getRandomCount(8, 15)
    }
  },

  {
    id: 'employee-tenure',
    name: 'Employee Tenure Analysis',
    query: `SELECT 
  employeeID,
  firstName,
  lastName,
  title,
  hireDate,
  DATEDIFF(CURDATE(), hireDate) as daysEmployed,
  ROUND(DATEDIFF(CURDATE(), hireDate) / 365.25, 1) as yearsEmployed,
  CASE 
    WHEN DATEDIFF(CURDATE(), hireDate) > 365 THEN 'Long-term'
    WHEN DATEDIFF(CURDATE(), hireDate) > 180 THEN 'Mid-term'
    ELSE 'New'
  END as tenureCategory
FROM employees
ORDER BY daysEmployed DESC;`,
    description: 'Employee tenure analysis with hire dates and categories',
    category: 'hr',
    complexity: 'intermediate',
    estimatedRows: getRandomCount(8, 15),
    datasetConfig: {
      type: 'employees',
      count: getRandomCount(8, 15)
    }
  },

  {
    id: 'employee-age-analysis',
    name: 'Employee Age Analysis',
    query: `SELECT 
  employeeID,
  firstName,
  lastName,
  title,
  birthDate,
  hireDate,
  TIMESTAMPDIFF(YEAR, birthDate, CURDATE()) as age,
  TIMESTAMPDIFF(YEAR, birthDate, hireDate) as ageAtHire,
  CASE 
    WHEN TIMESTAMPDIFF(YEAR, birthDate, CURDATE()) > 60 THEN 'Senior'
    WHEN TIMESTAMPDIFF(YEAR, birthDate, CURDATE()) > 40 THEN 'Mid-career'
    ELSE 'Early career'
  END as ageCategory
FROM employees
ORDER BY age DESC;`,
    description: 'Employee age analysis with age categories',
    category: 'analytics',
    complexity: 'intermediate',
    estimatedRows: getRandomCount(8, 15),
    datasetConfig: {
      type: 'employees',
      count: getRandomCount(8, 15)
    }
  },

  {
    id: 'sales-representatives',
    name: 'Sales Representatives',
    query: `SELECT 
  employeeID,
  firstName,
  lastName,
  title,
  city,
  country,
  homePhone,
  extension,
  hireDate
FROM employees
WHERE title LIKE '%Sales%'
ORDER BY lastName;`,
    description: 'All employees with sales-related titles',
    category: 'operations',
    complexity: 'basic',
    estimatedRows: getRandomCount(5, 8),
    datasetConfig: {
      type: 'employees',
      count: getRandomCount(8, 15)
    }
  },

  {
    id: 'us-employees',
    name: 'US Employees',
    query: `SELECT 
  employeeID,
  firstName,
  lastName,
  title,
  city,
  region,
  postalCode,
  homePhone,
  extension
FROM employees
WHERE country = 'USA'
ORDER BY region, city, lastName;`,
    description: 'All employees based in the United States',
    category: 'operations',
    complexity: 'basic',
    estimatedRows: getRandomCount(4, 7),
    datasetConfig: {
      type: 'employees',
      count: getRandomCount(8, 15)
    }
  },

  {
    id: 'uk-employees',
    name: 'UK Employees',
    query: `SELECT 
  employeeID,
  firstName,
  lastName,
  title,
  city,
  postalCode,
  homePhone,
  extension,
  hireDate
FROM employees
WHERE country = 'UK'
ORDER BY city, lastName;`,
    description: 'All employees based in the United Kingdom',
    category: 'operations',
    complexity: 'basic',
    estimatedRows: getRandomCount(3, 6),
    datasetConfig: {
      type: 'employees',
      count: getRandomCount(8, 15)
    }
  },

  {
    id: 'employee-contact-info',
    name: 'Employee Contact Information',
    query: `SELECT 
  employeeID,
  CONCAT(firstName, ' ', lastName) as fullName,
  title,
  address,
  city,
  region,
  postalCode,
  country,
  homePhone,
  extension
FROM employees
ORDER BY lastName, firstName;`,
    description: 'Complete employee contact information',
    category: 'hr',
    complexity: 'basic',
    estimatedRows: getRandomCount(8, 15),
    datasetConfig: {
      type: 'employees',
      count: getRandomCount(8, 15)
    }
  },

  {
    id: 'employee-titles-summary',
    name: 'Employee Titles Summary',
    query: `SELECT 
  title,
  COUNT(*) as employeeCount,
  GROUP_CONCAT(CONCAT(firstName, ' ', lastName) ORDER BY lastName) as employees
FROM employees
GROUP BY title
ORDER BY employeeCount DESC, title;`,
    description: 'Summary of employees by job title',
    category: 'analytics',
    complexity: 'intermediate',
    estimatedRows: getRandomCount(3, 6),
    datasetConfig: {
      type: 'employees',
      count: getRandomCount(8, 15)
    }
  },

  // Add new queries with different data types
  {
    id: 'sales-performance',
    name: 'Sales Performance Analysis',
    query: `SELECT 
  sales_rep,
  COUNT(*) as total_sales,
  SUM(revenue) as total_revenue,
  AVG(profit_margin) as avg_profit_margin,
  region
FROM sales_data
GROUP BY sales_rep, region
ORDER BY total_revenue DESC;`,
    description: 'Sales performance analysis by representative and region',
    category: 'analytics',
    complexity: 'intermediate',
    estimatedRows: getRandomCount(5, 12),
    datasetConfig: {
      type: 'salesData',
      count: getRandomCount(50, 150)
    }
  },

  {
    id: 'inventory-status',
    name: 'Inventory Status Report',
    query: `SELECT 
  product_name,
  category,
  current_stock,
  reorder_level,
  is_low_stock,
  warehouse_location
FROM inventory
WHERE is_low_stock = true
ORDER BY current_stock ASC;`,
    description: 'Low stock inventory items requiring reorder',
    category: 'inventory',
    complexity: 'basic',
    estimatedRows: getRandomCount(8, 20),
    datasetConfig: {
      type: 'inventory',
      count: getRandomCount(30, 80)
    }
  },

  {
    id: 'customer-orders',
    name: 'Customer Orders Summary',
    query: `SELECT 
  customer_name,
  COUNT(*) as order_count,
  SUM(order_value) as total_spent,
  AVG(order_value) as avg_order_value,
  customer_segment
FROM customer_orders
GROUP BY customer_name, customer_segment
ORDER BY total_spent DESC;`,
    description: 'Customer order summary with spending analysis',
    category: 'customer',
    complexity: 'intermediate',
    estimatedRows: getRandomCount(10, 25),
    datasetConfig: {
      type: 'customerOrders',
      count: getRandomCount(40, 100)
    }
  },

  {
    id: 'user-analytics',
    name: 'User Analytics Dashboard',
    query: `SELECT 
  customer_segment,
  COUNT(*) as user_count,
  AVG(total_sessions) as avg_sessions,
  AVG(total_spent) as avg_spent,
  SUM(CASE WHEN is_premium THEN 1 ELSE 0 END) as premium_users
FROM user_analytics
GROUP BY customer_segment
ORDER BY avg_spent DESC;`,
    description: 'User analytics summary by customer segment',
    category: 'analytics',
    complexity: 'intermediate',
    estimatedRows: getRandomCount(3, 6),
    datasetConfig: {
      type: 'userAnalytics',
      count: getRandomCount(25, 60)
    }
  },

  {
    id: 'financial-quarterly',
    name: 'Quarterly Financial Metrics',
    query: `SELECT 
  period_name,
  revenue,
  profit,
  profit_margin,
  customer_count,
  avg_order_value
FROM financial_metrics
ORDER BY period_name;`,
    description: 'Quarterly financial performance metrics',
    category: 'financial',
    complexity: 'basic',
    estimatedRows: getRandomCount(4, 8),
    datasetConfig: {
      type: 'financialMetrics',
      count: getRandomCount(8, 16)
    }
  }
];

// Get queries by category
export const getQueriesByCategory = (category: string): EnhancedQuery[] => {
  return SAMPLE_QUERIES.filter(query => query.category === category);
};

// Get queries by complexity
export const getQueriesByComplexity = (complexity: string): EnhancedQuery[] => {
  return SAMPLE_QUERIES.filter(query => query.complexity === complexity);
};

// Get queries that generate large datasets
export const getLargeDatasetQueries = (minRows: number = 1000): EnhancedQuery[] => {
  return SAMPLE_QUERIES.filter(query => query.estimatedRows >= minRows);
};

// Get basic queries for beginners
export const getBasicQueries = (): EnhancedQuery[] => {
  return SAMPLE_QUERIES.filter(query => query.complexity === 'basic');
};

// Get advanced queries for performance testing
export const getAdvancedQueries = (): EnhancedQuery[] => {
  return SAMPLE_QUERIES.filter(query => query.complexity === 'advanced');
}; 
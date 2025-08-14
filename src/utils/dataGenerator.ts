// Mock data generator for realistic SQL query results
// This simulates various business scenarios with large datasets

export interface DataSetConfig {
  type: 'employees' | 'userAnalytics' | 'salesData' | 'inventory' | 'customerOrders' | 'financialMetrics';
  count: number;
  dateRange?: { start: string; end: string };
}

// Employee data from the user
const EMPLOYEE_DATA = [
  {
    employeeID: 1,
    lastName: 'Davolio',
    firstName: 'Nancy',
    title: 'Sales Representative',
    titleOfCourtesy: 'Ms.',
    birthDate: '1948-12-08 00:00:00.000',
    hireDate: '1992-05-01 00:00:00.000',
    address: '507 20th Ave. E. Apt. 2A',
    city: 'Seattle',
    region: 'WA',
    postalCode: '98122',
    country: 'USA',
    homePhone: '(206) 555-9857',
    extension: '5467',
    photo: '0x151C2F00020000000D000E0014002100FFFFFFFF4269746D617020496D616765005061696E742E506963747572650001050000020000000700000050427275736800000000000000000020540000424D20540000000000007600000028000000C0000000DF0000000100040000000000A0530000CE0E0000D80E0000000000',
    notes: 'Education includes a BA in psychology from Colorado State University in 1970.  She also completed The Art of the Cold Call.  Nancy is a member of Toastmasters International.',
    reportsTo: 2,
    photoPath: 'http://accweb/emmployees/davolio.bmp'
  },
  {
    employeeID: 2,
    lastName: 'Fuller',
    firstName: 'Andrew',
    title: 'Vice President Sales',
    titleOfCourtesy: 'Dr.',
    birthDate: '1952-02-19 00:00:00.000',
    hireDate: '1992-08-14 00:00:00.000',
    address: '908 W. Capital Way',
    city: 'Tacoma',
    region: 'WA',
    postalCode: '98401',
    country: 'USA',
    homePhone: '(206) 555-9482',
    extension: '3457',
    photo: '0x151C2F00020000000D000E0014002100FFFFFFFF4269746D617020496D616765005061696E742E506963747572650001050000020000000700000050427275736800000000000000000020540000424D20540000000000007600000028000000C0000000DF0000000100040000000000A0530000CE0E0000D80E0000000000',
    notes: 'Andrew received his BTS commercial in 1974 and a Ph.D. in international marketing from the University of Dallas in 1981.  He is fluent in French and Italian and reads German.  He joined the company as a sales representative was promoted to sales manager',
    reportsTo: null,
    photoPath: 'http://accweb/emmployees/fuller.bmp'
  },
  {
    employeeID: 3,
    lastName: 'Leverling',
    firstName: 'Janet',
    title: 'Sales Representative',
    titleOfCourtesy: 'Ms.',
    birthDate: '1963-08-30 00:00:00.000',
    hireDate: '1992-04-01 00:00:00.000',
    address: '722 Moss Bay Blvd.',
    city: 'Kirkland',
    region: 'WA',
    postalCode: '98033',
    country: 'USA',
    homePhone: '(206) 555-3412',
    extension: '3355',
    photo: '0x151C2F00020000000D000E0014002100FFFFFFFF4269746D617020496D616765005061696E742E506963747572650001050000020000000700000050427275736800000000000000000080540000424D80540000000000007600000028000000C0000000E0000000010004000000000000540000CE0E0000D80E0000000000',
    notes: 'Janet has a BS degree in chemistry from Boston College (1984). She has also completed a certificate program in food retailing management.  Janet was hired as a sales associate in 1991 and promoted to sales representative in February 1992.',
    reportsTo: 2,
    photoPath: 'http://accweb/emmployees/leverling.bmp'
  },
  {
    employeeID: 4,
    lastName: 'Peacock',
    firstName: 'Margaret',
    title: 'Sales Representative',
    titleOfCourtesy: 'Mrs.',
    birthDate: '1937-09-19 00:00:00.000',
    hireDate: '1993-05-03 00:00:00.000',
    address: '4110 Old Redmond Rd.',
    city: 'Redmond',
    region: 'WA',
    postalCode: '98052',
    country: 'USA',
    homePhone: '(206) 555-8122',
    extension: '5176',
    photo: '0x151C2F00020000000D000E0014002100FFFFFFFF4269746D617020496D616765005061696E742E506963747572650001050000020000000700000050427275736800000000000000000020540000424D20540000000000007600000028000000C0000000DF0000000100040000000000A0530000CE0E0000D80E0000000000',
    notes: 'Margaret holds a BA in English literature from Concordia College (1958) and an MA from the American Institute of Culinary Arts (1966).  She was assigned to the London office temporarily from July through November 1992.',
    reportsTo: 2,
    photoPath: 'http://accweb/emmployees/peacock.bmp'
  },
  {
    employeeID: 5,
    lastName: 'Buchanan',
    firstName: 'Steven',
    title: 'Sales Manager',
    titleOfCourtesy: 'Mr.',
    birthDate: '1955-03-04 00:00:00.000',
    hireDate: '1993-10-17 00:00:00.000',
    address: '14 Garrett Hill',
    city: 'London',
    region: null,
    postalCode: 'SW1 8JR',
    country: 'UK',
    homePhone: '(71) 555-4848',
    extension: '3453',
    photo: '0x151C2F00020000000D000E0014002100FFFFFFFF4269746D617020496D616765005061696E742E506963747572650001050000020000000700000050427275736800000000000000000020540000424D20540000000000007600000028000000C0000000DF0000000100040000000000A0530000CE0E0000D80E0000000000',
    notes: 'Steven Buchanan graduated from St. Andrews University in Scotland with a BSC degree in 1976.  Upon joining the company as a sales representative in 1992 he spent 6 months in an orientation program at the Seattle office.',
    reportsTo: 2,
    photoPath: 'http://accweb/emmployees/buchanan.bmp'
  },
  {
    employeeID: 6,
    lastName: 'Suyama',
    firstName: 'Michael',
    title: 'Sales Representative',
    titleOfCourtesy: 'Mr.',
    birthDate: '1963-07-02 00:00:00.000',
    hireDate: '1993-10-17 00:00:00.000',
    address: 'Coventry House Miner Rd.',
    city: 'London',
    region: null,
    postalCode: 'EC2 7JR',
    country: 'UK',
    homePhone: '(71) 555-7773',
    extension: '428',
    photo: '0x151C2F00020000000D000E0014002100FFFFFFFF4269746D617020496D616765005061696E742E506963747572650001050000020000000700000050427275736800000000000000000020540000424D16540000000000007600000028000000C0000000DF0000000100040000000000A0530000CE0E0000D80E0000000000',
    notes: 'Michael is a graduate of Sussex University (MA Economics 1983) and the University of California at Los Angeles (MBA marketing 1986).  He has also taken the courses Multi-Cultural Selling and Time Management for the Sales Professional.',
    reportsTo: 5,
    photoPath: 'http://accweb/emmployees/davolio.bmp'
  },
  {
    employeeID: 7,
    lastName: 'King',
    firstName: 'Robert',
    title: 'Sales Representative',
    titleOfCourtesy: 'Mr.',
    birthDate: '1960-05-29 00:00:00.000',
    hireDate: '1994-01-02 00:00:00.000',
    address: 'Edgeham Hollow Winchester Way',
    city: 'London',
    region: null,
    postalCode: 'RG1 9SP',
    country: 'UK',
    homePhone: '(71) 555-5598',
    extension: '465',
    photo: '0x151C2F00020000000D000E0014002100FFFFFFFF4269746D617020496D616765005061696E742E506963747572650001050000020000000700000050427275736800000000000000000020540000424D16540000000000007600000028000000C0000000DF0000000100040000000000A0530000CE0E0000D80E0000000000',
    notes: 'Robert King served in the Peace Corps and traveled extensively before completing his degree in English at the University of Michigan in 1992 the year he joined the company.',
    reportsTo: 5,
    photoPath: 'http://accweb/emmployees/davolio.bmp'
  },
  {
    employeeID: 8,
    lastName: 'Callahan',
    firstName: 'Laura',
    title: 'Inside Sales Coordinator',
    titleOfCourtesy: 'Ms.',
    birthDate: '1958-01-09 00:00:00.000',
    hireDate: '1994-03-05 00:00:00.000',
    address: '4726 11th Ave. N.E.',
    city: 'Seattle',
    region: 'WA',
    postalCode: '98105',
    country: 'USA',
    homePhone: '(206) 555-1189',
    extension: '2344',
    photo: '0x151C2F00020000000D000E0014002100FFFFFFFF4269746D617020496D616765005061696E742E506963747572650001050000020000000700000050427275736800000000000000000020540000424D16540000000000007600000028000000C0000000DF0000000100040000000000A0530000CE0E0000D80E0000000000',
    notes: 'Laura received a BA in psychology from the University of Washington.  She has also completed a course in business French.  She reads and writes French.',
    reportsTo: 2,
    photoPath: 'http://accweb/emmployees/davolio.bmp'
  },
  {
    employeeID: 9,
    lastName: 'Dodsworth',
    firstName: 'Anne',
    title: 'Sales Representative',
    titleOfCourtesy: 'Ms.',
    birthDate: '1966-01-27 00:00:00.000',
    hireDate: '1994-11-15 00:00:00.000',
    address: '7 Houndstooth Rd.',
    city: 'London',
    region: null,
    postalCode: 'WG2 7LT',
    country: 'UK',
    homePhone: '(71) 555-4444',
    extension: '452',
    photo: '0x151C2F00020000000D000E0014002100FFFFFFFF4269746D617020496D616765005061696E742E506963747572650001050000020000000700000050427275736800000000000000000020540000424D16540000000000007600000028000000C0000000DF0000000100040000000000A0530000CE0E0000D80E0000000000',
    notes: 'Anne has a BA degree in English from St. Lawrence College.  She is fluent in French and German.',
    reportsTo: 5,
    photoPath: 'http://accweb/emmployees/davolio.bmp'
  }
];

// Product categories for realistic data
const PRODUCT_CATEGORIES = [
  'Electronics', 'Clothing', 'Home & Garden', 'Sports & Outdoors', 
  'Books', 'Automotive', 'Health & Beauty', 'Toys & Games',
  'Food & Beverages', 'Jewelry', 'Tools & Hardware', 'Pet Supplies'
];

// Customer segments
const CUSTOMER_SEGMENTS = ['Premium', 'Standard', 'Basic', 'Enterprise'];

// User statuses
const USER_STATUSES = ['Active', 'Inactive', 'Pending', 'Suspended'];

// Order statuses
const ORDER_STATUSES = ['Completed', 'Pending', 'Cancelled', 'Shipped', 'Delivered'];

// Generate realistic names
const generateName = () => {
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'James', 'Maria'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
};

// Generate realistic email
const generateEmail = (name: string) => {
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'company.com', 'business.org'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  const cleanName = name.toLowerCase().replace(' ', '.');
  const numbers = Math.floor(Math.random() * 999);
  
  return `${cleanName}${numbers}@${domain}`;
};

// Generate date within range
const generateDate = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(randomTime).toISOString().split('T')[0];
};

// Generate employee data
const generateEmployeeData = (count: number) => {
  // Create a randomized version of the employee data
  const shuffledBaseData = [...EMPLOYEE_DATA].sort(() => Math.random() - 0.5);
  
  // If count is less than or equal to the actual employee data, return shuffled subset
  if (count <= EMPLOYEE_DATA.length) {
    return shuffledBaseData.slice(0, count);
  }
  
  // If more data is needed, create additional randomized entries
  const result = [...shuffledBaseData];
  const additionalNeeded = count - EMPLOYEE_DATA.length;
  
  for (let i = 0; i < additionalNeeded; i++) {
    const baseEmployee = shuffledBaseData[i % shuffledBaseData.length];
    const newEmployee = {
      ...baseEmployee,
      employeeID: EMPLOYEE_DATA.length + i + 1,
      firstName: generateName().split(' ')[0],
      lastName: generateName().split(' ')[1],
      title: getRandomTitle(),
      titleOfCourtesy: getRandomCourtesy(),
      city: getRandomCity(),
      region: getRandomRegion(),
      country: getRandomCountry(),
      homePhone: `(${Math.floor(Math.random() * 900) + 100}) 555-${Math.floor(Math.random() * 9000) + 1000}`,
      extension: Math.floor(Math.random() * 9999).toString(),
      address: `${Math.floor(Math.random() * 9999) + 1} ${getRandomStreet()}`,
      postalCode: getRandomPostalCode(),
      birthDate: generateDate('1950-01-01', '1990-12-31'),
      hireDate: generateDate('1990-01-01', '2020-12-31'),
      reportsTo: Math.random() > 0.3 ? Math.floor(Math.random() * EMPLOYEE_DATA.length) + 1 : null
    };
    result.push(newEmployee);
  }
  
  return result;
};

// Helper functions for randomization
const getRandomTitle = () => {
  const titles = [
    'Sales Representative', 'Sales Manager', 'Vice President Sales', 
    'Inside Sales Coordinator', 'Account Executive', 'Business Development Manager',
    'Customer Success Manager', 'Sales Director', 'Regional Sales Manager'
  ];
  return titles[Math.floor(Math.random() * titles.length)];
};

const getRandomCourtesy = () => {
  const courtesies = ['Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Prof.'];
  return courtesies[Math.floor(Math.random() * courtesies.length)];
};

const getRandomCity = () => {
  const cities = ['Seattle', 'Tacoma', 'Kirkland', 'Redmond', 'London', 'New York', 'Los Angeles', 'Chicago', 'Boston', 'San Francisco'];
  return cities[Math.floor(Math.random() * cities.length)];
};

const getRandomRegion = () => {
  const regions = ['WA', 'CA', 'NY', 'MA', 'IL', 'TX', 'FL', 'PA', 'OH', 'GA'];
  return regions[Math.floor(Math.random() * regions.length)];
};

const getRandomCountry = () => {
  const countries = ['USA', 'UK', 'Canada', 'Australia', 'Germany', 'France', 'Japan', 'India'];
  return countries[Math.floor(Math.random() * countries.length)];
};

const getRandomStreet = () => {
  const streets = ['Main St', 'Oak Ave', 'Pine Rd', 'Elm St', 'Maple Dr', 'Cedar Ln', 'Birch Way', 'Willow Blvd'];
  return streets[Math.floor(Math.random() * streets.length)];
};

const getRandomPostalCode = () => {
  return Math.floor(Math.random() * 99999 + 10000).toString();
};

// Generate user analytics data
const generateUserAnalytics = (count: number) => {
  return Array.from({ length: count }, (_, i) => {
    const name = generateName();
    const totalSessions = Math.floor(Math.random() * 200) + 1; // Increased range
    const avgSessionDuration = Math.random() * 3600 + 30; // Increased range
    const totalSpent = Math.random() * 10000 + 10; // Increased range
    const lastActive = generateDate('2024-01-01', '2024-12-31');
    
    return {
      user_id: `USER-${String(i + 1).padStart(6, '0')}`,
      name,
      email: generateEmail(name),
      total_sessions: totalSessions,
      avg_session_duration: parseFloat(avgSessionDuration.toFixed(2)),
      total_spent: parseFloat(totalSpent.toFixed(2)),
      orders_count: Math.floor(totalSpent / (Math.random() * 50 + 25)) + 1, // More varied calculation
      last_active: lastActive,
      status: USER_STATUSES[Math.floor(Math.random() * USER_STATUSES.length)],
      customer_segment: CUSTOMER_SEGMENTS[Math.floor(Math.random() * CUSTOMER_SEGMENTS.length)],
      registration_date: generateDate('2020-01-01', lastActive),
      is_premium: Math.random() > 0.6 // Adjusted probability
    };
  });
};

// Generate sales data
const generateSalesData = (count: number, dateRange?: { start: string; end: string }) => {
  const startDate = dateRange?.start || '2023-01-01';
  const endDate = dateRange?.end || '2024-12-31';
  
  return Array.from({ length: count }, (_, i) => {
    const quantity = Math.floor(Math.random() * 20) + 1; // Increased range
    const unitPrice = Math.random() * 1000 + 10; // Increased range
    const revenue = quantity * unitPrice;
    const cost = revenue * (0.2 + Math.random() * 0.6); // More varied cost margin
    const profit = revenue - cost;
    
    return {
      sale_id: `SALE-${String(i + 1).padStart(8, '0')}`,
      product_name: `${PRODUCT_CATEGORIES[Math.floor(Math.random() * PRODUCT_CATEGORIES.length)]} Item ${i + 1}`,
      category: PRODUCT_CATEGORIES[Math.floor(Math.random() * PRODUCT_CATEGORIES.length)],
      quantity: quantity,
      unit_price: parseFloat(unitPrice.toFixed(2)),
      revenue: parseFloat(revenue.toFixed(2)),
      cost: parseFloat(cost.toFixed(2)),
      profit: parseFloat(profit.toFixed(2)),
      profit_margin: parseFloat((profit / revenue).toFixed(3)),
      sale_date: generateDate(startDate, endDate),
      customer_id: `CUST-${Math.floor(Math.random() * 50000) + 1}`, // Increased range
      sales_rep: generateName(),
      region: ['North', 'South', 'East', 'West', 'Central', 'International'][Math.floor(Math.random() * 6)], // Added more regions
      payment_method: ['Credit Card', 'Debit Card', 'PayPal', 'Bank Transfer', 'Cash', 'Crypto'][Math.floor(Math.random() * 6)] // Added more payment methods
    };
  });
};

// Generate inventory data
const generateInventoryData = (count: number) => {
  return Array.from({ length: count }, (_, i) => {
    const currentStock = Math.floor(Math.random() * 2000) + 1; // Increased range
    const reorderLevel = Math.floor(currentStock * (0.1 + Math.random() * 0.3)); // More varied reorder level
    const isLowStock = currentStock <= reorderLevel;
    
    return {
      product_id: `INV-${String(i + 1).padStart(6, '0')}`,
      product_name: `${PRODUCT_CATEGORIES[Math.floor(Math.random() * PRODUCT_CATEGORIES.length)]} Product ${i + 1}`,
      category: PRODUCT_CATEGORIES[Math.floor(Math.random() * PRODUCT_CATEGORIES.length)],
      current_stock: currentStock,
      reorder_level: reorderLevel,
      max_stock: currentStock + Math.floor(Math.random() * 1000), // Increased range
      unit_cost: parseFloat((Math.random() * 200 + 5).toFixed(2)), // Increased range
      total_value: parseFloat((currentStock * (Math.random() * 200 + 5)).toFixed(2)),
      supplier: `Supplier ${Math.floor(Math.random() * 50) + 1}`, // Increased range
      last_restocked: generateDate('2024-01-01', '2024-12-31'),
      is_low_stock: isLowStock,
      days_since_last_order: Math.floor(Math.random() * 60) + 1, // Increased range
      warehouse_location: `Warehouse ${String.fromCharCode(65 + Math.floor(Math.random() * 8))}` // More warehouses
    };
  });
};

// Generate customer orders data
const generateCustomerOrders = (count: number) => {
  return Array.from({ length: count }, (_, i) => {
    const customerName = generateName();
    const orderValue = Math.random() * 5000 + 10; // Increased range
    const itemsCount = Math.floor(Math.random() * 20) + 1; // Increased range
    
    return {
      order_id: `ORD-${String(i + 1).padStart(8, '0')}`,
      customer_name: customerName,
      customer_email: generateEmail(customerName),
      order_date: generateDate('2023-01-01', '2024-12-31'),
      order_value: parseFloat(orderValue.toFixed(2)),
      items_count: itemsCount,
      shipping_address: `${Math.floor(Math.random() * 9999) + 1} ${getRandomStreet()}, City ${Math.floor(Math.random() * 200) + 1}`, // More varied addresses
      order_status: ORDER_STATUSES[Math.floor(Math.random() * ORDER_STATUSES.length)],
      payment_status: Math.random() > 0.15 ? 'Paid' : 'Pending', // Adjusted probability
      shipping_method: ['Standard', 'Express', 'Overnight', 'Same Day', 'International'][Math.floor(Math.random() * 5)], // Added more shipping methods
      customer_segment: CUSTOMER_SEGMENTS[Math.floor(Math.random() * CUSTOMER_SEGMENTS.length)],
      loyalty_points: Math.floor(orderValue / (Math.random() * 20 + 5)), // More varied calculation
      discount_applied: parseFloat((orderValue * (Math.random() * 0.3)).toFixed(2)) // Increased discount range
    };
  });
};

// Generate financial metrics data
const generateFinancialMetrics = (count: number) => {
  return Array.from({ length: count }, (_, i) => {
    const revenue = Math.random() * 2000000 + 100000; // Increased range
    const expenses = revenue * (0.5 + Math.random() * 0.4); // More varied expense ratio (50-90% of revenue)
    const profit = revenue - expenses;
    const profitMargin = profit / revenue;
    
    return {
      period_id: `PERIOD-${String(i + 1).padStart(4, '0')}`,
      period_name: `Q${Math.floor(i / 3) + 1} ${2023 + Math.floor(i / 4)}`,
      revenue: parseFloat(revenue.toFixed(2)),
      expenses: parseFloat(expenses.toFixed(2)),
      profit: parseFloat(profit.toFixed(2)),
      profit_margin: parseFloat(profitMargin.toFixed(4)),
      gross_margin: parseFloat((1 - (expenses * (0.6 + Math.random() * 0.3)) / revenue).toFixed(4)), // More varied gross margin
      operating_margin: parseFloat((profit / revenue).toFixed(4)),
      customer_count: Math.floor(Math.random() * 20000) + 1000, // Increased range
      avg_order_value: parseFloat((revenue / (Math.floor(Math.random() * 20000) + 1000)).toFixed(2)),
      customer_acquisition_cost: parseFloat((Math.random() * 500 + 25).toFixed(2)), // Increased range
      customer_lifetime_value: parseFloat((Math.random() * 5000 + 250).toFixed(2)), // Increased range
      churn_rate: parseFloat((Math.random() * 0.25).toFixed(4)), // Increased range
      period_start: generateDate('2023-01-01', '2024-12-31'),
      period_end: generateDate('2023-01-01', '2024-12-31')
    };
  });
};

// Main data generator function
export const generateDataset = (config: DataSetConfig) => {
  const { type, count, dateRange } = config;
  
  switch (type) {
    case 'employees':
      return generateEmployeeData(count);
    case 'userAnalytics':
      return generateUserAnalytics(count);
    case 'salesData':
      return generateSalesData(count, dateRange);
    case 'inventory':
      return generateInventoryData(count);
    case 'customerOrders':
      return generateCustomerOrders(count);
    case 'financialMetrics':
      return generateFinancialMetrics(count);
    default:
      return generateEmployeeData(count);
  }
};

// Generate columns for each dataset type
export const getDatasetColumns = (type: DataSetConfig['type']): string[] => {
  switch (type) {
    case 'employees':
      return [
        'employeeID', 'lastName', 'firstName', 'title', 'titleOfCourtesy',
        'birthDate', 'hireDate', 'address', 'city', 'region', 'postalCode',
        'country', 'homePhone', 'extension', 'photo', 'notes', 'reportsTo', 'photoPath'
      ];
    case 'userAnalytics':
      return [
        'user_id', 'name', 'email', 'total_sessions', 'avg_session_duration',
        'total_spent', 'orders_count', 'last_active', 'status', 'customer_segment',
        'registration_date', 'is_premium'
      ];
    case 'salesData':
      return [
        'sale_id', 'product_name', 'category', 'quantity', 'unit_price',
        'revenue', 'cost', 'profit', 'profit_margin', 'sale_date',
        'customer_id', 'sales_rep', 'region', 'payment_method'
      ];
    case 'inventory':
      return [
        'product_id', 'product_name', 'category', 'current_stock', 'reorder_level',
        'max_stock', 'unit_cost', 'total_value', 'supplier', 'last_restocked',
        'is_low_stock', 'days_since_last_order', 'warehouse_location'
      ];
    case 'customerOrders':
      return [
        'order_id', 'customer_name', 'customer_email', 'order_date', 'order_value',
        'items_count', 'shipping_address', 'order_status', 'payment_status',
        'shipping_method', 'customer_segment', 'loyalty_points', 'discount_applied'
      ];
    case 'financialMetrics':
      return [
        'period_id', 'period_name', 'revenue', 'expenses', 'profit',
        'profit_margin', 'gross_margin', 'operating_margin', 'customer_count',
        'avg_order_value', 'customer_acquisition_cost', 'customer_lifetime_value',
        'churn_rate', 'period_start', 'period_end'
      ];
    default:
      return ['id', 'name', 'value'];
  }
};

// Performance monitoring
export const measureDataGeneration = (type: DataSetConfig['type'], count: number) => {
  const startTime = performance.now();
  const data = generateDataset({ type, count });
  const endTime = performance.now();
  
  // Debug logging for development
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔢 Generated ${data.length} rows of ${type} data in ${(endTime - startTime).toFixed(2)}ms`);
  }
  
  return {
    data,
    generationTime: endTime - startTime,
    memoryUsage: 0, // performance.memory not available in all browsers
    rowCount: data.length
  };
};

// Debug function to test randomization
export const testRandomization = () => {
  const testResults: Array<{
    type: DataSetConfig['type'];
    counts: number[];
    average: number;
  }> = [];
  const dataTypes: DataSetConfig['type'][] = ['employees', 'salesData', 'inventory', 'customerOrders', 'userAnalytics', 'financialMetrics'];
  
  dataTypes.forEach(type => {
    const counts: number[] = [];
    for (let i = 0; i < 5; i++) {
      const count = Math.floor(Math.random() * 20) + 5;
      const result = generateDataset({ type, count });
      counts.push(result.length);
    }
    testResults.push({ type, counts, average: counts.reduce((a, b) => a + b, 0) / counts.length });
  });
  
  console.log('🎲 Randomization Test Results:', testResults);
  return testResults;
}; 
# Personal Finance Manager

A comprehensive web application for tracking personal finances, budgeting, and visualizing financial data.

## Features

- **Dashboard**: Get a quick overview of your financial status
- **Income Tracking**: Log and categorize all sources of income
- **Expense Tracking**: Record and categorize all expenses
- **Budget Management**: Create and manage monthly budgets for different categories
- **Savings Goals**: Set and track progress towards financial goals
- **Data Visualization**: View spending patterns and financial trends with interactive charts
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Screenshots

![Dashboard](https://via.placeholder.com/800x450.png?text=Dashboard+Screenshot)
![Budget Management](https://via.placeholder.com/800x450.png?text=Budget+Management+Screenshot)
![Expense Tracking](https://via.placeholder.com/800x450.png?text=Expense+Tracking+Screenshot)

## Technologies Used

- **Frontend**: React, Chakra UI, Chart.js
- **Backend**: Firebase (Authentication, Firestore)
- **Deployment**: Firebase Hosting

## Installation and Setup

### Prerequisites
- Node.js (v14 or later)
- npm or yarn

### Steps to run locally

1. Clone the repository
   ```
   git clone https://github.com/Latex999/personal-finance-manager.git
   cd personal-finance-manager
   ```

2. Install dependencies
   ```
   npm install
   ```
   
3. Create a `.env` file in the root directory with your Firebase configuration
   ```
   REACT_APP_FIREBASE_API_KEY=your-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id
   ```

4. Start the development server
   ```
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Usage Guide

1. **Sign Up/Login**: Create an account or log in to access your financial data
2. **Add Income**: Record income sources with details like amount, date, and category
3. **Track Expenses**: Log expenses with amount, date, category, and optional notes
4. **Set Budgets**: Create monthly budgets for different spending categories
5. **Create Savings Goals**: Set financial goals with target amounts and deadlines
6. **Analyze Data**: View charts and reports to better understand your spending habits

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Icons provided by [FontAwesome](https://fontawesome.com/)
- Charts powered by [Chart.js](https://www.chartjs.org/)
- UI components from [Chakra UI](https://chakra-ui.com/)
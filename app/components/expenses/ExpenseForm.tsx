import {
  Form,
  Link,
  useActionData,
  useMatches,
  useNavigation,
  useParams,
} from '@remix-run/react';
import type { Expense } from '~/types';

function ExpenseForm() {
  const today = new Date().toISOString().slice(0, 10); // yields something like 2023-09-10
  const validationErrors = useActionData();
  const navigation = useNavigation();
  const params = useParams();
  const matches = useMatches();

  const expensesData = matches.find(
    (match) => match.id === 'routes/_app.expenses'
  )?.data;
  const expenseData = expensesData.find(
    (expense: Expense) => expense.id === params.id
  );

  if (params.id && !expenseData) {
    // Solution 1 -> Displays the ErrorBoundary component
    // throw new Response();

    // Solution 2
    return <p>Invalid expense id.</p>;
  }

  // If the user is in UpdateExpensePage then the form has
  // default values otherwise is empty.
  const defaultValues = expenseData
    ? {
        title: expenseData.title,
        amount: expenseData.amount,
        date: expenseData.date,
      }
    : {
        title: '',
        amount: '',
        date: '',
      };

  const isSubmitting = navigation.state !== 'idle';

  return (
    <Form
      method={expenseData ? 'PATCH' : 'POST'}
      className="form"
      id="expense-form"
    >
      <p>
        <label htmlFor="title">Expense Title</label>
        <input
          type="text"
          id="title"
          name="title"
          required
          maxLength={30}
          defaultValue={defaultValues.title}
        />
      </p>

      <div className="form-row">
        <p>
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            min="0"
            step="0.01"
            required
            defaultValue={defaultValues.amount}
          />
        </p>
        <p>
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            max={today}
            required
            defaultValue={
              defaultValues.date ? defaultValues.date.slice(0, 10) : ''
            }
          />
        </p>
      </div>
      {validationErrors && (
        <ul>
          {Object.values(validationErrors).map((error: any) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
      <div className="form-actions">
        <button disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Expense'}
        </button>
        <Link to="..">Cancel</Link>
      </div>
    </Form>
  );
}

export default ExpenseForm;

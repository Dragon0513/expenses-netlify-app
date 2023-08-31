import { type ActionArgs, redirect } from '@remix-run/node';
import { useNavigate } from '@remix-run/react';

import ExpenseForm from '~/components/expenses/ExpenseForm';
import Modal from '~/components/util/Modal';
import { requireUserSession } from '~/utils/auth.server';
import { addExpense } from '~/utils/expenses.server';
import { validateExpenseInput } from '~/utils/validation.server';

export default function AddExpensesPage() {
  const navigate = useNavigate();

  function closeHandler() {
    // Navigate programmatically to the parent route
    navigate('..');
  }

  return (
    <Modal onClose={closeHandler}>
      <ExpenseForm />
    </Modal>
  );
}

// Adds a new expense in the mongodb
export async function action({ request }: ActionArgs) {
  const userId = await requireUserSession(request);

  const formData = await request.formData();
  const expenseData = Object.fromEntries(formData);

  try {
    validateExpenseInput(expenseData);
  } catch (error) {
    return error;
  }

  await addExpense(expenseData, userId);
  return redirect('/expenses');
}

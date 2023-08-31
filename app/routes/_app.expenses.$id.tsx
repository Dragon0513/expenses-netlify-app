import {
  type ActionArgs,
  redirect,
  json,
  type V2_MetaFunction,
} from '@remix-run/node';
import { useNavigate } from '@remix-run/react';

import ExpenseForm from '~/components/expenses/ExpenseForm';
import Modal from '~/components/util/Modal';
import { deleteExpense, updateExpense } from '~/utils/expenses.server';
import { validateExpenseInput } from '~/utils/validation.server';
import type { loader as expensesDetails, loader } from './_app.expenses';

export default function UpdatedExpensesPage() {
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

export async function action({ request, params }: ActionArgs) {
  const expenseId = params.id;

  // Updates the expense data and saves it in the mongodb
  if (request.method === 'PATCH') {
    const formData = await request.formData();
    const expenseData = Object.fromEntries(formData);

    try {
      validateExpenseInput(expenseData);
    } catch (error) {
      return error;
    }

    await updateExpense(expenseId, expenseData);
    return redirect('/expenses');
  }
  // Deletes an expense
  else if (request.method === 'DELETE') {
    await deleteExpense(expenseId);
    return json({ deletedId: expenseId });
  }
}

export const meta: V2_MetaFunction<
  typeof loader,
  { 'routes/_app.expenses': typeof expensesDetails }
> = ({ matches, params }) => {
  const expenseData = matches.find(
    (match: any) => match.id === 'routes/_app.expenses'
  );
  const expense = expenseData!.data.find((expense) => expense.id === params.id);

  return [
    { title: expense?.title },
    {
      name: 'description',
      content: 'Update expense.',
    },
  ];
};

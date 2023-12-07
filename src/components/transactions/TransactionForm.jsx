import { useCallback, useEffect } from 'react';
import useSWRMutation from 'swr/mutation';
import { useNavigate } from 'react-router-dom';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { save } from '../../api';
import Error from '../Error';
import LabelInput from '../LabelInput';

const toDateInputString = (date) => {
  // ISO String without the trailing 'Z' is fine 🙄
  // (toISOString returns something like 2020-12-05T14:15:74Z,
  // datetime-local HTML5 input elements expect 2020-12-05T14:15:74, without the (timezone) Z)
  //
  // the best thing about standards is that we have so many to chose from!
  if (!date) return null;
  if (typeof date !== Object) {
    date = new Date(date);
  }
  let asString = date.toISOString();
  return asString.substring(0, asString.indexOf('T'));
};

const validationRules = {
  date: { required: 'Date is required' },
  place: { required: 'Place is required' },
  amount: {
    valueAsNumber: true,
    required: 'Amount is required',
    min: { value: 1, message: 'min 1' },
    max: { value: 5000, message: 'max 5000' },
  },
};

function PlacesSelect({ name, places, ...rest }) {
  const {
    register,
    formState: {
      errors,
      isSubmitting,
    },
  } = useFormContext();

  const hasError = name in errors;

  return (
    <div className='mb-3'>
      <label htmlFor={name} className='form-label'>
        Places
      </label>
      <select {...register(name)} id={name} className='form-select' disabled={isSubmitting} {...rest}>
        <option defaultChecked value=''>
          -- Select a place --
        </option>
        {places.map(({ id, name }) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </select>
      {hasError ? (
        <div className='form-text text-danger' data-cy="places_select_error">{errors[name].message}</div>
      ) : null}
    </div>
  );
}

export default function TransactionForm({
  places,
  transaction,
}) {
  const navigate = useNavigate();
  const {
    trigger: saveTransaction,
    error: saveError,
  } = useSWRMutation('transactions', save);

  const methods = useForm();
  const {
    handleSubmit,
    reset,
    setValue,
    isSubmitting,
  } = methods;

  const onSubmit = useCallback(async (data) => {
    const { place, amount, date } = data;
    try {
      await saveTransaction({
        placeId: place,
        amount: parseInt(amount),
        date,
        id: transaction?.id,
      });
      navigate('/transactions');
    }
    catch (error) {
      console.log(error);
    }
  }, [saveTransaction, navigate, transaction?.id]);

  useEffect(() => {
    if (
      // check on non-empty object
      transaction &&
      (Object.keys(transaction).length !== 0 ||
        transaction.constructor !== Object)
    ) {
      const dateAsString = toDateInputString(new Date(transaction.date));
      setValue("date", dateAsString);
      setValue("place", transaction.place.id);
      setValue("amount", transaction.amount);
    } else {
      reset();
    }
  }, [transaction, setValue, reset]);

  return (
    <>
      <Error error={saveError} />

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className='mb-5'>
          <LabelInput
            label='Date'
            name='date'
            type='date'
            validationRules={validationRules.date}
            data-cy="date_input"
          />

          <PlacesSelect name='place' places={places} data-cy="place_input" />

          <LabelInput
            label='Amount'
            name='amount'
            type='number'
            validationRules={validationRules.amount}
            data-cy="amount_input"
          />

          <div className='clearfix'>
            <div className='btn-group float-end'>
              <button
                type='submit'
                className='btn btn-primary'
                disabled={isSubmitting}
                data-cy="submit_transaction"
              >
                {transaction?.id
                  ? "Save transaction"
                  : "Add transaction"}
              </button>
            </div>
          </div>
        </form>
      </FormProvider>
    </>
  );
}

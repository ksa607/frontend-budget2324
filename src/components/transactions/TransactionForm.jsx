import { useCallback, useEffect } from 'react';
import useSWRMutation from 'swr/mutation';
import { getAll, save } from '../../api';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import Error from '../Error';
import useSWR from 'swr';

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
  user: {
    required: 'User is required',
    min: { value: 1, message: 'min 1' },
  },
  date: { required: 'Date is required' },
  place: { required: 'Place is required' },
  amount: {
    valueAsNumber: true,
    required: 'Amount is required',
    min: { value: 1, message: 'min 1' },
    max: { value: 5000, message: 'max 5000' },
  },
};

function LabelInput({ label, name, type, validationRules, ...rest }) {
  const {
    register,
    errors,
    isSubmitting
  } = useFormContext();

  const hasError = name in errors;

  return (
    <div className='mb-3'>
      <label htmlFor={name} className='form-label'>
        {label}
      </label>
      <input
        {...register(name, validationRules)}
        id={name}
        type={type}
        disabled={isSubmitting}
        className='form-control'
        {...rest}
      />
      {hasError ? (
        <div className='form-text text-danger'>{errors[name].message}</div>
      ) : null}
    </div>
  );
}

function PlacesSelect({ name, places }) {
  const {
    register,
    errors,
    isSubmitting
  } = useFormContext();

  const hasError = name in errors;

  return (
    <div className='mb-3'>
      <label htmlFor={name} className='form-label'>
        Places
      </label>
      <select {...register(name)} id={name} className='form-select' disabled={isSubmitting}>
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
        <div className='form-text text-danger'>{errors[name]}</div>
      ) : null}
    </div>
  );
}

export default function TransactionForm({
  currentTransaction,
  setTransactionToUpdate,
}) {
  const {
    data: places = [],
  } = useSWR('places', getAll);
  const {
    trigger: saveTransaction,
    error: saveError,
  } = useSWRMutation('transactions', save);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    isSubmitting,
  } = useForm();

  const onSubmit = useCallback(async (data) => {
    const { user, place, amount, date } = data;
    await saveTransaction({
      userId: user,
      placeId: place,
      amount: parseInt(amount),
      date,
      id: currentTransaction?.id,
    });
    setTransactionToUpdate(null);
  }, [reset, saveTransaction]);

  useEffect(() => {
    if (
      // check on non-empty object
      currentTransaction &&
      (Object.keys(currentTransaction).length !== 0 ||
          currentTransaction.constructor !== Object)
    ) {
      const dateAsString = toDateInputString(new Date(currentTransaction.date));
      setValue("date", dateAsString);
      setValue("user", currentTransaction.user.name);
      setValue("place", currentTransaction.place.id);
      setValue("amount", currentTransaction.amount);
    } else {
      reset();
    }
  }, [currentTransaction, setValue, reset]);

  return (
    <>
      <h2>Add transaction</h2>
      <Error error={saveError} />

      <FormProvider
        handleSubmit={handleSubmit}
        errors={errors}
        register={register}
        isSubmitting={isSubmitting}
      >
        <form onSubmit={handleSubmit(onSubmit)} className='mb-5'>
          <div className='mb-3'>
            <LabelInput
              label='User ID'
              name='user'
              type='number'
              validationRules={validationRules.user}
            />
          </div>

          <div className='mb-3'>
            <LabelInput
              label='Date'
              name='date'
              type='date'
              validationRules={validationRules.date}
            />
          </div>

          <div className='mb-3'>
            <PlacesSelect name='place' places={places} />
          </div>

          <div className='mb-3'>
            <LabelInput
              label='Amount'
              name='amount'
              type='amount'
              validationRules={validationRules.amount}
            />
          </div>

          <div className='clearfix'>
            <div className='btn-group float-end'>
              <button
                type='submit'
                className='btn btn-primary'
                disabled={isSubmitting}
              >
                {currentTransaction?.id
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
